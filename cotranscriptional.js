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
graph.showLabels=false;
graph.force.friction(0.95);

graph.addRNA(rna);

function getNewPosition(positions) {
   var bondLength = 15;

   console.log('positions:', positions);
   if (positions.length === 0)
       return [0,0];

   if (positions.length == 1)
       return [positions[0][0] + bondLength, positions[0][1]];

   var lasterPos = positions[positions.length-2];
   var lastPos = positions[positions.length-1];
   var dx = lastPos[0] - lasterPos[0];
   var dy = lastPos[1] - lasterPos[1];
   var newPos = [lastPos[0] + dx, 
                 lastPos[1] + dy + 2];
    console.log('lasterPos', lasterPos, 'lastPos', lastPos, 'newPos', newPos);
    console.log('mag', Math.sqrt(dx * dx + dy * dy));


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
}

function addLink(from, to) {
    var fromNode = rna.nodes[from-1];
    var toNode = rna.nodes[to-1];

    var new_link = {source: fromNode, target: toNode};
    graph.add_link(new_link);

    rna.dotbracket = rnaUtilities.pairtable_to_dotbracket(rna.pairtable);
    graph.center_view();
}

function removeLink(from, to) {
    var theLink = rna.links.filter(function(d) { 
        return d.source.num === from && d.target.num == to;
    });

    graph.remove_link(theLink[0]);
    rna.dotbracket = rnaUtilities.pairtable_to_dotbracket(rna.pairtable);
}

/*
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
setTimeout(function() { addLink(2,6); }, time = time + timeStep);
setTimeout(function() { addLink(1,7); }, time = time + timeStep);
setTimeout(function() { pushNode('G'); } , time = time + timeStep);
setTimeout(function() { pushNode('G'); } , time = time + timeStep);
*/
                /*
r = new RNAGraph('UCCGUGAUAGUUUAAUGGUCAGAAUGGGCGCUUGUCGCGUGCCAGAUCGGGGUUCAAUUCCCCGUCGCGGAGC',
                 '(((((((..(((..........))).(((((.......)))))....(((((.......))))))))))))..', 
                 'blah');
                */
               /*
r = new RNAGraph('GAAUUGCGGGAAAGGGGUCAACAGCCGUUCAGUACCAAGUCUCAGGGGAAACUUUGAGAUGGCCUUGCAAAGGGUAUGGUAAUAAGCUGACGGACAUGGUCCUAACCACGCAGCCAAGUCCUAAGUCAACAGAUCUUCUGUUGAUAUGGAUGCAGUUC',
                 '(...((((((...((((((.....(((.((((.(((..(((((((((....)))))))))..((.......))....)))......)))))))....))))))..)).))))..)..((((..((((((((((...))))))))).))))).......',
                 'blah');
                 */
                /*
r = new RNAGraph('UGGAGAGUUUGAUCCUGGCUCAGGGUGAACGCUGGCGGCGUGCCUAAGACAUGCAAGUCGUGCGGGCCGCGGGGUUUUACUCCGUGGUCAGCGGCGGACGGGUGAGUAACGCGUGGGUGACCUACCCGGAAGAGGGGGACAACCCGGGGAAACUCGGGCUAAUCCCCCAUGUGGACCCGCCCCUUGGGGUGUGUCCAAAGGGCUUUGCCCGCUUCCGGAUGGGCCCGCGUCCCAUCAGCUAGUUGGUGGGGUAAUGGCCCACCAAGGCGACGACGGGUAGCCGGUCUGAGAGGAUGGCCGGCCACAGGGGCACUGAGACACGGGCCCCACUCCUACGGGAGGCAGCAGUUAGGAAUCUUCCGCAAUGGGCGCAAGCCUGACGGAGCGACGCCGCUUGGAGGAAGAAGCCCUUCGGGGUGUAAACUCCUGAACCCGGGACGAAACCCCCGACGAGGGGACUGACGGUACCGGGGUAAUAGCGCCGGCCAACUCCGUGCCAGCAGCCGCGGUAAUACGGAGGGCGCGAGCGUUACCCGGAUUCACUGGGCGUAAAGGGCGUGUAGGCGGCCUGGGGCGUCCCAUGUGAAAGACCACGGCUCAACCGUGGGGGAGCGUGGGAUACGCUCAGGCUAGACGGUGGGAGAGGGUGGUGGAAUUCCCGGAGUAGCGGUGAAAUGCGCAGAUACCGGGAGGAACGCCGAUGGCGAAGGCAGCCACCUGGUCCACCCGUGACGCUGAGGCGCGAAAGCGUGGGGAGCAAACCGGAUUAGAUACCCGGGUAGUCCACGCCCUAAACGAUGCGCGCUAGGUCUCUGGGUCUCCUGGGGGCCGAAGCUAACGCGUUAAGCGCGCCGCCUGGGGAGUACGGCCGCAAGGCUGAAACUCAAAGGAAUUGACGGGGGCCCGCACAAGCGGUGGAGCAUGUGGUUUAAUUCGAAGCAACGCGAAGAACCUUACCAGGCCUUGACAUGCUAGGGAACCCGGGUGAAAGCCUGGGGUGCCCCGCGAGGGGAGCCCUAGCACAGGUGCUGCAUGGCCGUCGUCAGCUCGUGCCGUGAGGUGUUGGGUUAAGUCCCGCAACGAGCGCAACCCCCGCCGUUAGUUGCCAGCGGUUCGGCCGGGCACUCUAACGGGACUGCCCGCGAAAGCGGGAGGAAGGAGGGGACGACGUCUGGUCAGCAUGGCCCUUACGGCCUGGGCGACACACGUGCUACAAUGCCCACUACAAAGCGAUGCCACCCGGCAACGGGGAGCUAAUCGCAAAAAGGUGGGCCCAGUUCGGAUUGGGGUCUGCAACCCGACCCCAUGAAGCCGGAAUCGCUAGUAAUCGCGGAUCAGCCAUGCCGCGGUGAAUACGUUCCCGGGCCUUGUACACACCGCCCGUCACGCCAUGGGAGCGGGCUCUACCCGAAGUCGCCGGGAGCCUACGGGCAGGCGCCGAGGGUAGGGCCCGUGACUGGGGCGAAGUCGUAACAAGGUAGCUGUACCGGAAGGUGCGGCUGGAUCA',
                 '....((((.........)))).((((.(((((..(((((((((....(((.(((..(((..((.((((((((((.....)))))))))).)))))......(((......((((((((..((...(((((((.(((((....((((((....)))))).....)))))....((((.(((((....))))).))))...((((...)))).)))))))..))))))))))(((....(((..((((((((.......)))))))))))......)))..((((((((....))))...))))))).(((((............))))).(((((..)))))...)))))).).....(.(((...(((((....)))).))))).)).))))))..((((......((((....)))).....))))....(((((...(....((((.....)))).....)....)))))......(((((......(((((.....((....)).......))))))))))..)))))))))..........(((.....(.((((...(((.(((((((.((((((((((......((((((.....))))))....))))))))..)))))))))..(((((((((...((((((((....((((((....((........)).......))))))....).......((....)).)))))))..))))).)))..))))...))))....((((((...((...((((.........))))...))))))))..........((((((..((((((((((...))))))))))...((....)).....)))))))))).(((......((((....))))....)))........(((((.(((((((.((..(((((..((((((((((......((........))........(.(((((((..(...(............((((....))))...........................)).((.(((...((((((.(....(((((((((....)))...(((......)))...)))))).....((((.(((((.(..((...(((.....)))).)...).)))))..(..(((((....))))).....)..)))).....).).)))...)).)))))....))))))))..)).)))))))).(...(((((((.....(((..((..((((....))))..))....))).....)))))))......(....(((((((........)))))))....)..)..))))).....(((((((.(.....)..)))))))......))...)))))))))).))..(.(..((.(.((((.(((..((((((.((((((...(.((((....(((....))).)))).)..)))))).))))))..))).))))..).))...)..)..(((((((((....)))))))))......', 
                 'blah');
                 */

                /*
r = new RNAGraph('aaaaaaaaaaaaaa',
                 '...(((...)))..',
                 'blah');
                 */
