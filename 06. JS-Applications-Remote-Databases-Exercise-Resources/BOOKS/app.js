const htmlSelectors = {
    loadBooks: () => document.getElementById("loadBooks"),
    createButton: () => document.querySelector("#create-form > button"),
    createTitleInput: () => document.getElementById("create-title"),
    createAuthorInput: () => document.getElementById("create-author"),
    createIsbnInput: () => document.getElementById("create-isbn"),
    booksContainer: () => document.querySelector("table > tbody"),
    editForm: () => document.getElementById("edit-form"),
    editBtn: () => document.querySelector("#edit-form > button"),
    editTitleInput: () => document.getElementById("edit-title"),
    editAuthorInput: () => document.getElementById("edit-author"),
    editIsbnInput: () => document.getElementById("edit-isbn"),
    errorContainer: () => document.getElementById("error-notification"),
};

htmlSelectors["loadBooks"]().addEventListener("click", fetchAllBooks);
htmlSelectors["editBtn"]().addEventListener("click", editBook);
htmlSelectors["createButton"]().addEventListener("click", createBook);

function fetchAllBooks() {
    fetch("https://booksdb-a38e2.firebaseio.com/books/.json")
        .then((res) => res.json())
        .then(renderBooks)
        .catch(handleError);
}
function createBook(e) {
    e.preventDefault();

    const titleInput = htmlSelectors["createTitleInput"]();
    const authorInput = htmlSelectors["createAuthorInput"]();
    const isbnInput = htmlSelectors["createIsbnInput"]();
    if (
        titleInput.value != "" &&
        authorInput.value != "" &&
        isbnInput.value != ""
    ) {
        const initObj = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: titleInput.value,
                author: authorInput.value,
                isbn: isbnInput.value,
            }),
        };

        // Отговора от заявката рендва отново всички книги
        fetch("https://booksdb-a38e2.firebaseio.com/books/.json", initObj)
            .then(fetchAllBooks)
            .catch(handleError);
    }
    if (
        titleInput.value === "" ||
        authorInput.value === "" ||
        isbnInput.value === ""
    ) {
        const message = {
            message: "Inputs can not be empty!",
        };
        handleError(message);
    }
    titleInput.value = "";
    authorInput.value = "";
    isbnInput.value = "";
}
function handleError(err) {
    const errorContainer = htmlSelectors["errorContainer"]();
    errorContainer.style.display = "block";
    errorContainer.textContent = err.message;
    setTimeout(() => {
        errorContainer.style.display = "none";
    }, 5000);
}
function renderBooks(booksData) {
    const booksContainer = htmlSelectors["booksContainer"]();
    if (booksContainer.innerHTML !== "") {
        booksContainer.innerHTML = "";
    }
    // Обхождам елементите от фетч заявката и Създавам елементите
    Object.keys(booksData).forEach((bookId) => {
        // Деструктурирам обекта
        const { title, author, isbn } = booksData[bookId];

        const tableRow = createDomElement(
            "tr",
            "",
            {},
            {},
            createDomElement("td", title, {}, {}),
            createDomElement("td", author, {}, {}),
            createDomElement("td", isbn, {}, {}),
            createDomElement(
                "td",
                "",
                {},
                {},
                createDomElement(
                    "button",
                    "Edit",
                    { "data-key": bookId },
                    { click: loadBookById }
                ),
                createDomElement(
                    "button",
                    "Delete",
                    { "data-key": bookId },
                    { click: deleteBook }
                )
            )
        );
        booksContainer.appendChild(tableRow);
    });
    return booksContainer;
}
function deleteBook() {
    const id = this.getAttribute("data-key");
    const initObj = {
        method: "DELETE",
    };
    fetch(`https://booksdb-a38e2.firebaseio.com/books/${id}.json`, initObj)
        .then(fetchAllBooks)
        .catch(handleError);
}
function loadBookById() {
    const id = this.getAttribute("data-key");

    fetch(`https://booksdb-a38e2.firebaseio.com/books/${id}.json`)
        .then((res) => res.json())
        .then(({ title, author, isbn }) => {
            htmlSelectors["editTitleInput"]().value = title;
            htmlSelectors["editAuthorInput"]().value = author;
            htmlSelectors["editIsbnInput"]().value = isbn;
            htmlSelectors["editForm"]().style.display = "block";
            htmlSelectors["editBtn"]().setAttribute("data-key", id);
        });
}
function editBook(e) {
    e.preventDefault();
    // Взимам актуалния ID
    const id = this.getAttribute("data-key");
    const titleInput = htmlSelectors["editTitleInput"]();
    const authorInput = htmlSelectors["editAuthorInput"]();
    const isbnInput = htmlSelectors["editIsbnInput"]();
    if (
        titleInput.value != "" &&
        authorInput.value != "" &&
        isbnInput.value != ""
    ) {
        const initObj = {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: titleInput.value,
                author: authorInput.value,
                isbn: isbnInput.value,
            }),
        };
        htmlSelectors["editForm"]().style.display = "none";
        fetch(`https://booksdb-a38e2.firebaseio.com/books/${id}.json`, initObj)
            .then(fetchAllBooks)
            .catch(handleError);
    }
    if (
        titleInput.value === "" ||
        authorInput.value === "" ||
        isbnInput.value === ""
    ) {
        const message = {
            message: "Fill all inputs and try again!",
        };
        handleError(message);
    }
}
function createDomElement(type, text, attributes, events, ...children) {
    // Създавам елемента
    const domElement = document.createElement(type);

    // Записвам текста
    if (domElement != "") {
        domElement.textContent = text;
    }

    // Обръщам обекта в масив и Деструктурирам масива с атрибути и ги сетвам на елемента
    Object.entries(attributes).forEach(([atrKey, atrValue]) => {
        domElement.setAttribute(atrKey, atrValue);
    });

    // Същото и за евента
    Object.entries(events).forEach(([eventName, eventHandler]) => {
        domElement.addEventListener(eventName, eventHandler);
    });

    // Добавям децата
    children.forEach((child) => {
        domElement.appendChild(child);
    });
    return domElement;
}
