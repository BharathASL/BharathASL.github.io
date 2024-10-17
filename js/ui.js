let skills = [];
let experience = [];

$(document).ready(function () {
    fetch('js/skills.json')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            return response.json();
        })
        .then(data => {
            skills = data;
            loadSkills();
        })
        .catch(error => { console.error('Error loading skills.json file', error) });

    fetch('js/experience.json')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            return response.json();
        })
        .then(data => {
            experience = data;
            loadExperience();
        })
        .catch(error => { console.error('Error loading experience.json file', error) });

    $(".filter select").change((event) => {
        var selection = event.target.value;

        if (selection) {
            $(`.topic.skills .items > *:not([data-tag~=${selection}])`).addClass("hide");
            $(`.topic.skills .items > [data-tag~=${selection}]`).removeClass("hide");
        } else $(`.topic.skills .items > *`).removeClass("hide");
    });

});


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
            skill.class.forEach(className => {
                skillDiv.children().addClass(className);
            });
        }

        if (skill.tag) skillDiv.attr('data-tag', skill.tag.join(" "));

        skillDiv.append(label);

        itemsDiv.append(skillDiv);
    });
}

function loadExperience() {
    const itemsDiv = $('.topic.experience .items');

    itemsDiv.empty();

    experience.forEach(item => {
        const currentDuration = item.duration.current ? " - Present" : ` - ${item.duration.to}`;

        // Create the HTML structure using jQuery
        const experienceHTML = `
            <div>
                <h3>${item.role}</h3>
                <h5>${item.office}, ${item.location}</h5>
                <span>${item.duration.from}${currentDuration}</span>
                <p>${item.description}</p>
            </div>
        `;

        // Append the HTML to the container
        itemsDiv.append(experienceHTML);
    });
}