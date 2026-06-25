document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("audio");
  const playBtn = document.getElementById("play-btn");
  const playIcon = document.getElementById("play-icon");
  const progress = document.getElementById("progress");
  const currentTimeEl = document.getElementById("current-time");
  const totalTimeEl = document.getElementById("total-time");

  // Елементи гучності
  const volumeSlider = document.getElementById("volume-slider");
  const muteBtn = document.getElementById("mute-btn");
  const volumeIcon = document.getElementById("volume-icon");

  // Логіка гучності 
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

  // Встановлюємо початкову гучність 40%
  let isMuted = false;
  let currentVolume = 0.4; 
  audio.volume = currentVolume;
  volumeSlider.value = currentVolume;
  updateVolumeVisuals(currentVolume);

  // --- Логіка відтворення ---
  const formatTime = (time) => {
    if (isNaN(time) || !isFinite(time)) return "0:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const updateProgressVisuals = (value) => {
    progress.style.backgroundSize = `${value}% 100%`;
  };

  const setTotalTime = () => {
    if (audio.duration) {
      totalTimeEl.textContent = formatTime(audio.duration);
    }
  };

  if (audio.readyState >= 1) {
    setTotalTime();
  } else {
    audio.addEventListener("loadedmetadata", setTotalTime);
  }

  playBtn.addEventListener("click", () => {
    if (audio.paused) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            playIcon.classList.replace("fa-play", "fa-pause");
          })
          .catch((error) => console.error("Autoplay prevented:", error));
      }
    } else {
      audio.pause();
      playIcon.classList.replace("fa-pause", "fa-play");
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

  audio.addEventListener("ended", () => {
    playIcon.classList.replace("fa-pause", "fa-play");
    progress.value = 0;
    updateProgressVisuals(0);
    currentTimeEl.textContent = "0:00";
    audio.currentTime = 0;
  });

  // --- Обробники подій для гучності ---
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
});
