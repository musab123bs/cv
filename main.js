/* ============================================================
   Musab Aziz Portfolio — interactions & animations
   Vanilla JS, no dependencies.
   ============================================================ */
(function () {
    'use strict';

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    /* ---------- Dynamic year ---------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- Nav: scrolled state + scroll progress ---------- */
    const nav = document.getElementById('nav');
    const progressBar = document.getElementById('progressBar');

    function onScroll() {
        const y = window.scrollY;
        if (nav) nav.classList.toggle('is-scrolled', y > 24);
        if (progressBar) {
            const h = document.documentElement.scrollHeight - window.innerHeight;
            progressBar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
        }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- Mobile menu ---------- */
    const toggle = document.querySelector('.nav__toggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (toggle && mobileMenu) {
        toggle.addEventListener('click', function () {
            const open = mobileMenu.classList.toggle('is-open');
            toggle.classList.toggle('is-open', open);
            toggle.setAttribute('aria-expanded', String(open));
            mobileMenu.setAttribute('aria-hidden', String(!open));
            document.body.style.overflow = open ? 'hidden' : '';
        });
        mobileMenu.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                mobileMenu.classList.remove('is-open');
                toggle.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
                mobileMenu.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            });
        });
    }

    /* ---------- Scrollspy: highlight active nav link ---------- */
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.nav__link');

    if ('IntersectionObserver' in window && sections.length) {
        const spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    navLinks.forEach(function (l) {
                        l.classList.toggle('is-active', l.getAttribute('href') === '#' + entry.target.id);
                    });
                }
            });
        }, { rootMargin: '-40% 0px -55% 0px' });
        sections.forEach(function (s) { spy.observe(s); });
    }

    /* ---------- Reveal on scroll ---------- */
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && !prefersReduced) {
        const ro = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    ro.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
        reveals.forEach(function (el) { ro.observe(el); });
    } else {
        reveals.forEach(function (el) { el.classList.add('is-visible'); });
    }

    /* ---------- Skill bars animate when visible ---------- */
    const skills = document.querySelectorAll('.skill');
    if ('IntersectionObserver' in window) {
        const so = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    el.style.setProperty('--lvl', el.dataset.level || 0);
                    el.classList.add('is-visible');
                    so.unobserve(el);
                }
            });
        }, { threshold: 0.4 });
        skills.forEach(function (s) { so.observe(s); });
    } else {
        skills.forEach(function (s) {
            s.style.setProperty('--lvl', s.dataset.level || 0);
            s.classList.add('is-visible');
        });
    }

    /* ---------- Role rotator (hero subtitle) ---------- */
    const rotator = document.getElementById('roleRotator');
    if (rotator && !prefersReduced) {
        const roles = [
            'Frontend Developer',
            'WordPress Developer',
            'UI Craftsman',
            'Responsive Design Specialist',
            'JavaScript Enthusiast'
        ];
        let rIdx = 0, rPos = 0, deleting = false;

        (function typeLoop() {
            const current = roles[rIdx];
            rPos += deleting ? -1 : 1;
            rotator.textContent = current.slice(0, rPos);

            let delay = deleting ? 38 : 72;
            if (!deleting && rPos === current.length) { delay = 2100; deleting = true; }
            else if (deleting && rPos === 0) {
                deleting = false;
                rIdx = (rIdx + 1) % roles.length;
                delay = 350;
            }
            setTimeout(typeLoop, delay);
        })();
    }

    /* ---------- Terminal typing line ---------- */
    const typeTarget = document.querySelector('.type-target');
    if (typeTarget && !prefersReduced) {
        const phrases = [
            'ready to build something great',
            'npm run create-amazing',
            'git commit -m "pixel perfect"'
        ];
        let pIdx = 0, pPos = 0, pDel = false;
        typeTarget.textContent = '';

        (function termLoop() {
            const phrase = phrases[pIdx];
            pPos += pDel ? -1 : 1;
            typeTarget.textContent = phrase.slice(0, pPos);

            let d = pDel ? 26 : 55;
            if (!pDel && pPos === phrase.length) { d = 2600; pDel = true; }
            else if (pDel && pPos === 0) { pDel = false; pIdx = (pIdx + 1) % phrases.length; d = 400; }
            setTimeout(termLoop, d);
        })();
    }

    /* ---------- 3D tilt on cards ---------- */
    if (isFinePointer && !prefersReduced) {
        document.querySelectorAll('.tilt').forEach(function (card) {
            const strength = parseFloat(card.dataset.tiltStrength || '8');
            card.addEventListener('mousemove', function (e) {
                const r = card.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width - 0.5;
                const py = (e.clientY - r.top) / r.height - 0.5;
                card.style.transform =
                    'perspective(900px) rotateX(' + (-py * strength) + 'deg) rotateY(' + (px * strength) + 'deg) translateZ(0)';
            });
            card.addEventListener('mouseleave', function () {
                card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
            });
        });
    }

    /* ---------- Magnetic buttons ---------- */
    if (isFinePointer && !prefersReduced) {
        document.querySelectorAll('.magnetic').forEach(function (btn) {
            btn.addEventListener('mousemove', function (e) {
                const r = btn.getBoundingClientRect();
                const x = e.clientX - r.left - r.width / 2;
                const y = e.clientY - r.top - r.height / 2;
                btn.style.transform = 'translate(' + x * 0.18 + 'px,' + y * 0.28 + 'px)';
            });
            btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
        });
    }

    /* ---------- Cursor glow follow ---------- */
    const cursorGlow = document.querySelector('.cursor-glow');
    if (cursorGlow && isFinePointer && !prefersReduced) {
        let cx = window.innerWidth / 2, cy = window.innerHeight / 2, tx = cx, ty = cy;
        window.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; });
        (function glowLoop() {
            cx += (tx - cx) * 0.08;
            cy += (ty - cy) * 0.08;
            cursorGlow.style.left = cx + 'px';
            cursorGlow.style.top = cy + 'px';
            requestAnimationFrame(glowLoop);
        })();
    }

    /* ---------- Floating particles canvas ---------- */
    const canvas = document.getElementById('particles');
    if (canvas && !prefersReduced) {
        const ctx = canvas.getContext('2d');
        let W, H, dots = [];

        function resize() {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        const COUNT = Math.min(70, Math.floor(window.innerWidth / 22));
        for (let i = 0; i < COUNT; i++) {
            dots.push({
                x: Math.random() * W,
                y: Math.random() * H,
                r: Math.random() * 1.6 + 0.4,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
                a: Math.random() * 0.5 + 0.15
            });
        }

        (function draw() {
            ctx.clearRect(0, 0, W, H);
            for (let i = 0; i < dots.length; i++) {
                const d = dots[i];
                d.x += d.vx; d.y += d.vy;
                if (d.x < 0 || d.x > W) d.vx *= -1;
                if (d.y < 0 || d.y > H) d.vy *= -1;

                ctx.beginPath();
                ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(124, 196, 255, ' + d.a + ')';
                ctx.fill();

                // connect nearby dots with faint lines
                for (let j = i + 1; j < dots.length; j++) {
                    const o = dots[j];
                    const dx = d.x - o.x, dy = d.y - o.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 130) {
                        ctx.beginPath();
                        ctx.moveTo(d.x, d.y);
                        ctx.lineTo(o.x, o.y);
                        ctx.strokeStyle = 'rgba(62, 166, 255, ' + (0.10 * (1 - dist / 130)) + ')';
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(draw);
        })();
    }

    /* ---------- Project filters ---------- */
    const filterBtns = document.querySelectorAll('.filter');
    const cards = document.querySelectorAll('#projectGrid .card');

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('is-active'); });
            btn.classList.add('is-active');
            const f = btn.dataset.filter;

            cards.forEach(function (card) {
                const show = f === 'all' || card.dataset.cat === f;
                if (show) {
                    card.classList.remove('is-hidden');
                    card.classList.remove('is-visible');
                    // re-trigger entrance animation
                    void card.offsetWidth;
                    requestAnimationFrame(function () { card.classList.add('is-visible'); });
                } else {
                    card.classList.add('is-hidden');
                }
            });
        });
    });
})();
