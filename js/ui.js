let skills = [];

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

    $(".filter select").change((event) => {
        var selection = event.target.value;

        if (selection) {
            $(`#items > *:not([data-tag~=${selection}])`).addClass("hide");
            $(`#items > [data-tag~=${selection}]`).removeClass("hide");
        } else $(`#items > *`).removeClass("hide");
    });

});


function loadSkills() {
    const itemsDiv = $('#items');

    itemsDiv.empty();

    skills.forEach(skill => {
        const skillDiv = $('<div></div>');

        const label = $('<span></span>').text(skill.label);

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
