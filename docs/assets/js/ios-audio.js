class IOSAudioGuard {
  constructor(audioElement) {
    this.audioElement = audioElement;
    this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  install() {
    if (!this.isIOS) return;

    document.addEventListener('click', this.handleUserInteraction.bind(this));
    document.addEventListener('touchstart', this.handleUserInteraction.bind(this));
    
    this.audioElement.addEventListener('pause', (e) => {
      if (!this.audioElement.ended && !this.userPaused) {
        this.showResumePrompt();
      }
    });
  }

  handleUserInteraction() {
    if (this.audioElement.paused) {
      this.audioElement.play().catch(e => {
        console.error("Audio resume failed:", e);
      });
    }
  }

  showResumePrompt() {
    // iOS audio resume prompt UI
  }
}
