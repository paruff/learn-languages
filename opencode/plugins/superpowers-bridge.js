/**
 * Superpowers bridge for opencode 1.x.
 *
 * superpowers v6 ships mixed exports (string constants V1_MAPPING/V2_MAPPING,
 * a named SuperpowersPlugin fn, and a default object). opencode 1.18.30's
 * legacy loader iterates Object.values(mod) and throws
 * "Plugin export is not a function" on the first string export. Referencing
 * the bare "superpowers" package in the plugin list therefore never loads the
 * plugin (silent since 2026-09-23).
 *
 * This bridge exposes ONLY a default-export V1 plugin object, which satisfies
 * both of opencode's loader paths (readV1Plugin default-object detection and
 * the named-export fallback) regardless of ESM/CJS interop shape. It must keep
 * exactly one export — adding named string exports reintroduces the bug.
 *
 * Configured as an absolute __HOME__-substituted path in opencode.jsonc;
 * installed by opencode/sync.sh.
 */
import { SuperpowersPlugin } from 'superpowers/.opencode/plugins/superpowers.js';

export default {
  id: 'superpowers',
  server: SuperpowersPlugin,
};
