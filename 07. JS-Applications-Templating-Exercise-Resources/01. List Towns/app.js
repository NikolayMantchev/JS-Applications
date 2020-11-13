const elements = {
    root: () => document.querySelector("#root"),
    input: () => document.getElementById("towns"),
    btn: () => document.getElementById("btnLoadTowns"),
};

elements.btn().addEventListener("click", getInputInfo);

function getInputInfo(e) {
    e.preventDefault();
    const { value } = elements.input();
    const towns = value.split(", ").map((t) => {
        return { name: t };
    });
    appendTowns(towns);
}

function appendTowns(towns) {
    getTempl().then((templSource) => {
        const templ = Handlebars.compile(templSource);
        const htmlResult = templ({ towns });
        elements.root().innerHTML = htmlResult;
        elements.input().value = "";
    });
}

function getTempl() {
    return fetch("./townTemplate.hbs").then((r) => r.text());
}
