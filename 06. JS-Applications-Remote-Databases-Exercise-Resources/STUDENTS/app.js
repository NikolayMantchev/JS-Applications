const htmlSelector = {
    tbody: () => document.querySelector("tbody"),
};
function getTemplateText(templLocation) {
    return fetch(templLocation).then((r) => r.text());
}
function getTemplateJson(templLocation) {
    return fetch(templLocation).then((r) => r.json());
}
Promise.all([
    getTemplateText("./template.hbs"),
    getTemplateJson(`https://students-a280b.firebaseio.com/.json`),
]).then(([templateHtml, students]) => {
    const template = Handlebars.compile(templateHtml);
    Array.from(Object.values(students)).forEach((student) => {
        const result = template({ student });
        htmlSelector["tbody"]().innerHTML += result;
    });
});
