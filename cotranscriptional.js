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

var graph = new FornaForce('#chart');
var rna = new RNAGraph('', '', 'sup')
.elementsToJson()
.addLabels()
.reinforceStems()
.reinforceLoops()
.connectFakeNodes();

graph.molWidth=400;
graph.molHeight=300;
graph.labelInterval=0;
graph.force.friction(0.80);

graph.addRNAJSON(rna);

counter = 0;

function getNewPosition(positions) {
   var bondLength = 15;

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

   return newPos;
}

function pushNode(nucleotide) {
    var d = new Date();
    var n = d.getTime();
    var positions = rna.get_positions('nucleotide');
    var uids = rna.get_uids();

    var newPos = getNewPosition(positions);

    rna.seq += nucleotide;
    rna.dotbracket += '.';
    rna.rnaLength += 1;

    rna.computePairtable();
    rna.recalculateElements().elementsToJson();

    positions.push(newPos);
    rna.addPositions('nucleotide', positions).addUids(uids);
    rna.reinforceStems().reinforceLoops().connectFakeNodes();

    /*
    var lastNode = rna.nodes[rna.nodes.length-1];
    lastNode.x = newPos[0];
    lastNode.y = newPos[1];
    lastNode.px = newPos[0];
    lastNode.py = newPos[1];
    */

    //graph.update_rna_graph(rna);
    graph.recalculateGraph();
    graph.update();
    graph.center_view();

    counter += 1;
    var d1 = new Date();
        var n1 = d1.getTime();
    console.log('pushNode time:', n1 - n);
}

function addLink(from, to) {
    var d = new Date();
    var n = d.getTime();
    var fromNode = rna.nodes[from-1];
    var toNode = rna.nodes[to-1];

    var new_link = {source: fromNode, target: toNode};
    graph.add_link(new_link);

    rna.dotbracket = rnaUtilities.pairtableToDotbracket(rna.pairtable);
    graph.center_view();
    var d1 = new Date();
        var n1 = d1.getTime();
    console.log('addLink time:', n1 - n);
}

function removeLink(from, to) {
    var theLink = rna.links.filter(function(d) { 
        return d.source.num === from && d.target.num == to;
    });

    graph.remove_link(theLink[0]);
    rna.dotbracket = rnaUtilities.pairtableToDotbracket(rna.pairtable);
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

r = new RNAGraph('aaaaaaaaaaaaaa',
                 '...(((...)))..',
                 'blah');
                /*
r = new RNAGraph('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
                 '...(((...)))..(((((((...)))))))...(((((...)))))',
                 'blah');
                 */
r.computePairtable();

var pairs = [];
var alreadyAdded = {};

for (var i = 1; i <= r.pairtable[0]; i++) {
    if (r.pairtable[i] !== 0) {
        var toAdd = [i, r.pairtable[i]].sort(function(a,b) { return +b - +a; });

        if (!("".concat(toAdd) in alreadyAdded)) {
            pairs.push(toAdd);
            alreadyAdded["".concat(toAdd)] = true;
        }
    }
}

pairs = pairs.sort(function(a,b) { return -(+a[0] - +b[0]); });

time = 0;
timeStep = 500;

function timedPushNodes(nucleotides) {
    return function() {
        var toPush = nucleotides.shift();
        pushNode(toPush);

        if (nucleotides.length === 0) 
            graph.force.on('end', function() {});
        else
            graph.force.on('end', timedPushNodes(nucleotides));
    };
}

function timedPushNode(nucleotide) {
    return function() {
        pushNode(nucleotide);
        graph.force.on('end', function() {});
    };
}

function timedAddLink(from, to) {
    return function() {
        addLink(from, to);
    };
}

function executeBuilding(functions) {
    return function() {
        var toExecute = functions.shift();
        toExecute();

        if (functions.length === 0)
            graph.force.on('end', function() {});
        else
            graph.force.on('end', executeBuilding(functions));
    };
}

//var nucleotides = r.seq.split("");
//graph.force.on('end', timedPushNodes(nucleotides));
//setTimeout(timedPushNode('a'), 100);

var theFunctions = [];
for (var i = 0; i < r.seq.length; i++) {
    var nucleotide = r.seq[i];
    var nucNum = i+1;

    theFunctions.push(timedPushNode(nucleotide));

    if (pairs.length > 0) {
        if (nucNum === pairs[pairs.length-1][0]) {
            //this is a pair we can already make because the
            //first partner in the pair is always greater than
            // the second
            pair = pairs.pop();
            theFunctions.push(timedAddLink(pair[0], pair[1]));
        }
    }
}

graph.force.on('end', executeBuilding(theFunctions));

/*
for (i = 0; i < pairs.length; i++) {
    var pair = pairs[i];
    setTimeout(function() { addLink(pair[0],pair[1]); }, time = time + timeStep);
}
*/
//setTimeout(function() { 1 / 0;}, 10000);

