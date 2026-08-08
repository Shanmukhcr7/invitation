// js/animations.js

// Character Split Logic (replaces word split)
function setupSplitText() {
  const splitElements = document.querySelectorAll('.split-text');
  splitElements.forEach(el => {
    const text = el.innerText;
    el.innerHTML = '';
    const words = text.split(' ');
    
    words.forEach(word => {
      const wordSpan = document.createElement('span');
      wordSpan.style.display = 'inline-block';
      wordSpan.style.whiteSpace = 'nowrap';
      
      const chars = word.split('');
      chars.forEach(char => {
        const charSpan = document.createElement('span');
        charSpan.classList.add('char');
        charSpan.innerText = char;
        wordSpan.appendChild(charSpan);
      });
      
      el.appendChild(wordSpan);
      // Add space between words
      el.appendChild(document.createTextNode(' '));
    });
  });
}

// 3D Tilt Logic
function initTilt() {
  const tiltCards = document.querySelectorAll('.tilt-effect');
  
  tiltCards.forEach(card => {
    const xTo = gsap.quickTo(card, "rotateY", {duration: 0.8, ease: "power3"});
    const yTo = gsap.quickTo(card, "rotateX", {duration: 0.8, ease: "power3"});
    
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width; // 0 to 1
      const y = (e.clientY - rect.top) / rect.height; // 0 to 1
      
      const multiplier = 20; // max rotation degrees
      xTo((x - 0.5) * multiplier);
      yTo(-(y - 0.5) * multiplier);
    });
    
    card.addEventListener('mouseleave', () => {
      xTo(0);
      yTo(0);
    });
  });
}

// Magnetic Buttons Logic
function initMagneticButtons() {
  const magneticElements = document.querySelectorAll('.luxury-btn, .music-btn');
  
  magneticElements.forEach(el => {
    const xTo = gsap.quickTo(el, "x", {duration: 0.6, ease: "elastic.out(1, 0.3)"});
    const yTo = gsap.quickTo(el, "y", {duration: 0.6, ease: "elastic.out(1, 0.3)"});
    
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      
      xTo(x * 0.4);
      yTo(y * 0.4);
    });
    
    el.addEventListener('mouseleave', () => {
      xTo(0);
      yTo(0);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);
  setupSplitText();
  initTilt();
  initMagneticButtons();

  // Add curtain-reveal class to images
  document.querySelectorAll('.parallax-img, .portrait-img-wrapper').forEach(img => {
    img.classList.add('curtain-reveal');
  });

  // --- Intro Sequence (Lottie + GSAP) ---
  const lot = lottie.loadAnimation({
    container: document.getElementById('lottie-lotus'),
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path: 'https://assets9.lottiefiles.com/packages/lf20_syqn3iue.json' 
  });

  const introTL = gsap.timeline({
    paused: true,
    onComplete: () => {
      setTimeout(() => {
        if (window.hideIntroFromAnimation) window.hideIntroFromAnimation();
      }, 1500);
    }
  });

  window.introTL = introTL;

  introTL
    .to('#lottie-lotus', { opacity: 1, duration: 1 })
    .call(() => { try { lot.play(); } catch(e){} }, null, "-=0.5")
    .fromTo('.intro-t1', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, "+=0.5")
    .to('.intro-t1', { opacity: 0, y: -10, duration: 0.8, ease: 'power2.in' }, "+=1")
    .fromTo('.intro-t2', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' })
    .to('.intro-t2', { opacity: 0, y: -10, duration: 0.8, ease: 'power2.in' }, "+=1")
    .fromTo('.intro-names', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1.5, ease: 'power3.out' })
    .fromTo('.intro-name', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out' }, "-=1");

  
  // --- Main Animations (trigger after intro) ---
  window.addEventListener('introComplete', () => {
    
    // Hero Animation
    gsap.fromTo('.hero-label', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
    gsap.fromTo('.title-word', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out', stagger: 0.2, delay: 0.2 });
    gsap.fromTo('.title-amp', { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.7)', delay: 0.5 });
    gsap.fromTo('.hero-divider', { width: 0 }, { width: 150, duration: 1.5, ease: 'power4.inOut', delay: 0.8 });
    gsap.fromTo('.hero-subtitle', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, delay: 1 });
    
    // Animate Portraits (Curtain Reveal + Slide up)
    gsap.fromTo('.portrait-card', { opacity: 0, y: 100 }, { opacity: 1, y: 0, duration: 1.2, stagger: 0.3, ease: 'power3.out', delay: 1.2 });
    gsap.to('.portrait-img-wrapper', { 
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 1.5, 
      ease: 'power4.inOut',
      stagger: 0.3,
      delay: 1.4
    });
    
    // Couple Showcase Parallax
    gsap.to('.couple-showcase-image img', {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.couple-showcase-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    // Image Curtain Reveal on Scroll
    gsap.to('.couple-showcase-image.curtain-reveal', {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 1.5,
      ease: 'power4.inOut',
      scrollTrigger: {
        trigger: '.couple-showcase-section',
        start: 'top 75%'
      }
    });

    // Fade-ups
    const fadeElements = document.querySelectorAll('.fade-up, .fade-text');
    fadeElements.forEach(el => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        }
      });
    });

    // Advanced Character Split reveals
    const splitSections = document.querySelectorAll('.split-text');
    splitSections.forEach(el => {
      const chars = el.querySelectorAll('.char');
      gsap.to(chars, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.8,
        stagger: 0.02,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        }
      });
    });

    // Timeline Line Drawing
    gsap.fromTo('.timeline-line', { scaleY: 0 }, {
      scaleY: 1,
      transformOrigin: 'top center',
      ease: 'none',
      scrollTrigger: {
        trigger: '.timeline-container',
        start: 'top center',
        end: 'bottom center',
        scrub: true
      }
    });

    // Timeline Items
    const tlItems = document.querySelectorAll('.timeline-item');
    tlItems.forEach(item => {
      gsap.fromTo(item.querySelector('.timeline-content'), { opacity: 0, x: item.style.justifyContent === 'flex-start' ? 50 : -50 }, {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 75%'
        }
      });
      gsap.fromTo(item.querySelector('.timeline-dot'), { scale: 0, opacity: 0 }, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: item,
          start: 'top 75%'
        }
      });
    });

  });

  initThreeJS();
  initPetals();
});

