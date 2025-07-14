class XRPMANPlayer {
  constructor() {
    this.currentIndex = 0;
    this.isShuffle = false;
    this.playlist = [];
    this.audioElement = document.getElementById('audio-player');
    this.stateManager = new PlayerStateManager();
    this.iosAudio = new IOSAudioGuard(this.audioElement);
    this.visualizer = new NFTVisualizer();
    
    this.init();
  }

  async init() {
    this.loadPersistedState();
    this.setupEventListeners();
    this.iosAudio.install();
    
    // Check for wallet connection
    const wallet = await checkWalletSession();
    if (wallet) {
      this.loadNFTs(wallet);
    }
  }

  async loadNFTs(wallet) {
    try {
      const nfts = await fetchNFTs(wallet);
      this.playlist = NFTValidator.validateCollection(nfts);
      
      if (this.playlist.length) {
        this.playTrack();
      }
    } catch (error) {
      showError("Failed to load NFTs");
    }
  }

  async playTrack() {
    const track = this.playlist[this.currentIndex];
    if (!track) return;

    try {
      // Update UI
      updateTrackInfo(track);
      
      // Progressive loading
      await loadAudioWithCache(track.audio);
      
      // Play
      await this.audioElement.play();
      
      // Setup media session
      this.setupMediaSession(track);
      
      // Save state
      this.stateManager.saveState(this.getCurrentState());
    } catch (error) {
      handlePlaybackError(error);
    }
  }

  setupMediaSession(track) {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: 'XRPMAN',
        artwork: [{ src: track.image, sizes: '512x512' }]
      });

      navigator.mediaSession.setActionHandler('play', () => this.playPause());
      navigator.mediaSession.setActionHandler('pause', () => this.playPause());
      navigator.mediaSession.setActionHandler('previoustrack', () => this.skipBackward());
      navigator.mediaSession.setActionHandler('nexttrack', () => this.skipTrack());
    }
  }

  // ... additional player methods ...
}
