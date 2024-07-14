export default class Card {
    constructor(name, image, onClick) {
        this.name = name;
        this.image = image;
        this.onClick = onClick;
        this.cardElement = this.createCardElement();
    }

    createCardElement() {
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

        cardElement.addEventListener("click", () => {
            if (typeof this.onClick === 'function') {
                this.onClick(cardElement);
            } else {
                console.error('onClick handler is not a function');
            }
        });

        return cardElement;
    }


    static shuffleArray(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
    }

    static shuffleCards(cardsAll, numberCards) {
        this.shuffleArray(cardsAll);
        const cards = [...cardsAll.slice(0, numberCards), ...cardsAll.slice(0, numberCards)];
        this.shuffleArray(cards);
        return cards;
    }


    static generateCards(gridContainer, cardsData, numberCards, onClick) {
        const shuffledCards = this.shuffleCards(cardsData, numberCards);
        for (let cardData of shuffledCards) {
            const card = new Card(cardData.name, cardData.image, onClick);
            gridContainer.appendChild(card.cardElement);
        }
    }
}

