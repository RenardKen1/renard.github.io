document.addEventListener('DOMContentLoaded', () => {
    const helloButton = document.getElementById('hello-button');
    const helloMessage = document.getElementById('hello-message');
    const profileToggle = document.getElementById('profile-toggle');
    const profileCard = document.getElementById('profile-card');
    const projectsToggle = document.getElementById('projects-toggle');
    const projectsSection = document.getElementById('projects');

    // Initialize state from localStorage
    try {
        const profileHidden = localStorage.getItem('profileHidden') === 'true';
        if (profileHidden && profileCard) {
            profileCard.classList.add('is-hidden');
            if (profileToggle) {
                profileToggle.textContent = 'Show Profile';
                profileToggle.setAttribute('aria-expanded', 'false');
            }
        }

        const projectsHidden = localStorage.getItem('projectsHidden') === 'true';
        if (projectsHidden && projectsSection) {
            const projectList = projectsSection.querySelector('.project-list');
            if (projectList) projectList.classList.add('is-hidden');
            if (projectsToggle) {
                projectsToggle.textContent = 'Show Projects';
                projectsToggle.setAttribute('aria-expanded', 'false');
            }
        }
    } catch (e) {
        // Ignore storage errors in private modes
    }

    if (helloButton && helloMessage) {
        helloButton.addEventListener('click', () => {
            const hour = new Date().getHours();
            const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';

            helloMessage.textContent = `Hello! Good ${timeOfDay}. I am ready to learn and build websites.`;
            helloMessage.classList.remove('fade-in');
            // trigger animation
            void helloMessage.offsetWidth;
            helloMessage.classList.add('fade-in');

            // clear after a short time to avoid long-lived announcements
            setTimeout(() => {
                helloMessage.classList.remove('fade-in');
            }, 1200);
        });
    }

    if (profileToggle && profileCard) {
        profileToggle.addEventListener('click', () => {
            const isHidden = profileCard.classList.toggle('is-hidden');
            profileToggle.textContent = isHidden ? 'Show Profile' : 'Hide Profile';
            profileToggle.setAttribute('aria-expanded', String(!isHidden));
            try {
                localStorage.setItem('profileHidden', String(isHidden));
            } catch (e) {}
        });
    }

    if (projectsToggle && projectsSection) {
        projectsToggle.addEventListener('click', () => {
            const projectList = projectsSection.querySelector('.project-list');

            if (!projectList) return;

            const isHidden = projectList.classList.toggle('is-hidden');

            projectsToggle.textContent = isHidden ? 'Show Projects' : 'Hide Projects';
            projectsToggle.setAttribute('aria-expanded', String(!isHidden));
            try {
                localStorage.setItem('projectsHidden', String(isHidden));
            } catch (e) {}
        });
    }

    // Copy contact items to clipboard and show small toast
    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);

    function showToast(text) {
        toast.textContent = text;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 1600);
    }

    document.querySelectorAll('.contact-item a[href^="mailto:"]').forEach(a => {
        a.addEventListener('click', e => {
            // allow normal mailto navigation on non-js clients; for JS, still copy
            const email = a.getAttribute('href').replace('mailto:', '');
            try {
                navigator.clipboard.writeText(email);
                showToast('Email copied to clipboard');
            } catch (err) {}
        });
    });

    document.querySelectorAll('.contact-item a[href^="tel:"]').forEach(a => {
        a.addEventListener('click', e => {
            const tel = a.getAttribute('href').replace('tel:', '');
            try {
                navigator.clipboard.writeText(tel);
                showToast('Phone number copied');
            } catch (err) {}
        });
    });

    // Toggle inline resume viewer
    const viewInline = document.getElementById('view-resume-inline');
    const resumeEmbed = document.getElementById('resume-embed');
    if (viewInline && resumeEmbed) {
        viewInline.addEventListener('click', (e) => {
            e.preventDefault();
            const isVisible = resumeEmbed.getAttribute('aria-hidden') === 'false';
            resumeEmbed.setAttribute('aria-hidden', String(isVisible));
            resumeEmbed.style.display = isVisible ? 'none' : 'block';
            viewInline.textContent = isVisible ? 'View Inline' : 'Hide Inline';
        });
    }

    // Responsive navigation toggle + active link handling
    const navToggle = document.getElementById('nav-toggle');
    const primaryNav = document.getElementById('primary-navigation');
    if (navToggle && primaryNav) {
        navToggle.addEventListener('click', () => {
            const isVisible = primaryNav.getAttribute('data-visible') === 'true';
            primaryNav.setAttribute('data-visible', String(!isVisible));
            navToggle.setAttribute('aria-expanded', String(!isVisible));
        });

        // Smooth scroll for internal links and close mobile menu
        primaryNav.querySelectorAll('a').forEach(link => {
            const href = link.getAttribute('href') || '';
            if (href.startsWith('#')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    primaryNav.setAttribute('data-visible', 'false');
                    navToggle.setAttribute('aria-expanded', 'false');
                });
            } else {
                link.addEventListener('click', () => {
                    primaryNav.setAttribute('data-visible', 'false');
                    navToggle.setAttribute('aria-expanded', 'false');
                });
            }
        });

        // Highlight active nav link based on scroll
        const sections = Array.from(document.querySelectorAll('main [id]'));
        function setActiveLink() {
            const offset = window.scrollY + 120;
            let current = sections[0];
            for (const sec of sections) {
                if (sec.offsetTop <= offset) current = sec;
            }
            primaryNav.querySelectorAll('a').forEach(a => a.classList.remove('active'));
            const active = primaryNav.querySelector(`a[href="#${current.id}"]`);
            if (active) active.classList.add('active');
        }
        setActiveLink();
        window.addEventListener('scroll', setActiveLink, { passive: true });
    }

    // Make nav more visible on scroll and close mobile menu on outside click
    const topNav = document.querySelector('.top-nav');
    function handleScrollNav() {
        if (!topNav) return;
        if (window.scrollY > 36) topNav.classList.add('scrolled');
        else topNav.classList.remove('scrolled');
    }
    handleScrollNav();
    window.addEventListener('scroll', handleScrollNav, { passive: true });

    // Close mobile nav when clicking outside or on resize
    document.addEventListener('click', (e) => {
        if (!primaryNav || !navToggle) return;
        const isOpen = primaryNav.getAttribute('data-visible') === 'true';
        if (!isOpen) return;
        const inside = e.composedPath().includes(primaryNav) || e.composedPath().includes(navToggle);
        if (!inside) {
            primaryNav.setAttribute('data-visible', 'false');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });

    window.addEventListener('resize', () => {
        if (!primaryNav || !navToggle) return;
        if (window.innerWidth > 880) {
            primaryNav.setAttribute('data-visible', 'false');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Make nav more visible on scroll and close mobile menu on outside click
    const topNav = document.querySelector('.top-nav');
    function handleScrollNav() {
        if (!topNav) return;
        if (window.scrollY > 36) topNav.classList.add('scrolled');
        else topNav.classList.remove('scrolled');
    }
    handleScrollNav();
    window.addEventListener('scroll', handleScrollNav, { passive: true });
});
