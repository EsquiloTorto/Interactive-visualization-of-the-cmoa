const GALLERY_CSV = "./collection-master/cmoa_no_null.csv";

// Function to load CSV file
function LoadCSV(url, callback) {
    d3.csv(url, d3.autoType)
    .then((data) => {
        const gallery = data.map((d) => d);
        callback(gallery);
    })
    .catch((error) => {
        console.error('Error loading CSV:', error);
    });
}

class Card {
    constructor(imageUrl) {
        this.imageUrl = imageUrl;
        this.originalWidth = 0;
        this.originalHeight = 0;
        this.isZoomed = false;
        this.cardElement = null;
    }

    async loadOriginalSize() {
        const image = new Image();
        image.src = this.imageUrl;
        await image.decode();
        this.originalWidth = image.width;
        this.originalHeight = image.height;
    }

    zoomIn() {
        if (this.isZoomed) return;

        // Check if any other card is currently zoomed
        const currentlyZoomedCard = Card.zoomedCard;
        if (currentlyZoomedCard && currentlyZoomedCard !== this) {
            currentlyZoomedCard.zoomOut();
            Card.cardElement.style.display = 'none';
        }

        this.isZoomed = true;
        Card.zoomedCard = this;

        // Get position of the grid-container in the screen
        const gridContainer = document.getElementById('grid-container');
        const gridContainerPosition = gridContainer.getBoundingClientRect();

        this.loadOriginalSize().then(() => {
            // Make zoom respect the aspect ratio of the original image
            const aspectRatio = this.originalWidth / this.originalHeight;
            const customHeight = this.cardElement.offsetWidth / aspectRatio;

            // Condition to verify if the image is too tall to fit in the screen
            // If it is, we need to make it be 500px tall
            if (this.cardElement.style.height !== 500) {
                this.cardElement.style.height = '500px';
                this.cardElement.style.width = `${500 * aspectRatio}px`;
            };

            // Place the selected card with the same position of the grid-container
            this.cardElement.style.position = 'absolute';
            this.cardElement.style.top = `${gridContainerPosition.top + 100}px`;
            this.cardElement.style.left = `${gridContainerPosition.left + 400}px`;
            this.cardElement.style.transform = 'translate(0, 0)';
            this.cardElement.style.zIndex = 1;

            // Position transition
            this.cardElement.style.transition = 'top 0.5s, left 0.5s, transform 0.5s';
            
            this.cardElement.classList.add('zoomed');
        });


        // Change the opacity of the other cards to 0.3 when one is zoomed
        const cards = document.querySelectorAll('.card');
        cards.forEach((card) => {
            if (card !== this.cardElement) {
                card.style.opacity = 0.3;
            }
        }
        );
        
        console.log(gridContainerPosition);

    }

    zoomOut() {
        if (!this.isZoomed) return;

        this.isZoomed = false;
        Card.zoomedCard = null;

        // Reset the height of the card to its original value
        this.cardElement.style.height = '';
        this.cardElement.style.width = '';
        // Reset the position of the card to its original value
        this.cardElement.style.position = '';
        this.cardElement.style.top = '';
        this.cardElement.style.left = '';
        this.cardElement.style.transform = '';
        this.cardElement.classList.remove('zoomed');
        // Change the opacity of the all the cards back to 1
        const cards = document.querySelectorAll('.card');
        cards.forEach((card) => {
            card.style.opacity = 1;
        }
        );

    }

    attachEventListeners() {
        this.cardElement.addEventListener('click', () => {
            if (this.isZoomed) {
                this.zoomOut();
            } else {
                this.zoomIn();
            }
        });
    }
}

Card.zoomedCard = null;

class Grid {
    constructor(gallery) {
        this.gallery = gallery;
        this.cards = [];
    }

    async render() {
        const gridElement = document.createElement('div');
        const gridContainer = document.getElementById('grid-container'); // Get the container element by id

        gridElement.className = 'grid';

        for (let i = 0; i < 25; i++) {
            const randomIndex = Math.floor(Math.random() * this.gallery.length);
            const imageUrl = this.gallery[randomIndex].image_url;

            const cardElement = document.createElement('div');
            cardElement.className = 'card';

            const imageElement = document.createElement('img');
            imageElement.src = imageUrl;
            imageElement.alt = `Image ${i}`;

            cardElement.appendChild(imageElement);
            gridElement.appendChild(cardElement);

            const card = new Card(imageUrl);
            card.cardElement = cardElement;
            this.cards.push(card);

            card.attachEventListeners();
        }

        gridContainer.appendChild(gridElement);
    }
}

LoadCSV(GALLERY_CSV, (gallery) => {
    const grid = new Grid(gallery);
    // Render grid inside div with id "grid-container"
    grid.render();
});