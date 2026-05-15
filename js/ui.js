let skills = [];
let experience = [];

// ── Theme: restore persisted preference ─────────────────────────────────────
(function () {
    const saved = localStorage.getItem('theme') || 'dark';
    $('html').removeClass('light dark').addClass(saved);
})();

function toggleThemeType() {
    const isLight = $('html').hasClass('light');
    $('html').toggleClass('light', !isLight).toggleClass('dark', isLight);
    localStorage.setItem('theme', isLight ? 'dark' : 'light');
}

// ── DOM ready ────────────────────────────────────────────────────────────────
$(document).ready(function () {

    // Load data
    fetch('js/skills.json')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => { skills = data; loadSkills(); })
        .catch(error => console.error('Error loading skills.json', error));

    fetch('js/experience.json')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => { experience = data; loadExperience(); })
        .catch(error => console.error('Error loading experience.json', error));

    // Skills filter
    $(".filter select").change((event) => {
        const selection = event.target.value;
        if (selection) {
            $(`.topic.skills .items > *:not([data-tag~=${selection}])`).addClass("hide");
            $(`.topic.skills .items > [data-tag~=${selection}]`).removeClass("hide");
        } else {
            $(`.topic.skills .items > *`).removeClass("hide");
        }
    });

    // ── Active nav on scroll ─────────────────────────────────────────────────
    const navSections = [
        { id: 'Main',      href: '#Main' },
        { id: 'About',     href: '#About' },
        { id: 'ContactMe', href: '#ContactMe' },
    ];

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                $('.nav a').removeClass('active');
                $(`.nav a[href="#${id}"]`).addClass('active');
            }
        });
    }, { threshold: 0.35 });

    navSections.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) navObserver.observe(el);
    });

    // ── Scroll reveal ────────────────────────────────────────────────────────
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target); // animate once
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.topic').forEach(el => revealObserver.observe(el));
});

// ── Render skills ────────────────────────────────────────────────────────────
function loadSkills() {
    const itemsDiv = $('.topic.skills .items');
    itemsDiv.empty();

    skills.forEach(skill => {
        const skillDiv = $('<div></div>');
        const label = $('<span></span>').html(skill.label);

        let icon;
        if (skill.key) {
            icon = $('<i></i>').addClass(`ci ci-${skill.key} ci-6x`);
        } else if (skill.svg) {
            icon = $(skill.svg);
            icon.addClass('ci-6x');
        } else if (skill["svg-url"]) {
            icon = $('<i></i>').addClass('ci-6x');
            icon.css('content', `url(${skill["svg-url"]})`);
        }

        if (icon) skillDiv.append(icon);

        if (skill.class) {
            skill.class.forEach(className => skillDiv.children().addClass(className));
        }

        if (skill.tag) skillDiv.attr('data-tag', skill.tag.join(" "));

        skillDiv.append(label);
        itemsDiv.append(skillDiv);
    });
}

// ── Render experience ────────────────────────────────────────────────────────
function loadExperience() {
    const itemsDiv = $('.topic.experience .items');
    itemsDiv.empty();

    experience.forEach(item => {
        const duration = item.duration.current
            ? `${item.duration.from} – Present`
            : `${item.duration.from} – ${item.duration.to}`;

        const html = `
            <div>
                <h3>${item.role}</h3>
                <h5>${item.office}, ${item.location}</h5>
                <span>${duration}</span>
                <p>${item.description}</p>
            </div>
        `;
        itemsDiv.append(html);
    });
}
