function sortByDate(a, b){
  return parseInt(a.creation_date) - parseInt(b.creation_date);
}

d3.selection.prototype.last = function() {
  var last = this.size() - 1;
  return d3.select(this[0][last]);
};

function buildVis(data){

  clearVis();

  let artista = d3.select("#artist-selector").node().value;
  console.log(artista);
  
  filteredData = data.filter(function(d){
    if (artista != d.full_name){
      return false;
    } else if (d.creation_date.length!=4){
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
    .html(d => "<div class='timeline-image'><img src='" + d.img_url + "'></div><div class='timeline-name'>" + d.title + "</div><div class='timeline-year'>" + d.creation_date + "</div><div class='timeline-line'></div>");

  var lines = document.querySelectorAll(".timeline-line");
  var lastLine = lines[ lines.length-1 ];
  lastLine.parentNode.removeChild(lastLine)
}

function clearVis(){
  let container = d3.select("#visualization");
  container.selectAll(".timeline-item").remove();
}


function populateSelector(data){

  let container = d3.select("#artist-selector");

  container.selectAll(".timeline-item")
    .remove()
    .data(d3.map(data, function(d){return d.full_name;}).keys())
    .enter()
    .append("option")
    .attr("value", d => d)
    .text(d => d);
}

$('#artist-selector').change(function(){
  build();
})

function build(){
  d3.csv('cmoa_4_all.csv').then( d => buildVis(d));
}

d3.csv('cmoa_4_all.csv').then( d => populateSelector(d));