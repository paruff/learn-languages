class AudioPlayer extends HTMLElement {
  audio!: HTMLAudioElement;
  playBtn!: HTMLButtonElement;
  progress!: HTMLDivElement;
  currentTimeEl!: HTMLSpanElement;
  durationEl!: HTMLSpanElement;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const src = this.getAttribute('data-src') ?? '';
    const label = this.getAttribute('aria-label') || 'Audio player';

    this.shadowRoot!.innerHTML = `
      <style>
        :host { display: block; }
        .audio-player {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          max-width: 500px;
          padding: 12px 16px;
          background: var(--color-bg-secondary, #f9fafb);
          border: 1px solid var(--color-border, #e5e7eb);
          border-radius: 8px;
        }
        .audio-player__btn {
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          color: var(--color-text, #1f2937);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .audio-player__btn:hover { background: var(--color-border, #e5e7eb); }
        .audio-player__btn:focus-visible {
          outline: 2px solid var(--color-focus, #2563eb);
          outline-offset: 2px;
        }
        .audio-player__progress {
          flex: 1;
          height: 4px;
          background: var(--color-border, #e5e7eb);
          border-radius: 2px;
          cursor: pointer;
          position: relative;
        }
        .audio-player__progress-fill {
          height: 100%;
          background: var(--color-primary, #2563eb);
          border-radius: 2px;
          width: 0%;
          transition: width 0.1s linear;
        }
        .audio-player__time {
          font-size: 0.75rem;
          color: var(--color-text-muted, #6b7280);
          font-variant-numeric: tabular-nums;
          min-width: 45px;
          text-align: right;
        }
        .audio-player__time--current { text-align: left; }
      </style>
      <div class="audio-player" role="region" aria-label="${label}" aria-live="polite">
        <button class="audio-player__btn" aria-label="Play" data-action="play">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        </button>
        <div class="audio-player__progress" data-action="seek" aria-label="Seek">
          <div class="audio-player__progress-fill"></div>
        </div>
        <span class="audio-player__time audio-player__time--current">0:00</span>
        <span class="audio-player__time">0:00</span>
      </div>
    `;

    this.audio = new Audio(src);
    this.playBtn = this.shadowRoot!.querySelector<HTMLButtonElement>('[data-action="play"]')!;
    this.progress = this.shadowRoot!.querySelector<HTMLDivElement>('[data-action="seek"]')!;
    this.currentTimeEl = this.shadowRoot!.querySelector<HTMLSpanElement>(
      '.audio-player__time--current'
    )!;
    this.durationEl = this.shadowRoot!.querySelector<HTMLSpanElement>(
      '.audio-player__time:not(.audio-player__time--current)'
    )!;

    this.playBtn.addEventListener('click', () => this.togglePlay());
    this.progress.addEventListener('click', (e) => this.seek(e));
    this.audio.addEventListener('timeupdate', () => this.updateProgress());
    this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
    this.audio.addEventListener('ended', () => this.onEnded());
  }

  togglePlay() {
    if (this.audio.paused) {
      this.audio.play();
      this.playBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <rect x="6" y="4" width="4" height="16" />
          <rect x="14" y="4" width="4" height="16" />
        </svg>
      `;
      this.playBtn.setAttribute('aria-label', 'Pause');
    } else {
      this.audio.pause();
      this.playBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <polygon points="5,3 19,12 5,21" />
        </svg>
      `;
      this.playBtn.setAttribute('aria-label', 'Play');
    }
  }

  seek(e: MouseEvent) {
    const rect = this.progress.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    this.audio.currentTime = percent * this.audio.duration;
  }

  updateProgress() {
    const percent = (this.audio.currentTime / this.audio.duration) * 100;
    const fill = this.shadowRoot!.querySelector<HTMLDivElement>('.audio-player__progress-fill')!;
    fill.style.width = `${percent}%`;
    this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
  }

  updateDuration() {
    this.durationEl.textContent = this.formatTime(this.audio.duration);
  }

  onEnded() {
    this.playBtn.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <polygon points="5,3 19,12 5,21" />
      </svg>
    `;
    this.playBtn.setAttribute('aria-label', 'Replay');
    this.audio.currentTime = 0;
  }

  formatTime(seconds: number): string {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}

customElements.define('audio-player', AudioPlayer);
