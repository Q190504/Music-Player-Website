const audio = document.getElementById('audio');
const playPauseBtn = document.getElementById('play-pause');
const playPauseIcon = document.getElementById('play-pause-icon');
const rewindBtn = document.getElementById('rewind-button');
const forwardBtn = document.getElementById('forward-button');
const progressBar = document.getElementById('progress');
const volumeBar = document.getElementById('volume');
const currentSong = document.getElementById('current-song');

const playlist = [
    'musics/Mẹ Yêu Con.mp3',
    'musics/Trống Cơm.mp3',
    'musics/Chiếc Khăn Piêu.mp3',
    'musics/Đào Liễu.mp3',
    'musics/Mưa Trên Phố Huế.mp3',
    'musics/Dạ Cổ Hoài Lang.mp3',
    'musics/Liên Khúc Áo Mùa Đông x Trở Về.mp3',
    'musics/Thuận Nước Đẩy Thuyền.mp3',
    'musics/Dẫu Có Lỗi Lầm.mp3',
    'musics/Gene x Có Không Giữ Mất Đừng Tìm.mp3',
    'musics/Lặng.mp3',
    'musics/Thu Hoài.mp3',
    'musics/Là Anh Đó.mp3',
];

let currentIndex = 0;

// Play
function playSong() {
  const songPath = playlist[currentIndex];

  // Only change src if it's different
  const fullUrl = new URL(songPath, location.href).href;
  if (audio.src !== fullUrl) {
    audio.src = songPath;

    const fileName = songPath.split('/').pop().replace('.mp3', '');
    currentSong.textContent = fileName;
  }

  // Resume if paused, or play newly set src
  audio.play().then(() => {
    playPauseIcon.src = "icons/music-pause-button-pair-of-lines.png";
  }).catch(err => {
    console.error("Audio play failed:", err);
  });
}

// Pause
function pauseSong() {
    audio.pause();
    playPauseIcon.src = "icons/play-button-arrowhead.png";
}

// Play/Pause button
playPauseBtn.addEventListener("click", () => {
    audio.paused ? playSong() : pauseSong();
});

// Play next song
document.getElementById("next").onclick = () => {
    currentIndex = (currentIndex + 1) % playlist.length;
    playSong();
};

// Play previous song
document.getElementById("prev").onclick = () => {
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    playSong();
};

// Rewind
rewindBtn.addEventListener('click', () => {
  audio.currentTime = Math.max(0, audio.currentTime - 10);
});

// Forward
forwardBtn.addEventListener('click', () => {
  audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
});


// Select song from the playlist
function selectSong(index) {
    if (index < 0 || index >= playlist.length || currentIndex == index) return;
    currentIndex = index;
    playSong();
}

// Volume control
volumeBar.addEventListener("input", () => {
    audio.volume = volumeBar.value / 100;
});

// Upate progress bar as the song plays
audio.addEventListener("timeupdate", () => {
    if (!isNaN(audio.duration) && audio.duration > 0) {
        progressBar.value = (audio.currentTime / audio.duration) * 100;
    }
});

// Update audio current time when progress bar is changed
progressBar.addEventListener("input", () => {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
});

// Reset progress when new song is loaded
audio.addEventListener("loadedmetadata", () => {
    progressBar.value = 0;
});


// Audio context and DOM references
const audioCtx = new AudioContext();
const audioElement = document.querySelector('audio');
const canvas = document.querySelector('canvas');
const canvasCtx = canvas.getContext('2d');

// Connecting audio nodes
const audioSourceNode = audioCtx.createMediaElementSource(audioElement);
const analyserNode = audioCtx.createAnalyser();
audioSourceNode.connect(analyserNode);
analyserNode.connect(audioCtx.destination);

// Setup frequency data collection
analyserNode.fftSize = 256; // Controls how detailed the frequency data is
const bufferLength = analyserNode.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

// Draw the visualizer
function draw() {
    requestAnimationFrame(draw);
    analyserNode.getByteFrequencyData(dataArray);

    canvasCtx.fillStyle = '#fff';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 1.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        canvasCtx.fillStyle = `#0075ff`;
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
    }
}

// Start drawing when the audio plays
audioElement.onplay = () => {
    audioCtx.resume().then(() => {
        draw();
    });
}

// Set canvas to full width with high-DPI support
function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;

    // Set actual canvas resolution in *device pixels*
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;

    // Scale drawing context to match
    canvasCtx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform first
    canvasCtx.scale(dpr, dpr);
}


// Apply this once at start
resizeCanvas();