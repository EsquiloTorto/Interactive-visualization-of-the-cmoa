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

// Function to filter gallery by classification
function filterGalleryByClassification(gallery, classification) {
    return gallery.filter((item) => item.classification === classification);
}

function capitalizeInitials(str) {
    // Divide a string em um array de palavras
    var words = str.toLowerCase().split(' ');
  
    // Mapeia cada palavra e transforma a inicial em letra maiúscula
    var capitalizedWords = words.map(function(word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });
  
    // Junta as palavras novamente em uma única string
    var result = capitalizedWords.join(' ');
  
    return result;
}

// Class to handle various functionalities
class Functionalities {
    constructor(gallery) {
        this.gallery = gallery;
        this.mybutton = document.getElementById("topBtn");
        this.gridItems = Array.from(document.querySelectorAll('.grid-item'));

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

    // Randomize the gallery rows
    randomizeGallery(gallery) {
        gallery.sort(() => Math.random() - 0.5);
    }


}


class Grid {
    constructor(gallery) {
        this.grid = document.querySelector('.grid');
        this.listing_div = document.querySelector('.listing_div');
        this.gallery = gallery;
        this.iso = new Isotope(this.grid, {  
        percentPosition: true,
        layoutMode: 'cellsByRow',
        itemSelector: '.grid-item',
        cellsByRow: {
            columnWidth: 200,
            rowHeight: 300 // Set rowHeight to 'auto' for adaptive sizing
        },        
        masonry: {
            columnWidth: 170,
            rowHeight: 300
        }
        });
      
        // Store a reference to the currently zoomed item
        this.zoomedItem = null;

        // Attach click event listener to grid items
        this.grid.addEventListener('click', this.handleItemClick.bind(this));
        this.listing_div.addEventListener('click', this.handleListClick.bind(this));
        this.grid.addEventListener('mouseover', this.handleItemHover.bind(this));
        this.grid.addEventListener('mouseout', this.handleItemHover.bind(this));

        // Change grid layout on button click with class="cellsByRowbutton" or "masonrybutton"
        const cellsByRowButton = document.querySelector('.cellsByRowbutton');
        const masonryButton = document.querySelector('.masonrybutton');
        cellsByRowButton.addEventListener('click', () => {
            this.iso.arrange({ layoutMode: 'cellsByRow' });
            this.iso.layout();
        }
        );
        masonryButton.addEventListener('click', () => {
            this.iso.arrange({ layoutMode: 'masonry' });
            this.iso.layout();
        }
        );
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
      } else {
        // If the user clicked outside the grid item, zoom out if there is a zoomed item
        if (this.zoomedItem) {
          this.zoomedItem.classList.remove('zoomed');
          this.zoomedItem = null;
        }
      }
    }

