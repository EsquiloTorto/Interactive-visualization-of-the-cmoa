function sortByDate(a, b){
  return parseInt(a.date_transformed) - parseInt(b.date_transformed);
}

d3.selection.prototype.last = function() {
  var last = this.size() - 1;
  return d3.select(this[0][last]);
};

function buildVis(data){

  clearVis();
  
  let artista = d3.select("#artist-selector").node().value;
  console.log(artista);
  
  titlelessWikiApi(artista);
  
  filteredData = data.filter(function(d){
    if (artista != d.full_name){
      return false;
    } else {
      return true;
    };
  }).sort(sortByDate);

  let container = d3.select("#visualization");

  container.selectAll(".timeline-item")
    .remove()
    .data(filteredData)
    .enter()
    .append("div")
    .attr("class", "timeline-item")
    .html(d => "<div class='frame'><div class='timeline-image'><img src='" + d.small_img_url + "'></div><div class='timeline-name'>" + d.title + "</div><div class='timeline-year'>" + d.creation_date + "/" + d.date_transformed + "</div></div><div class='timeline-line'></div>");
  

  var lines = document.querySelectorAll(".timeline-line");
  var lastLine = lines[ lines.length-1 ];
  lastLine.parentNode.removeChild(lastLine)
}

function clearVis(){
  let container = d3.select("#visualization");
  container.selectAll(".timeline-item").remove();
}


function populateSelector(data){

  filteredData = data.filter( function(d){
    if (d.full_name.length>20) {
      return false
    } else {
      return true
    }
  })

  let container = d3.select("#artist-selector");

  container.selectAll(".timeline-item")
    .remove()
    .data(d3.map(filteredData, function(d){return d.full_name;}).keys().sort())
    .enter()
    .append("option")
    .attr("value", d => d)
    .text(d => d);
}

$('#artist-selector').change(function(){
  build();
})

function build(){
  d3.csv('cmoa_vis2.csv').then( d => buildVis(d));
}

// function getWikiText(artist_name){
  
//   let wikiUrl = "https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?action=query&format=json&titles=" + artist_name.replace(" ", "_") + "&prop=extracts&exintro&explaintext&origin=*";

//   var xmlHttp = new XMLHttpRequest();
//   xmlHttp.open( "GET", wikiUrl, true ); // false for synchronous request
//   xmlHttp.send( null );
//   let text = xmlHttp.responseText;

//   console.log(text);
// }


// Function to fetch data from Wikipedia
function getWikiText(pageTitle) {
  var apiUrl = 'https://en.wikipedia.org/w/api.php';
  // Wikipedia API parameters
  var params = {
    action: 'query',
    format: 'json',
    prop: 'extracts',
    exintro: '',
    explaintext: '',
    origin: "*",
    titles: pageTitle
  };

  // Construct the API URL
  var url = apiUrl + '?' + Object.keys(params).map(function(key) {
    return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
  }).join('&');

  // Make a GET request to the API
  let text = fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      // Process the response data
      var pages = data.query.pages;
      var pageId = Object.keys(pages)[0];
      var extract = pages[pageId].extract;

      var textElement = document.querySelector("#bio");
      console.log(textElement);
      textElement.textContent = extract;
    })
    .catch(function(error) {
      console.log('Error fetching data from Wikipedia:', error);
    });
}


function titlelessWikiApi(pageTitle){
  var apiUrl = 'https://en.wikipedia.org/w/api.php';

  // Wikipedia API parameters for search action
  var searchParams = {
    action: 'query',
    format: 'json',
    list: 'search',
    srsearch: pageTitle,
    srprop: 'snippet',
    srinfo: 'totalhits',
    utf8: '',
    origin: "*",
    formatversion: 2
  };

  // Construct the search API URL
  var searchUrl = apiUrl + '?' + Object.keys(searchParams).map(function(key) {
    return encodeURIComponent(key) + '=' + encodeURIComponent(searchParams[key]);
  }).join('&');

  // Make a GET request to the search API
  fetch(searchUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      // Check if search results are available
      if (data.query.searchinfo.totalhits > 0) {
        // Get the title of the first search result
        var pageTitle = data.query.search[0].title;

        // Fetch data for the first search result
        getWikiText(pageTitle);
      } else {
        console.log('No matching Wikipedia page found.');
      }
    })
    .catch(function(error) {
      console.log('Error searching Wikipedia:', error);
    });
}

d3.csv('cmoa_vis2.csv').then( d => populateSelector(d));