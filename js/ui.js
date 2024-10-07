let skills = [];

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


function loadSkills() {
    const itemsDiv = $('#items');

    itemsDiv.empty();
    skills.forEach(skill => {
        const skillDiv = $('<div></div>');
        const label = $(`<span>${skill.label}</span>`);

        if (skill.key) {
            var icon = $(`<i class="ci ci-${skill.key} ci-6x"></i>`);
            skillDiv.append(icon);
        } else if (skill.svg) {
            var icon = skill.svg;
            skillDiv.append(icon);
            skillDiv.children("svg").addClass("ci-6x");
        } else if (skill["svg-url"]) {
            var icon = $(`<i class="ci-6x"></i>`);
            skillDiv.append(icon);
            skillDiv.children("i").css("content", `url(${skill["svg-url"]})`);
        }

        if (skill.class) {
            const child = skillDiv.children();

            skill.class.forEach(e => child.addClass(e));
        }

        skillDiv.append(label);
        itemsDiv.append(skillDiv);
    });
}