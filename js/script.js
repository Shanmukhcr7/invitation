// js/script.js

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lenis Smooth Scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Intro Logic
  const introScreen = document.getElementById('intro-screen');
  const skipBtn = document.getElementById('skip-intro');
  let introSkipped = false;

  const hideIntro = () => {
    if (introSkipped) return;
    introSkipped = true;
    
    // Try to autoplay music
    if (!isPlaying) {
      toggleMusic();
    }

    gsap.to(introScreen, {
      yPercent: -100,
      duration: 1.5,
      ease: 'power4.inOut',
      onComplete: () => {
        introScreen.style.display = 'none';
        document.body.classList.remove('loading');
        // Trigger main animations
        window.dispatchEvent(new Event('introComplete'));
      }
    });
  };

  skipBtn.addEventListener('click', hideIntro);

  // Audio Player Logic
  const musicToggle = document.getElementById('musicToggle');
  const bgAudio = document.getElementById('bg-audio');
  const musicIcon = musicToggle.querySelector('.icon');
  let isPlaying = false;

  const toggleMusic = () => {
    if (isPlaying) {
      bgAudio.pause();
      musicIcon.innerHTML = '&#9833;';
      musicToggle.classList.remove('playing');
    } else {
      bgAudio.play().catch(e => console.log("Audio play prevented by browser:", e));
      musicIcon.innerHTML = '&#9835;';
      musicToggle.classList.add('playing');
    }
    isPlaying = !isPlaying;
  };

  musicToggle.addEventListener('click', toggleMusic);

  // Fallback for browsers that block autoplay: play on first user interaction anywhere
  document.body.addEventListener('click', () => {
    if (!isPlaying && introSkipped) {
      toggleMusic();
    }
  }, { once: true });

  // Countdown Logic
  const targetDate = new Date("Aug 22, 2026 17:25:00").getTime();

  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      document.getElementById("val-days").innerText = "00";
      document.getElementById("val-hours").innerText = "00";
      document.getElementById("val-minutes").innerText = "00";
      document.getElementById("val-seconds").innerText = "00";
      // Trigger fireworks
      if (typeof confetti === 'function') {
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
      }
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("val-days").innerText = days.toString().padStart(2, '0');
    document.getElementById("val-hours").innerText = hours.toString().padStart(2, '0');
    document.getElementById("val-minutes").innerText = minutes.toString().padStart(2, '0');
    document.getElementById("val-seconds").innerText = seconds.toString().padStart(2, '0');

    updateRing('ring-days', days, 365);
    updateRing('ring-hours', hours, 24);
    updateRing('ring-minutes', minutes, 60);
    updateRing('ring-seconds', seconds, 60);
  };

  const updateRing = (id, value, max) => {
    const circle = document.getElementById(id);
    if (!circle) return;
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / max) * circumference;
    
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = offset;
  };

  setInterval(updateCountdown, 1000);
  updateCountdown();

});

// Global export for intro completion
window.hideIntroFromAnimation = () => {
  document.getElementById('skip-intro').click();
};
