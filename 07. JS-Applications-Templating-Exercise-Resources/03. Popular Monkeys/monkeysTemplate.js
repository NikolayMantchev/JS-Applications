import monkeys from "./monkeys.js";

const elements = {
    allMonkeys: () => document.querySelector("div.monkeys"),
};
fetch("./monkeys.hbs")
    .then((r) => r.text())
    .then((monkeysTemplateSrc) => {
        const monkeysTemplate = Handlebars.compile(monkeysTemplateSrc);
        const resultHtml = monkeysTemplate({ monkeys });
        elements.allMonkeys().innerHTML += resultHtml;
        attachEventListener();
    })
    .catch((e) => console.error(e));

function attachEventListener() {
    elements.allMonkeys().addEventListener("click", (e) => {
        const { target } = e;
        if (target.nodeName !== "BUTTON" || target.textContent !== "Info") {
            return;
        }

        const p = target.parentNode.querySelector("p");
        console.log(p);
        if (p.style.display === "none") {
            p.style.display = "block";
        } else {
            p.style.display = "none";
        }
    });
}
