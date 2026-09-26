#!/usr/bin/env bash
# Validate an opencode config set: parseability + determinism invariants.
# Usage: validate.sh [dir]   (default: this directory; sync.sh passes the
# installed config dir so post-substitution files are checked too)
set -euo pipefail

DIR="${1:-$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)}"

python3 - "$DIR" <<'PY'
import json, os, re, sys

d = sys.argv[1]
fails = []

def load_strict(name):
    try:
        with open(os.path.join(d, name)) as f:
            return json.load(f)
    except Exception as e:
        fails.append(f"{name}: not valid strict JSON ({e})")
        return None

fallback = load_strict("fallback.json")
tiers = load_strict("tiers.json")
pkg = load_strict("package.json")
load_strict("package-lock.json")

cfg = None
try:
    src = open(os.path.join(d, "opencode.jsonc")).read()
    cfg = json.loads(re.sub(r"^\s*//.*$", "", src, flags=re.M))
except Exception as e:
    fails.append(f"opencode.jsonc: not parseable after stripping // comments ({e})")

BUILTIN_PROVIDERS = {"openrouter"}  # shipped by opencode, not declared in config
REMOVED_PROVIDERS = {"nvidia-proxy", "ollama"}

if cfg:
    providers = set(cfg.get("provider", {}))
    known = providers | BUILTIN_PROVIDERS

    # 1. providers removed because they were broken must stay gone
    for p in REMOVED_PROVIDERS:
        if p in providers:
            fails.append(f"provider.{p}: removed provider reappeared")

    # 2. mcp server enabled while listed in disabled_providers = contradiction
    dis = set(cfg.get("disabled_providers", []))
    for name, mcfg in cfg.get("mcp", {}).items():
        if name in dis and mcfg.get("enabled", True):
            fails.append(f"mcp.{name} enabled but listed in disabled_providers")
    if "headroom" in cfg.get("mcp", {}):
        fails.append("mcp.headroom: removed server reappeared")
    if "headroom" in dis:
        fails.append("disabled_providers: stale headroom entry")

    # 3. plugin list: no removed plugins, superpowers goes through the bridge
    plugins = cfg.get("plugin", [])
    for p in plugins:
        if "ghilteras" in p or p in ("headroom", "headroom-opencode"):
            fails.append(f"plugin: removed plugin reappeared ({p})")
        if p == "superpowers":
            fails.append("plugin: bare 'superpowers' breaks opencode 1.x loader — use plugins/superpowers-bridge.js")
    if not any("superpowers-bridge.js" in p for p in plugins):
        fails.append("plugin: superpowers-bridge.js is not registered")
    if not os.path.isfile(os.path.join(d, "plugins", "superpowers-bridge.js")):
        fails.append("plugins/superpowers-bridge.js: missing from config dir (sync.sh not run?)")

    # 4. default model + agent models fully qualified, live provider
    def check_model(mid, where):
        if "/" not in mid:
            fails.append(f"{where}: unqualified model id {mid!r}")
        else:
            prov = mid.split("/", 1)[0]
            if prov in REMOVED_PROVIDERS:
                fails.append(f"{where}: removed provider in {mid!r}")
            elif prov not in known:
                fails.append(f"{where}: unknown provider in {mid!r}")
    if cfg.get("model"):
        check_model(cfg["model"], "model (default)")
    for agent, acfg in cfg.get("agent", {}).items():
        if acfg.get("model"):
            check_model(acfg["model"], f"agent.{agent}.model")

# 5. plugin deps exactly pinned (git deps must be SHA-pinned)
if pkg:
    for name, spec in pkg.get("dependencies", {}).items():
        if spec.startswith("git+"):
            if not re.search(r"#[0-9a-f]{40}$", spec):
                fails.append(f"dependency {name}: git spec not pinned to full commit SHA ({spec})")
        elif not re.fullmatch(r"\d+\.\d+\.\d+", spec):
            fails.append(f"dependency {name}: not exact-pinned ({spec})")

# 5b. bridge must expose exactly one export (any extra named export makes
#     opencode's legacy Object.values() scan throw on it)
bridge_path = os.path.join(d, "plugins", "superpowers-bridge.js")
if os.path.isfile(bridge_path):
    src = open(bridge_path).read()
    exports = re.findall(r"^\s*export\s", src, flags=re.M)
    if len(exports) != 1 or not re.search(r"^\s*export\s+default\s", src, flags=re.M):
        fails.append("plugins/superpowers-bridge.js: must contain exactly one statement: `export default {...}`")

# 6. every fallback hop / largeContextModel fully qualified, live provider
if fallback:
    def hop_ids(entry):
        entry = entry if isinstance(entry, list) else [entry]
        for h in entry:
            yield h if isinstance(h, str) else h.get("model", "")
    models = list(hop_ids(fallback.get("defaultFallback", [])))
    for agent, acfg in fallback.get("agents", {}).items():
        models += list(hop_ids(acfg.get("fallback", [])))
        if acfg.get("largeContextModel"):
            models.append(acfg["largeContextModel"])
    for mid in models:
        if "/" not in mid:
            fails.append(f"fallback: unqualified model id {mid!r}")
        elif mid.split("/", 1)[0] in REMOVED_PROVIDERS:
            fails.append(f"fallback: removed provider in {mid!r}")

# 7. tier presets must not reference the removed antigravity channel, and
#    google models must be defined in opencode.jsonc
if tiers:
    defined_google = set()
    if cfg:
        defined_google = set(cfg.get("provider", {}).get("google", {}).get("models", {}))
    for preset, tierspec in tiers.get("presets", {}).items():
        for tier, tcfg in tierspec.items():
            mid = tcfg.get("model", "")
            if "antigravity" in mid:
                fails.append(f"tiers {preset}/{tier}: still on antigravity channel ({mid})")
            if mid.startswith("google/") and defined_google and mid.split("/", 1)[1] not in defined_google:
                fails.append(f"tiers {preset}/{tier}: {mid} not defined in opencode.jsonc")

    # 8. rules[] is the plugin's display/fallback copy of
    #    modes.standard.overrideRules — they must not drift apart
    if tiers.get("rules") != tiers.get("modes", {}).get("standard", {}).get("overrideRules"):
        fails.append("tiers: rules[] has drifted from modes.standard.overrideRules")

if fails:
    for f in fails:
        print(f"✖ FAIL: {f}", file=sys.stderr)
    sys.exit(1)

print(f"✔ validation passed ({d})")
PY
