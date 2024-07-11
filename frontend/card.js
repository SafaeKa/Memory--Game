export default class Card {
    constructor(name, image, onClick) {
        this.name = name;
        this.image = image;
        this.cardElement = this.createCardElement(onClick);
    }

    createCardElement(onClick) {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.setAttribute("data-name", this.name);

        const frontElement = document.createElement("div");
        frontElement.classList.add("front");

        const frontImage = document.createElement("img");
        frontImage.classList.add("front-image");
        frontImage.src = this.image;
        frontElement.appendChild(frontImage);

        const backElement = document.createElement("div");
        backElement.classList.add("back");

        cardElement.appendChild(frontElement);
        cardElement.appendChild(backElement);

        cardElement.addEventListener("click", () => onClick(cardElement));

        return cardElement;
    }
}