function initThreeJS() {
  const canvas = document.getElementById('bg-canvas-3d');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xfdfbf7, 0.001);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 800; 
  const posArray = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 100;
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  
  const circleTexture = new THREE.CanvasTexture(createCircleCanvas());
  
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.15,
    map: circleTexture,
    transparent: true,
    opacity: 0.6,
    color: 0xb8895a,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  let mouseX = 0;
  let mouseY = 0;
  
  document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX / window.innerWidth - 0.5;
    mouseY = event.clientY / window.innerHeight - 0.5;
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    particlesMesh.rotation.y = elapsedTime * 0.05;
    particlesMesh.rotation.x = elapsedTime * 0.02;

    camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 5 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function createCircleCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.arc(16, 16, 14, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  return canvas;
}

function initPetals() {
  const canvas = document.getElementById('bg-canvas-2d');
  const ctx = canvas.getContext('2d');
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const petals = [];
  const petalCount = 30; 

  class Petal {
    constructor() {
      this.reset();
    }
    
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * -canvas.height;
      this.size = Math.random() * 8 + 4;
      this.speed = Math.random() * 1 + 0.5;
      this.angle = Math.random() * Math.PI * 2;
      this.spin = Math.random() * 0.02 - 0.01;
      this.color = `rgba(217, 169, 160, ${Math.random() * 0.5 + 0.2})`; 
    }
    
    update() {
      this.y += this.speed;
      this.angle += this.spin;
      this.x += Math.sin(this.angle) * 0.5;
      
      if (this.y > canvas.height + 20) {
        this.reset();
        this.y = -20;
      }
    }
    
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(this.size, -this.size, this.size*2, 0, this.size*1.5, this.size);
      ctx.bezierCurveTo(this.size, this.size*2, 0, this.size, 0, 0);
      ctx.fillStyle = this.color;
      ctx.fill();
      
      ctx.restore();
    }
  }

  for (let i = 0; i < petalCount; i++) {
    petals.push(new Petal());
  }

  function animatePetals() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animatePetals);
  }

  animatePetals();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}
