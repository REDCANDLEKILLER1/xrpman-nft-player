class PlayerStateManager {
  constructor() {
    this.STORAGE_KEY = 'xrpman_player_state';
  }

  saveState(state) {
    const data = {
      playlist: state.playlist.map(t => t.tokenId),
      currentIndex: state.currentIndex,
      volume: state.volume,
      shuffle: state.isShuffle,
      timestamp: Date.now()
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  loadState() {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return null;
    
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  clearState() {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
