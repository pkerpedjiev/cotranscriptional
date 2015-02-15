setPlottingArea = function() {
  var chartheight = $(window).height();
  if (!document.fullscreenElement &&    // alternative standard method
    !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {
    chartheight = chartheight-2;
  }
  
  $("#plotting-area").height(chartheight);
  var chartwidth = $("#chart").width();
  $("#plotting-area").width(chartwidth);
};

graph = new Graph('#chart');
rna = new RNAGraph('A', '.', 'sup')
.elements_to_json()
.add_labels()
.reinforce_stems()
.reinforce_loops()
.connect_fake_nodes();

graph.molWidth=400;
graph.molHeight=300;

graph.addNodes(rna);

console.log('hi');
