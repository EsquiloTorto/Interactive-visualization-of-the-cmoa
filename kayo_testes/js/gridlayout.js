const GALLERY_CSV = "./collection-master/cmoa_no_null.csv";

// Function to load CSV file
function loadCSV(url) {
  return new Promise((resolve, reject) => {
    d3.csv(url, d3.autoType)
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// Class to handle various functionalities
class Functionalities {
    constructor() {
      this.mybutton = document.getElementById("myBtn");
      // When the user scrolls down 20px from the top of the document, show the button
      window.onscroll = () => this.scrollFunction();
  
      // Add click event listener to the button
      this.mybutton.addEventListener("click", () => this.topFunction());
    }
  
    scrollFunction() {
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        this.mybutton.style.display = "block";
      } else {
        this.mybutton.style.display = "none";
      }
    }
  
    // When the user clicks on the button, scroll to the top of the document smoothly
    topFunction() {
        if ('scrollBehavior' in document.documentElement.style) {
        // If the browser supports scroll behavior, use it
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        } else {
        // Fallback for browsers that do not support scroll behavior
        const scrollToTop = () => {
            const currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
            if (currentPosition > 0) {
            window.requestAnimationFrame(scrollToTop);
            window.scrollTo(0, currentPosition - currentPosition / 8);
            }
        };
        scrollToTop();
        }
    }
}

class Grid {
    constructor(gallery) {
        this.grid = document.querySelector('.grid');
        this.gallery = gallery;
        this.iso = new Isotope(this.grid, {
        layoutMode: 'cellsByRow',
        itemSelector: '.grid-item',
        cellsByRow: {
            columnWidth: 200,
            rowHeight: 300,
        },
        });

        // Store a reference to the currently zoomed item
        this.zoomedItem = null;

        // Attach click event listener to grid items
        this.grid.addEventListener('click', this.handleItemClick.bind(this));
        this.grid.addEventListener('mouseover', this.handleItemHover.bind(this));
        this.grid.addEventListener('mouseout', this.handleItemHover.bind(this));
    }
  
    handleItemClick(event) {
        const clickedItem = event.target.closest('.grid-item');
        if (clickedItem) {
            if (this.zoomedItem === clickedItem) {
                // If the clicked item is already zoomed, remove the zoomed class
                clickedItem.classList.remove('zoomed');
                this.zoomedItem = null;
            } else {
                // Remove zoomed class from the previously zoomed item
                if (this.zoomedItem) {
                this.zoomedItem.classList.remove('zoomed');
                }
                // Add zoomed class to the clicked item
                clickedItem.classList.add('zoomed');
                this.zoomedItem = clickedItem;
            }
            this.iso.layout();
        } else {
            // If the user clicked outside the grid item, zoom out if there is a zoomed item
            if (this.zoomedItem) {
                this.zoomedItem.classList.remove('zoomed');
                this.zoomedItem = null;
                this.iso.layout();
            }
        }
    }
  
    handleItemHover(event) {
        const hoveredItem = event.target.closest('.grid-item');
        const zoomedItem = this.zoomedItem;
        
        if (hoveredItem && (!zoomedItem || hoveredItem !== zoomedItem)) {
            const infoElement = hoveredItem.querySelector('.item-info');
            if (event.type === 'mouseover') {
                infoElement.style.display = 'block';
            } else if (event.type === 'mouseout') {
                infoElement.style.display = 'none';
            }
        }
    }
  
    // Get item info
    getItemInfo(galleryRow) {
        const title = galleryRow.title;
        const artist = galleryRow.cited_name;
        const date = galleryRow.creation_date;
        const web_url = galleryRow.web_url;

        return { title, artist, date, web_url };
    }
  
    // Add an item to the grid
    addGridItem(galleryRow) {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');

        const imageElement = document.createElement('img');
        imageElement.src = galleryRow.small_img_url;
        imageElement.style.width = '140px';
        imageElement.style.height = 'auto';

        const infoElement = document.createElement('div');
        infoElement.classList.add('item-info');
        const { title, artist, date, web_url } = this.getItemInfo(galleryRow);
        infoElement.innerHTML = `
        <h3>${title}</h3>
        <p>${artist}</p>
        <p>${date}</p>
        <a href="${web_url}" target="_blank">View on CMOA website</a>
        `;

        gridItem.appendChild(imageElement);
        gridItem.appendChild(infoElement);
        this.grid.appendChild(gridItem);
        this.iso.appended(gridItem);
        this.iso.layout();

        // Get the position of the newly added grid item
        const itemPosition = this.getItemPosition(gridItem);
        console.log('Item position:', itemPosition);
    }
  
    getItemPosition(item) {
        const cells = this.iso.filteredItems.map((filteredItem) => filteredItem.element);
        const position = cells.indexOf(item);
        return position;
    }
}
  

// Function to filter gallery by classification
function filterGalleryByClassification(gallery, classification) {
  return gallery.filter((item) => item.classification === classification);
}

loadCSV(GALLERY_CSV)
  .then((gallery) => {
    // Create a new grid
    const grid = new Grid(gallery);

    // Add the first 20 images to the grid
    for (let i = 0; i < 20; i++) {
      grid.addGridItem(gallery[i]);
    }

    // Instantiate the Functionalities class
    const functionalities = new Functionalities();

    // Dropdown menu functionality
    const dropdown = document.getElementById('classificationDropdown');
    dropdown.addEventListener('change', (event) => {
      const selectedClassification = event.target.value;

      // Clear existing items in the grid
      grid.iso.remove(grid.iso.getItemElements());

      if (selectedClassification === 'all') {
        // Add all images to the grid
        gallery.slice(0, 20).forEach((item) => {
          grid.addGridItem(item);
        });
      } else {
        // Filter gallery by selected classification
        const filteredGallery = filterGalleryByClassification(gallery, selectedClassification);

        // Add the first 20 filtered images to the grid
        filteredGallery.slice(0, 20).forEach((item) => {
          grid.addGridItem(item);
        });
      }
    });

    // Add a scroll event listener to the window to work with the filter dropdown
    window.addEventListener('scroll', () => {
      // If the user has scrolled to the bottom of the page
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        // Get the selected classification from the dropdown
        const selectedClassification = dropdown.value;

        // Get the number of items currently in the grid
        const numItems = grid.iso.getItemElements().length;

        if (selectedClassification === 'all') {
          // Add the next 20 images from the full gallery to the grid
          gallery.slice(numItems, numItems + 20).forEach((item) => {
            grid.addGridItem(item);
          });
        } else {
          // Filter gallery by selected classification
          const filteredGallery = filterGalleryByClassification(gallery, selectedClassification);

          // Add the next 20 filtered images to the grid
          filteredGallery.slice(numItems, numItems + 20).forEach((item) => {
            grid.addGridItem(item);
          });
        }
      }
    });
  })
  .catch((error) => {
    console.error('Error loading CSV:', error);
  });
