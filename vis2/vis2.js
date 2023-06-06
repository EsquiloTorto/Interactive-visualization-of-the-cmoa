document.addEventListener("DOMContentLoaded", function() {
    const artistSelector = document.querySelector(".artist-selector");
    const artistText = document.getElementById("artist-name");
  
    artistSelector.addEventListener("change", function() {
      const selectedArtist = artistSelector.value;
      artistText.textContent = selectedArtist;
    });
  });
  