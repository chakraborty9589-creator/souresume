document.addEventListener('DOMContentLoaded', () => {
  // Theme Management
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = themeToggleBtn.querySelector('i');
  
  // Get preferred theme from local storage or system preferences (default to dark)
  let currentTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon(currentTheme);
    // Restart particles with new color palette parameters
    initParticles();
  });

  function updateThemeIcon(theme) {
    if (theme === 'dark') {
      themeIcon.className = 'fas fa-sun';
      themeToggleBtn.title = 'Switch to Light Mode';
    } else {
      themeIcon.className = 'fas fa-moon';
      themeToggleBtn.title = 'Switch to Dark Mode';
    }
  }

  // Mobile Menu Navigation Drawer
  const hamburger = document.querySelector('.hamburger');
  const navLinksContainer = document.querySelector('.nav-links-container');
  const navLinks = document.querySelectorAll('.nav-link');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinksContainer.classList.remove('active');
    });
  });

  // Animated Typing Effect
  const typewriterElement = document.getElementById('typewriter');
  const roles = ["Python Developer", "AWS Enthusiast", "AI Learner", "Photographer", "Videographer"];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    const currentRole = roles[roleIndex];
    if (isDeleting) {
      typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Deleting is faster
    } else {
      typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100; // Normal typing speed
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 1500; // Pause at the end of the word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // Pause before typing next word
    }

    setTimeout(typeEffect, typingSpeed);
  }
  
  if (typewriterElement) {
    setTimeout(typeEffect, 1000);
  }

  // Scroll Progress and Sticky Nav Bar
  const navbar = document.querySelector('.navbar');
  const progressBar = document.querySelector('.scroll-progress');
  const scrollToTopBtn = document.getElementById('scroll-to-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = (scrollY / documentHeight) * 100;

    // Scroll progress bar width
    if (progressBar) {
      progressBar.style.width = `${scrollPercentage}%`;
    }

    // Sticky navbar backdrop toggle
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll to top button visibility
    if (scrollY > 500) {
      scrollToTopBtn.classList.add('active');
    } else {
      scrollToTopBtn.classList.remove('active');
    }

    // Active Navigation Link on Scroll
    const sections = document.querySelectorAll('section');
    let currentActiveId = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentActiveId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentActiveId}`) {
        link.classList.add('active');
      }
    });
  });

  // Scroll to Top click event
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Floating Background Particles System
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particlesArray = [];
  const maxParticles = 60;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.speedY = Math.random() * 0.4 - 0.2;
      this.alpha = Math.random() * 0.5 + 0.1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Wrap around screen edges
      if (this.x > canvas.width) this.x = 0;
      else if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      else if (this.y < 0) this.y = canvas.height;
    }

    draw(color) {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowBlur = 5;
      ctx.shadowColor = color;
      ctx.fill();
      ctx.restore();
    }
  }

  function initParticles() {
    particlesArray = [];
    for (let i = 0; i < maxParticles; i++) {
      particlesArray.push(new Particle());
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Choose particle colors depending on theme
    const theme = document.documentElement.getAttribute('data-theme');
    const color = theme === 'dark' ? '#3B82F6' : '#2563EB';

    particlesArray.forEach(particle => {
      particle.update();
      particle.draw(color);
    });

    // Draw connection lines
    connectParticles(color);
    requestAnimationFrame(animateParticles);
  }

  function connectParticles(color) {
    const maxDistance = 120;
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        const dx = particlesArray[a].x - particlesArray[b].x;
        const dy = particlesArray[a].y - particlesArray[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.15;
          ctx.strokeStyle = color;
          ctx.globalAlpha = opacity;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  initParticles();
  animateParticles();

  // Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // Skills Animated Progress Fill
  const skillSection = document.getElementById('skills');
  const progressBars = document.querySelectorAll('.skill-progress-bar');
  
  if (skillSection && progressBars.length > 0) {
    const skillsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          progressBars.forEach(bar => {
            const targetVal = bar.getAttribute('data-progress');
            bar.style.width = targetVal;
          });
          // Unobserve once triggered
          skillsObserver.unobserve(skillSection);
        }
      });
    }, { threshold: 0.15 });

    skillsObserver.observe(skillSection);
  }

  // Copy to Clipboard with Tooltip Visual Feedback
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      const originalHTML = btn.innerHTML;
      
      navigator.clipboard.writeText(textToCopy).then(() => {
        // Change icon to a checkmark for feedback
        btn.innerHTML = '<i class="fas fa-check" style="color: #10B981;"></i>';
        btn.style.borderColor = '#10B981';
        btn.title = 'Copied!';
        
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.style.borderColor = '';
          btn.title = 'Copy to clipboard';
        }, 2000);
      }).catch(err => {
        console.error('Clipboard copy failed: ', err);
      });
    });
  });

  // Contact Form Handling with Local Validation
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      // Simple email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !subject || !message) {
        showStatus('Please fill in all fields.', 'error');
        return;
      }

      if (!emailRegex.test(email)) {
        showStatus('Please enter a valid email address.', 'error');
        return;
      }

      // Simulate API submit call
      showStatus('Sending message...', 'info');
      
      setTimeout(() => {
        // Show success message
        showStatus('Thank you! Your message has been sent successfully.', 'success');
        contactForm.reset();
      }, 1500);
    });
  }

  function showStatus(msg, type) {
    if (!formStatus) return;

    formStatus.textContent = msg;
    formStatus.className = 'form-status'; // Reset

    if (type === 'success') {
      formStatus.classList.add('success');
    } else if (type === 'error') {
      formStatus.classList.add('error');
    } else {
      formStatus.style.display = 'block';
      formStatus.style.background = 'var(--bg-tertiary)';
      formStatus.style.color = 'var(--text-primary)';
      formStatus.style.border = '1px solid var(--glass-border)';
    }
  }
});
