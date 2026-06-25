document.addEventListener("DOMContentLoaded", () => {
  // Базові елементи плеєра
  const audio = document.getElementById("audio");
  const playBtn = document.getElementById("play-btn");
  const playIcon = document.getElementById("play-icon");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const progress = document.getElementById("progress");
  const currentTimeEl = document.getElementById("current-time");
  const totalTimeEl = document.getElementById("total-time");
  const trackTitleEl = document.getElementById("track-title");
  const albumArtEl = document.getElementById("album-art");

  // Елементи гучності
  const volumeSlider = document.getElementById("volume-slider");
  const muteBtn = document.getElementById("mute-btn");
  const volumeIcon = document.getElementById("volume-icon");

  // --- Наш плейлист ---
  // Додавай сюди нові треки, просто копіюючи блоки {...}
  const playlist = [
    {
      title: "CORTISOL BAIXO",
      audioSrc: "./assets/music.mp3",
      coverSrc: "./assets/album.jpg"
    },
    {
      title: "BEMAX ARA ARA",
      audioSrc: "./assets/music2.mp3", // Не забудь завантажити цей файл у папку assets!
      coverSrc: "./assets/album2.jpg"  // І картинку теж
    },
    {
      title: "MONTAGEM YAMI",
      audioSrc: "./assets/music3.mp3",
      coverSrc: "./assets/album3.jpg"
    }
  ];

  let currentTrackIndex = 0;

  // --- Завантаження треку ---
  const loadTrack = (index) => {
    const track = playlist[index];
    trackTitleEl.textContent = track.title;
    audio.src = track.audioSrc;
    albumArtEl.src = track.coverSrc;
    
    // Скидаємо прогрес
    progress.value = 0;
    updateProgressVisuals(0);
    currentTimeEl.textContent = "0:00";
    
    // Щоб браузер встиг підтягнути нову довжину треку
    audio.load();
  };

  // --- Функції відтворення ---
  const playTrack = () => {
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          playIcon.classList.replace("fa-play", "fa-pause");
        })
        .catch((error) => console.error("Autoplay prevented:", error));
    }
  };

  const pauseTrack = () => {
    audio.pause();
    playIcon.classList.replace("fa-pause", "fa-play");
  };

  const prevTrack = () => {
    currentTrackIndex--;
    if (currentTrackIndex < 0) {
      currentTrackIndex = playlist.length - 1; // Перехід на останній трек
    }
    loadTrack(currentTrackIndex);
    playTrack();
  };

  const nextTrack = () => {
    currentTrackIndex++;
    if (currentTrackIndex > playlist.length - 1) {
      currentTrackIndex = 0; // Перехід на перший трек
    }
    loadTrack(currentTrackIndex);
    playTrack();
  };

  // --- Обробники кнопок плеєра ---
  playBtn.addEventListener("click", () => {
    if (audio.paused) {
      playTrack();
    } else {
      pauseTrack();
    }
  });

  prevBtn.addEventListener("click", prevTrack);
  nextBtn.addEventListener("click", nextTrack);

  // Автоматичне перемикання на наступний трек, коли поточний закінчився
  audio.addEventListener("ended", nextTrack);

  // --- Форматування часу та прогрес ---
  const formatTime = (time) => {
    if (isNaN(time) || !isFinite(time)) return "0:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const updateProgressVisuals = (value) => {
    progress.style.backgroundSize = `${value}% 100%`;
  };

  audio.addEventListener("loadedmetadata", () => {
    if (audio.duration) {
      totalTimeEl.textContent = formatTime(audio.duration);
    }
  });

  audio.addEventListener("timeupdate", () => {
    if (!isNaN(audio.duration) && audio.duration > 0) {
      const progressValue = (audio.currentTime / audio.duration) * 100;
      progress.value = progressValue;
      updateProgressVisuals(progressValue);
      currentTimeEl.textContent = formatTime(audio.currentTime);
    }
  });

  progress.addEventListener("input", (e) => {
    const value = e.target.value;
    updateProgressVisuals(value);
    if (!isNaN(audio.duration) && audio.duration > 0) {
      audio.currentTime = (value / 100) * audio.duration;
    }
  });

  // --- Логіка гучності ---
  const updateVolumeVisuals = (value) => {
    volumeSlider.style.backgroundSize = `${value * 100}% 100%`;

    if (value === 0) {
      volumeIcon.className = "fas fa-volume-mute";
    } else if (value < 0.5) {
      volumeIcon.className = "fas fa-volume-down";
    } else {
      volumeIcon.className = "fas fa-volume-up";
    }
  };

  // Початкова гучність
  let isMuted = false;
  let currentVolume = 0.4;
  audio.volume = currentVolume;
  volumeSlider.value = currentVolume;
  updateVolumeVisuals(currentVolume);

  volumeSlider.addEventListener("input", (e) => {
    const value = parseFloat(e.target.value);
    audio.volume = value;
    currentVolume = value;
    isMuted = value === 0;
    updateVolumeVisuals(value);
  });

  muteBtn.addEventListener("click", () => {
    isMuted = !isMuted;
    if (isMuted) {
      audio.volume = 0;
      volumeSlider.value = 0;
      updateVolumeVisuals(0);
    } else {
      const restoreVolume = currentVolume > 0 ? currentVolume : 1;
      audio.volume = restoreVolume;
      volumeSlider.value = restoreVolume;
      updateVolumeVisuals(restoreVolume);
    }
  });

  // --- Ефект друкування в заголовку вкладки ---
  const titleText = "sanfy";
  let index = 0;
  let isDeleting = false;
  let currentText = "";

  function animateTitle() {
    if (isDeleting) {
      currentText = titleText.substring(0, index - 1);
      index--;
    } else {
      currentText = titleText.substring(0, index + 1);
      index++;
    }

    document.title = currentText || " "; 

    if (!isDeleting && index === titleText.length) {
      setTimeout(() => (isDeleting = true), 2000); 
    } else if (isDeleting && index === 0) {
      isDeleting = false;
    }

    setTimeout(animateTitle, isDeleting ? 150 : 300);
  }

  animateTitle();
});
