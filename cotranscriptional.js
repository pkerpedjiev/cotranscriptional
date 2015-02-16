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

graph.addRNA(rna);

function getNewPosition(positions) {
   var bondLength = 15;

   if (positions.length === 0)
       return [0,0];

   if (positions.length == 1)
       return [positions[0][0] + bondLength, positions[0][1]];

   var lasterPos = positions[positions.length-2];
   var lastPos = positions[positions.length-1];
   var newPos = [lastPos[0] + (lastPos[0] - lasterPos[0]), 
                 lastPos[1] + (lastPos[1] - lasterPos[1]) + 0.1];


   return newPos;
}

function pushNode(nucleotide) {
    positions = rna.get_positions('nucleotide');

    var newPos = getNewPosition(positions);

    rna.seq += nucleotide;
    rna.dotbracket += '.';
    rna.rna_length += 1;

    rna.compute_pairtable();
    rna.recalculate_elements().elements_to_json();

    positions.push(newPos);
    rna.add_positions('nucleotide', positions);

    /*
    var lastNode = rna.nodes[rna.nodes.length-1];
    lastNode.x = newPos[0];
    lastNode.y = newPos[1];
    lastNode.px = newPos[0];
    lastNode.py = newPos[1];
    */

    graph.update_rna_graph(rna);
    graph.recalculateGraph();
    graph.update();
    graph.center_view();
    console.log('push graph.graph', graph.graph.links);
}

function addLink(from, to) {
    var fromNode = rna.nodes[from-1];
    var toNode = rna.nodes[to-1];

    var new_link = {source: fromNode, target: toNode};
    graph.add_link(new_link);

    rna.dotbracket = rnaUtilities.pairtable_to_dotbracket(rna.pairtable);
    console.log('add_link graph.graph', graph.graph.links);
}

function removeLink(from, to) {
    var theLink = rna.links.filter(function(d) { 
        return d.source.num === from && d.target.num == to;
    });

    graph.remove_link(theLink[0]);
    rna.dotbracket = rnaUtilities.pairtable_to_dotbracket(rna.pairtable);
    console.log('remove_link graph.graph', graph.graph.links);
}

self.
pushNode('C');
time = 0;
timeStep = 100;
setTimeout(function() { pushNode('G'); } , time = time + timeStep);
setTimeout(function() { pushNode('G'); } , time = time + timeStep);
setTimeout(function() { pushNode('G'); } , time = time + timeStep);
setTimeout(function() { pushNode('G'); } , time = time + timeStep);
setTimeout(function() { pushNode('G'); } , time = time + timeStep);
setTimeout(function() { pushNode('G'); } , time = time + timeStep);
setTimeout(function() { pushNode('G'); } , time = time + timeStep);
setTimeout(function() { pushNode('G'); } , time = time + timeStep);
setTimeout(function() { pushNode('G'); } , time = time + timeStep);
