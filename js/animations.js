// js/animations.js

// Make GSAP SplitText substitute (since we don't have the club plugin, we'll manually split words/lines)
function setupSplitText() {
  const splitElements = document.querySelectorAll('.split-text');
  splitElements.forEach(el => {
    const text = el.innerText;
    el.innerHTML = '';
    const words = text.split(' ');
    words.forEach(word => {
      const span = document.createElement('span');
      span.innerText = word + ' ';
      el.appendChild(span);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);
  setupSplitText();

  // --- Intro Sequence (Lottie + GSAP) ---
  const lot = lottie.loadAnimation({
    container: document.getElementById('lottie-lotus'),
    renderer: 'svg',
    loop: false,
    autoplay: false,
    // Provide a simple local fallback or online lottie JSON (using a generic lotus/flower lottie if possible, else we skip)
    path: 'https://assets9.lottiefiles.com/packages/lf20_syqn3iue.json' 
  });

  const introTL = gsap.timeline({
    onComplete: () => {
      // Auto-hide intro after a few seconds
      setTimeout(() => {
        if (window.hideIntroFromAnimation) window.hideIntroFromAnimation();
      }, 1500);
    }
  });

  introTL
    .to('#lottie-lotus', { opacity: 1, duration: 1 })
    .call(() => lot.play(), null, "-=0.5")
    .to('.intro-t1', { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, "+=0.5")
    .to('.intro-t1', { opacity: 0, y: -10, duration: 0.8, ease: 'power2.in' }, "+=1")
    .to('.intro-t2', { opacity: 1, y: 0, duration: 1, ease: 'power2.out' })
    .to('.intro-t2', { opacity: 0, y: -10, duration: 0.8, ease: 'power2.in' }, "+=1")
    .to('.intro-names', { opacity: 1, scale: 1, duration: 1.5, ease: 'power3.out' })
    .from('.intro-name', { y: 20, opacity: 0, duration: 1, stagger: 0.2, ease: 'power3.out' }, "-=1");

  
  // --- Main Animations (trigger after intro) ---
  window.addEventListener('introComplete', () => {
    
    // Hero Animation
    gsap.from('.hero-label', { opacity: 0, y: -20, duration: 1, ease: 'power3.out' });
    gsap.from('.title-word', { opacity: 0, y: 50, duration: 1.2, ease: 'power4.out', stagger: 0.2, delay: 0.2 });
    gsap.from('.title-amp', { opacity: 0, scale: 0.5, duration: 1, ease: 'back.out(1.7)', delay: 0.5 });
    gsap.from('.hero-divider', { width: 0, duration: 1.5, ease: 'power4.inOut', delay: 0.8 });
    gsap.from('.hero-subtitle', { opacity: 0, y: 20, duration: 1, delay: 1 });
    gsap.from('.portrait-card', { opacity: 0, y: 100, duration: 1.2, stagger: 0.3, ease: 'power3.out', delay: 1.2 });
    
    // Scroll Animations
    
    // Couple Showcase
    gsap.to('.couple-showcase-image img', {
      yPercent: 10,
      ease: 'none',
      scrollTrigger: {
        trigger: '.couple-showcase-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
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

    // Split text reveals
    const splitSections = document.querySelectorAll('.split-text');
    splitSections.forEach(el => {
      const spans = el.querySelectorAll('span');
      gsap.to(spans, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        }
      });
    });

    // Timeline Line Drawing
    gsap.from('.timeline-line', {
      scaleY: 0,
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
      gsap.from(item.querySelector('.timeline-content'), {
        opacity: 0,
        x: item.style.justifyContent === 'flex-start' ? 50 : -50,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 75%'
        }
      });
      gsap.from(item.querySelector('.timeline-dot'), {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: item,
          start: 'top 75%'
        }
      });
    });

  });

  // --- Three.js Background (Gold Dust/Particles) ---
  initThreeJS();
  
  // --- Canvas 2D Background (Falling Petals) ---
  initPetals();
});

// Three.js Implementation
function initThreeJS() {
  const canvas = document.getElementById('bg-canvas-3d');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  // We want a subtle fog
  scene.fog = new THREE.FogExp2(0xfdfbf7, 0.001);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  // Particles
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 800; // Optimize count
  const posArray = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 100;
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  
  // Create circular texture for particles
  const circleTexture = new THREE.CanvasTexture(createCircleCanvas());
  
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.15,
    map: circleTexture,
    transparent: true,
    opacity: 0.6,
    color: 0xb8895a, // Gold
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  // Mouse interactivity
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

    // Subtle mouse parallax
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

// Canvas 2D implementation (Falling Petals)
function initPetals() {
  const canvas = document.getElementById('bg-canvas-2d');
  const ctx = canvas.getContext('2d');
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const petals = [];
  const petalCount = 30; // Not too many to maintain 60fps

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
      this.color = `rgba(217, 169, 160, ${Math.random() * 0.5 + 0.2})`; // Rose gold / soft pink
    }
    
    update() {
      this.y += this.speed;
      this.angle += this.spin;
      // Gentle wind effect
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
      
      // Simple petal shape
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