r = new RNAGraph('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
                 '...(((...)))..(((((((...)))))))...(((((...)))))',
                 'blah');
r.compute_pairtable();

var pairs = [];
var alreadyAdded = {};

console.log('r.seq', r.seq);

for (var i = 1; i <= r.pairtable[0]; i++) {
    if (r.pairtable[i] !== 0) {
        var toAdd = [i, r.pairtable[i]].sort(function(a,b) { return +b - +a; });
        console.log('toAdd', toAdd);

        if (!("".concat(toAdd) in alreadyAdded)) {
            pairs.push(toAdd);
            alreadyAdded["".concat(toAdd)] = true;
        }
    }
}

pairs = pairs.sort(function(a,b) { return -(+a[0] - +b[0]); });

time = 0;
timeStep = 500;

function timedPushNode(nucleotide) {
    return function() {
        pushNode(nucleotide);
    };
}

function timedAddLink(from, to) {
    return function() {
        addLink(from, to);
    };
}

for (var i = 0; i < r.seq.length; i++) {
    var nucleotide = r.seq[i];
    var nucNum = i+1;

    setTimeout(timedPushNode(nucleotide), time = time + timeStep);

    if (pairs.length > 0) {
        console.log('currPair:', pairs[pairs.length-1]);
        if (nucNum === pairs[pairs.length-1][0]) {
            //this is a pair we can already make because the
            //first partner in the pair is always greater than
            // the second
            pair = pairs.pop();
            console.log('pair:', pair);
            setTimeout(timedAddLink(pair[0], pair[1]), time = time + timeStep);
        }
    }
}

/*
for (i = 0; i < pairs.length; i++) {
    var pair = pairs[i];
    setTimeout(function() { addLink(pair[0],pair[1]); }, time = time + timeStep);
}
*/
//setTimeout(function() { 1 / 0;}, 10000);

