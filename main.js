// Header scroll state
const header = document.querySelector('header.site');
function onScroll() {
  if (window.scrollY > 8) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
}
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const mobileNav = document.querySelector('.mobile-nav');
if (navToggle && mobileNav) {
  navToggle.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', mobileNav.classList.contains('open'));
  });
  mobileNav.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => mobileNav.classList.remove('open'))
  );
}

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('in'));
}

// Contact page: topic path selection
const contactPaths = document.querySelectorAll('.contact-path');
const topicSelect = document.getElementById('topic');
const formAnchor = document.getElementById('inquiry-form');
if (contactPaths.length) {
  contactPaths.forEach((btn) => {
    btn.addEventListener('click', () => {
      contactPaths.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      if (topicSelect) topicSelect.value = btn.dataset.topic;
      if (formAnchor) formAnchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// Contact form: client-side validation + mailto handoff (no backend wired yet)
const inquiryForm = document.getElementById('inquiry-form');
if (inquiryForm) {
  inquiryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    const nameErr = document.getElementById('name-err');
    const emailErr = document.getElementById('email-err');
    const msgErr = document.getElementById('message-err');

    nameErr.textContent = '';
    emailErr.textContent = '';
    msgErr.textContent = '';

    if (name.value.trim().length < 2) {
      nameErr.textContent = 'Please enter your name.';
      valid = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      emailErr.textContent = 'Please enter a valid email address.';
      valid = false;
    }
    if (message.value.trim().length < 10) {
      msgErr.textContent = 'Please tell us a little more (at least 10 characters).';
      valid = false;
    }
    if (!valid) return;

    const topic = document.getElementById('topic').value;
    const company = document.getElementById('company').value;
    const subject = encodeURIComponent(`Inquiry from ${name.value.trim()} — ${topic}`);
    const body = encodeURIComponent(
      `Name: ${name.value.trim()}\nEmail: ${email.value.trim()}\nOrganisation: ${company.value.trim()}\nInquiry type: ${topic}\n\nMessage:\n${message.value.trim()}`
    );

    document.getElementById('form-block').classList.add('hidden');
    document.getElementById('form-success').classList.remove('hidden');
    window.location.href = `mailto:info@safegroup.ly?subject=${subject}&body=${body}`;
  });
}