    // Make the grid-item corresponding to the clicked list item zoomed
    handleListClick(event) {
        const clickedItem = event.target.closest('li');
        if (clickedItem) {
          const anchor = clickedItem.querySelector('a');
          const anchorHref = anchor.getAttribute('href'); // Get the href attribute value of the anchor
          const itemId = anchorHref.slice(1); // Remove the '#' from the href value to get the grid-item ID
    
          const clickedGridItem = document.getElementById(itemId); // Find the corresponding grid-item
          const itemInfo = clickedGridItem.querySelector('.item-info');
          if (clickedGridItem) {
            if (this.zoomedItem === clickedGridItem) {
              // If the clicked item is already zoomed, remove the zoomed class
              clickedGridItem.classList.remove('zoomed');
              itemInfo.style.display = 'none';
              this.zoomedItem = null;
            } else {
              // Remove zoomed class from the previously zoomed item
              if (this.zoomedItem) {
                
                // Hide the item info of the previously zoomed item
                this.zoomedItem.querySelector('.item-info').style.display = 'none';
                this.zoomedItem.classList.remove('zoomed');
              }
              // Add zoomed class to the clicked item
              clickedGridItem.classList.add('zoomed');
              itemInfo.style.display = 'block';
              this.zoomedItem = clickedGridItem;
            }
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
      const classification = galleryRow.classification;
      const web_url = galleryRow.web_url;
  
      return { title, artist, date, classification, web_url };
    }
  
    // Add an item to the grid
    addGridItem(galleryRow) {
      const gridItem = document.createElement('div');
      gridItem.classList.add('grid-item');
      gridItem.id = galleryRow.title.replace(/\s+/g, '-').toLowerCase(); // Define o ID baseado no título
  
      const imageElement = document.createElement('img');
      imageElement.src = galleryRow.small_img_url;
      imageElement.style.width = '140px';
      imageElement.style.height = 'auto';
  
      const infoElement = document.createElement('div');
      infoElement.classList.add('item-info');
      const { title, artist, date, classification, web_url } = this.getItemInfo(galleryRow);
      infoElement.innerHTML = `
        <h3><a href="#${gridItem.id}">Title: ${title}</a></h3>
        <p>Source: ${artist}</p>
        <p>Date: ${date}</p>
        <p>Class.: ${capitalizeInitials(classification)}</p>
        <a href="${web_url}" target="_blank">View on CMOA website</a>
      `;
  
      // Select element with class="listing"
      const listing = document.querySelector('.listing');
      
      // Add li to ul class="listing" element  with title
      const li = document.createElement('li');
      listing.appendChild(li);
      li.innerHTML = `<a href="#${gridItem.id}">${title}</a>`; // Adiciona um link de âncora para o ID do grid-item
  
      gridItem.appendChild(imageElement);
      gridItem.appendChild(infoElement);
      this.grid.appendChild(gridItem);
      this.iso.appended(gridItem);
      this.iso.layout();
    }
  }


loadCSV(GALLERY_CSV)
    .then((gallery) => {
    // Create a new grid
    const grid = new Grid(gallery);

    // Instantiate the Functionalities class
    const functionalities = new Functionalities(gallery);

    // Add the first 20 images to the grid
    for (let i = 0; i < 20; i++) {
      grid.addGridItem(gallery[i]);
    }


    // Dropdown menu functionality
    const dropdown = document.getElementById('classificationDropdown');

    dropdown.addEventListener('change', (event) => {
        const selectedClassification = event.target.value;
        grid.iso.arrange({ layoutMode: 'cellsByRow' });

        // Clear existing items in the grid
        grid.iso.remove(grid.iso.getItemElements());

        // Clear existing items in listing
        const listing = document.querySelector('.listing');
        listing.innerHTML = '';

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

    // Random button functionality
    const randomButton = document.getElementById('randomButton');
    randomButton.addEventListener('click', () => {
        // Get the selected classification from the dropdown
        const selectedClassification = dropdown.value;

        // Filter gallery by selected classification
        const filteredGallery = filterGalleryByClassification(gallery, selectedClassification);

        functionalities.randomizeGallery(filteredGallery);


        if (selectedClassification === 'all') {
            functionalities.randomizeGallery(gallery);
            // Clear existing items in the grid
            grid.iso.remove(grid.iso.getItemElements());

            // Clear existing items in listing
            const listing = document.querySelector('.listing');
            listing.innerHTML = '';

            // Add the first 20 randomized images to the grid
            gallery.slice(0, 20).forEach((item) => {
            grid.addGridItem(item);
            });
            grid.iso.arrange({ layoutMode: 'cellsByRow' });
            
        } else {
            // Clear existing items in the grid
            grid.iso.remove(grid.iso.getItemElements());

            // Clear existing items in listing
            const listing = document.querySelector('.listing');
            listing.innerHTML = '';

            // Add the first 20 randomized images to the grid
            filteredGallery.slice(0, 20).forEach((item) => {
            grid.addGridItem(item);
            });
            grid.iso.arrange({ layoutMode: 'cellsByRow' });
        }
    });

    // Add a scroll event listener to the window to work with the filter dropdown
    window.addEventListener('scroll', () => {
      // If the user has scrolled to the bottom of the page
      if ($(window).scrollTop() + $(window).height() > $(document).height() - 500) {
        // Get the selected classification from the dropdown
        const selectedClassification = dropdown.value;

        // Get the number of items currently in the grid
        const numItems = grid.iso.getItemElements().length;

        if (selectedClassification === 'all') {
            // Add the next 5 images from the full gallery to the grid
            gallery.slice(numItems, numItems + 5).forEach((item) => {
            grid.addGridItem(item);
            });
        } else {
            // Filter gallery by selected classification
            const filteredGallery = filterGalleryByClassification(gallery, selectedClassification);

            // Add the next 5 filtered images to the grid
            filteredGallery.slice(numItems, numItems + 5).forEach((item) => {
            grid.addGridItem(item);
            });
        }
        grid.iso.layout();
      }
    });
})
.catch((error) => {
    console.error('Error loading CSV:', error);
});
