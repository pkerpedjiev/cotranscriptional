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
rna = new RNAGraph('', '', 'sup')
.elements_to_json()
.add_labels()
.reinforce_stems()
.reinforce_loops()
.connect_fake_nodes();

graph.molWidth=400;
graph.molHeight=300;

graph.addNodes(rna);

function pushNode(rna, graph, nucleotide) {
    positions = rna.get_positions();
    rna.seq.push(nucleotide);
    rna.dotbracket.push('.');

    graph.update_rna_graph();
}

console.log('hi');
pushNode(rna, graph, 'C');
