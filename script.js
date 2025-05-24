const audio = document.getElementById('audio');
const playPauseBtn = document.getElementById('play-pause');
const playPauseIcon = document.getElementById('play-pause-icon');
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
    audio.src = playlist[currentIndex];
    const fullPath = playlist[currentIndex];
    const fileName = fullPath.split('/').pop().replace('.mp3', '');
    currentSong.textContent = fileName;
    audio.play();
    playPauseIcon.src = "icons/music-pause-button-pair-of-lines.png";
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
