elements = {
    allCats: () => document.getElementById("allCats"),
};
renderCatTemplate();

Promise.all([getTemplate("./template.hbs"), getTemplate("./cats.hbs")])
    .then(([templateSrc, catSrc]) => {
        Handlebars.registerPartial("cat", catSrc);
        let template = Handlebars.compile(templateSrc);
        let resultHtml = template({ cats });
        elements.allCats().innerHTML = resultHtml;
    })
    .catch((e) => console.error(e));

function getTemplate(templateLocation) {
    return fetch(templateLocation).then((r) => r.text());
}

function renderCatTemplate() {
    elements.allCats().addEventListener("click", (e) => {
        const { target } = e;
        if (target.nodeName === "BUTTON" && target.className === "showBtn") {
            // Here i take clicked Button!

            let divStatus = target.parentNode.querySelector("div.status");
            if (divStatus.style.display === "none") {
                divStatus.style.display = "block";
                e.target.textContent = "Hide status code";
            } else {
                divStatus.style.display = "none";
                e.target.textContent = "Show status code";
            }
        }
    });
}
