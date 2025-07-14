class NFTVisualizer {
  constructor() {
    this.canvas = document.getElementById('visualizer');
    this.ctx = this.canvas.getContext('2d');
    this.analyser = null;
    this.dataArray = null;
    this.rafId = null;

    this.resize();
    window.addEventListener('resize', this.resize.bind(this));
  }

  connect(audioElement) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaElementSource(audioElement);
    this.analyser = audioCtx.createAnalyser();
    
    source.connect(this.analyser);
    this.analyser.connect(audioCtx.destination);
    
    this.analyser.fftSize = 256;
    const bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);
    
    this.rafId && cancelAnimationFrame(this.rafId);
    this.render();
  }

  resize() {
    this.canvas.width = this.canvas.offsetWidth * devicePixelRatio;
    this.canvas.height = this.canvas.offsetHeight * devicePixelRatio;
  }

  render() {
    if (!this.analyser) return;
    
    this.analyser.getByteFrequencyData(this.dataArray);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Cyberpunk style visualization
    const barWidth = (this.canvas.width / this.dataArray.length) * 2.5;
    let x = 0;
    
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#cc00ff');
    gradient.addColorStop(0.5, '#00ccff');
    gradient.addColorStop(1, '#00ff88');
    
    this.ctx.fillStyle = gradient;
    
    for (let i = 0; i < this.dataArray.length; i++) {
      const barHeight = (this.dataArray[i] / 255) * this.canvas.height;
      
      // Mirror effect
      const y = this.canvas.height - barHeight;
      this.ctx.fillRect(x, y, barWidth, barHeight);
      
      // Glow effect
      this.ctx.shadowColor = '#00ff88';
      this.ctx.shadowBlur = 10;
      
      x += barWidth + 1;
    }
    
    this.rafId = requestAnimationFrame(this.render.bind(this));
  }

  disconnect() {
    this.rafId && cancelAnimationFrame(this.rafId);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
