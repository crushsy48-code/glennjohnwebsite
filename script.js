// Sky Portfolio interactions: navigation, gallery lightbox, tabs, goals and contact form.
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) menuToggle.addEventListener('click', () => {
    const opened = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(opened));
  });

  document.querySelectorAll('[data-logout]').forEach(button => button.addEventListener('click', () => {
    if (confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('skyPortfolioLoggedIn');
      location.href = 'login.html';
    }
  }));

  document.querySelectorAll('.goal-card').forEach(card => card.addEventListener('click', () => {
    card.classList.toggle('open');
    card.setAttribute('aria-expanded', String(card.classList.contains('open')));
  }));

  const tabButtons = document.querySelectorAll('[data-tab]');
  tabButtons.forEach(button => button.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.toggle('active', b === button));
    document.querySelectorAll('[data-tab-panel]').forEach(panel => {
      panel.hidden = panel.dataset.tabPanel !== button.dataset.tab;
    });
  }));

  const lightbox = document.querySelector('.lightbox');
  const lightboxImage = lightbox?.querySelector('img');
  const galleryImages = [...document.querySelectorAll('.gallery-item img')];
  let currentImage = 0;
  const showLightboxImage = index => {
    if (!galleryImages.length || !lightbox || !lightboxImage) return;
    currentImage = (index + galleryImages.length) % galleryImages.length;
    lightboxImage.src = galleryImages[currentImage].src;
    lightboxImage.alt = galleryImages[currentImage].alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  galleryImages.forEach((img, index) => {
    img.tabIndex = 0;
    img.addEventListener('click', () => showLightboxImage(index));
    img.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') showLightboxImage(index); });
  });
  lightbox?.querySelector('.close')?.addEventListener('click', closeLightbox);
  lightbox?.querySelector('.prev')?.addEventListener('click', () => showLightboxImage(currentImage - 1));
  lightbox?.querySelector('.next')?.addEventListener('click', () => showLightboxImage(currentImage + 1));
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightboxImage(currentImage - 1);
    if (e.key === 'ArrowRight') showLightboxImage(currentImage + 1);
  });

  const contactForm = document.querySelector('#contactForm');
  contactForm?.addEventListener('submit', e => {
    e.preventDefault();
    const name = contactForm.querySelector('[name="name"]');
    const email = contactForm.querySelector('[name="email"]');
    const message = contactForm.querySelector('[name="message"]');
    const status = contactForm.querySelector('.form-message');
    let valid = true;
    [name,email,message].forEach(input => input.setAttribute('aria-invalid','false'));
    if (!name.value.trim()) { name.setAttribute('aria-invalid','true'); valid = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { email.setAttribute('aria-invalid','true'); valid = false; }
    if (message.value.trim().length < 10) { message.setAttribute('aria-invalid','true'); valid = false; }
    if (!valid) { if (status) { status.textContent = 'Please enter your name, a valid email, and a message of at least 10 characters.'; status.classList.add('show'); status.style.background='#fff0f0'; status.style.color='#a12d3c'; } return; }
    if (status) { status.textContent = 'Thank you! Your message has passed validation. This demo does not send messages to a server.'; status.classList.add('show'); status.style.background=''; status.style.color=''; }
    contactForm.reset();
  });
});
