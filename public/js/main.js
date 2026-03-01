// ===== localbrand.web — Main JavaScript =====

document.addEventListener('DOMContentLoaded', () => {
    // ---------- Sticky Navbar ----------
    const navbar = document.querySelector('.navbar');
    const scrollThreshold = 60;

    const handleScroll = () => {
        if (window.scrollY > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run once on load

    // ---------- Mobile Drawer ----------
    const hamburger = document.querySelector('.hamburger');
    const drawer = document.querySelector('.mobile-drawer');
    const overlay = document.querySelector('.drawer-overlay');
    const drawerLinks = document.querySelectorAll('.mobile-drawer a');

    const toggleDrawer = () => {
        hamburger.classList.toggle('active');
        drawer.classList.toggle('open');
        overlay.classList.toggle('show');
        document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
    };

    if (hamburger) {
        hamburger.addEventListener('click', toggleDrawer);
    }

    if (overlay) {
        overlay.addEventListener('click', toggleDrawer);
    }

    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (drawer.classList.contains('open')) {
                toggleDrawer();
            }
        });
    });

    // ---------- Active Nav Link ----------
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-drawer a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // ---------- Scroll Reveal ----------
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ---------- Smooth Scroll for Hash Links ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ---------- Form Submission Handler ----------
    const API_URL = '/api/contact'; // Same domain, relative path

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            const formNote = document.getElementById('form-note');

            btn.innerHTML = 'Sending...';
            btn.disabled = true;
            btn.style.opacity = '0.7';

            const payload = {
                name: contactForm.querySelector('#name').value,
                phone: contactForm.querySelector('#phone').value,
                businessType: contactForm.querySelector('#business-type').value,
                message: contactForm.querySelector('#message').value,
            };

            try {
                const res = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                const data = await res.json();

                if (res.ok && data.success) {
                    btn.innerHTML = '✓ Message Sent Successfully!';
                    btn.style.background = '#00cc6a';
                    btn.style.opacity = '1';

                    if (formNote) {
                        formNote.innerHTML = '<span style="color: var(--accent); font-weight: 600;">🎉 Thank you!</span> We\'ve received your message and will contact you within 2 hours via WhatsApp or call.';
                    }

                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.background = '';
                        btn.disabled = false;
                        contactForm.reset();
                        if (formNote) {
                            formNote.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: -2px; margin-right: 4px;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Your info is safe with us. We\'ll contact you within 2 hours via WhatsApp or call.';
                        }
                    }, 4000);
                } else {
                    throw new Error(data.message || 'Something went wrong');
                }
            } catch (error) {
                btn.innerHTML = '⚠ Failed – Try Again';
                btn.style.background = '#ff4757';
                btn.style.opacity = '1';

                if (formNote) {
                    formNote.innerHTML = '<span style="color: #ff4757;">Could not send message. Please try WhatsApp or call us directly.</span>';
                }

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                    if (formNote) {
                        formNote.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: -2px; margin-right: 4px;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Your info is safe with us. We\'ll contact you within 2 hours via WhatsApp or call.';
                    }
                }, 3000);
            }
        });
    }

    // ---------- Counter Animation ----------
    const counters = document.querySelectorAll('[data-count]');

    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const tick = () => {
            current += step;
            if (current >= target) {
                el.textContent = target + suffix;
                return;
            }
            el.textContent = Math.floor(current) + suffix;
            requestAnimationFrame(tick);
        };

        tick();
    };

    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(el => counterObserver.observe(el));
    }

    // ---------- Page Transitions ----------
    const internalLinks = document.querySelectorAll('a[href$=".html"]');

    internalLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Skip if same page, external, or modifier key held
            if (!href || href.startsWith('http') || href.startsWith('#') || e.ctrlKey || e.metaKey) return;

            e.preventDefault();
            document.body.classList.add('page-exit');

            setTimeout(() => {
                window.location.href = href;
            }, 250);
        });
    });
});

// ---------- Portfolio Modal (global) ----------
function showPortfolioNotice(e) {
    e.preventDefault();
    e.stopPropagation();
    const modal = document.getElementById('portfolio-modal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closePortfolioNotice() {
    const modal = document.getElementById('portfolio-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Close modal on backdrop click
document.addEventListener('click', (e) => {
    const modal = document.getElementById('portfolio-modal');
    if (modal && e.target === modal) {
        closePortfolioNotice();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePortfolioNotice();
});
