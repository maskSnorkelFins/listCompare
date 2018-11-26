function postVersionNotes() {
  var thisVersion = "v70 - adjusting sensitivity<br/>" +
                    "";
  document.getElementById("versionNotes").innerHTML = thisVersion;
}


function testing() {
  test1();
  function test1() {
    console.log("test 1");
  }
  console.log("test runs complete\n\n");
} // end testing()



function checkNames() {
  var requiredScoreWhole = .7;
  var requiredScoreSplit = .75;
  var requiredScoreLast = .9;
  var requiredScoreFirst = .5;

  var calculations = 0;

  var matchCountWhole = 0;
  var matchCountSplit = 0;

  var scoresWhole = [];
  var scoresWhole_flip = [];
  var jWhole = [];
  var jWhole_flip = [];

  var scoresSplit = [];
  var jSplit = [];

  var resultReport = [];

  var runFlipChecks = true;



// get names from textareas
  var arrayYourStudents = document.getElementById("yourStudents").value.split('\n');
  var arrayOtherList =  document.getElementById("otherList").value.split('\n');

  if (arrayYourStudents == "" || arrayOtherList == "") {
    window.alert("Copy/paste a list in each box to proceed");
  }

  // make copies to preserve original lists
  var yourStudents_Scrub = arrayYourStudents.slice();
  var otherList_Scrub = arrayOtherList.slice();

  // remove non-ASCII characters, whitespace
  scrubArray(yourStudents_Scrub);
  flipCommaList(yourStudents_Scrub);
      // yourStudents_Scrub is now clean
      document.getElementById("yourStudents").value = yourStudents_Scrub.join('\n');
      localStorage.setItem("savedList4300", yourStudents_Scrub.join('\n'));  // save your list to browser storage for later retrieval

  scrubArray(otherList_Scrub);
  flipCommaList(otherList_Scrub);
      // otherList_Scrub is now clean
      document.getElementById("otherList").value = otherList_Scrub.join('\n');

  // create flipped version of otherList
  var otherList_Flip = otherList_Scrub.slice();
    flipFirstLastNames(otherList_Flip);


          function flipCommaList(array) {
          // flips list if "lastname, firstname"
            if (array[0].includes(",") || array[1].includes(",") || array[2].includes(",") ||
                array[3].includes(",") ||  array[4].includes(",")) {
              for (var i = 0; i < array.length; i++) {
                  var split = array[i].split(", ");
                  array[i] = split[1] + " " + split[0];
              }
              console.log("names were in reverse order, changed to:");
              console.log(array);
            }
            else {
              console.log("not a comma-separated list");
            }
          }

          function flipFirstLastNames(array) {
            for (var i = 0; i < array.length; i++) {
                var split = array[i].split(" ");
                array[i] = split[1] + " " + split[0];
            }
            console.log("flipped otherList:\n");
            console.log(array);
            return array;
          }


//  PASS #1 - WHOLE names
  checkWhole();
  function checkWhole() {
      console.log("\n\ncheck WHOLE names\n\n");
      for (var i = 0; i < yourStudents_Scrub.length; i++) {
        var result_top = 0;
        var resultFlip_top = 0;
        var j_top = -1;
        var jFlip_top = -1;

        for (var j = 0; j < otherList_Scrub.length; j++) {
            var result = similarity(yourStudents_Scrub[i], otherList_Scrub[j]);
                calculations++;
            var resultFlip = similarity(yourStudents_Scrub[i], otherList_Flip[j]);
                calculations++;

            if (result > result_top) {
              result_top = result;
              j_top = j;
            }
            if (resultFlip > resultFlip_top) {
              resultFlip_top = resultFlip;
              jFlip_top = j;
            }
        }

        // record results to Whole lists
        scoresWhole[i] = result_top;
        scoresWhole_flip[i] = resultFlip_top;

        jWhole[i] = j_top;
        jWhole_flip[i] = jFlip_top;
      }

      console.log(scoresWhole);
      console.log(scoresWhole_flip);
      console.log(jWhole);
      console.log(jWhole_flip);

      // switch otherList to flipped version if that list produces higher match scores
      function getSum(total, num) {
          return total + num;
      }
      var avg = scoresWhole.reduce(getSum);
          console.log("scoresReg = " + (avg / scoresWhole.length));
      var avg_flip = scoresWhole_flip.reduce(getSum);
          console.log("scoresFlip = " + (avg_flip / scoresWhole_flip.length));

      if (avg_flip > avg) {
          scoresWhole = scoresWhole_flip.slice();
          jWhole = jWhole_flip.slice();
              console.log("will use scoresWhole_flip and jWhole_flip");
              console.log(scoresWhole);
              console.log(jWhole);
          otherList_Scrub = otherList_Flip;  // use FLIP version of otherList, more high matches
              console.log("flipping otherList for SPLIT checks, it's now\n" + otherList_Scrub);
      }
      else {
          console.log("no need to flip otherList");
      }
  } // end checkWhole()



// create SPLIT lists
  var last_yourStudents = yourStudents_Scrub.slice();
    lastNames(last_yourStudents);
  var first_yourStudents = yourStudents_Scrub.slice();
    firstNames(first_yourStudents);

  var last_otherList = otherList_Scrub.slice();
    lastNames(last_otherList);
  var first_otherList = otherList_Scrub.slice();
    firstNames(first_otherList);


//  PASS #2 - SPLIT names
  checkSplit();
  function checkSplit() {
      console.log("\n\ncheck SPLIT names\n\n");
      for (var i = 0; i < last_yourStudents.length; i++) {
        var result_top = 0;
        var j_top = -1;

        for (var j = 0; j < last_otherList.length; j++) {
            var resultLast = similarity(last_yourStudents[i], last_otherList[j]);
                calculations++;
            var resultFirst = similarity(first_yourStudents[i], first_otherList[j]);
                calculations++;

            var result;

            if (resultLast >= requiredScoreLast) {
              if (resultFirst >= requiredScoreFirst) {
                result = ((resultLast * 3) + resultFirst) / 4;
              }
            }
            else {
              result = 0;
            }

            if (result > result_top) {
              result_top = result;
              j_top = j;
            }
        }

        // record results to Split lists
        scoresSplit[i] = result_top;
        jSplit[i] = j_top;
      }

      console.log(scoresSplit);
      console.log(jSplit);

  } // end checkSplit()



//  OUTPUT RESULTS
var perfectWholeReported = 0;

    for (var i = 0; i < yourStudents_Scrub.length; i++) {
      if (scoresWhole[i] == 1 || scoresSplit[i] == 1) {

          resultReport[i] = yourStudents_Scrub[i];
              console.log(resultReport[i]);
              reportPerfectMatch(resultReport[i]);
              perfectWholeReported++;
      }
    }
    if (perfectWholeReported == 0) {
        reportPerfectMatch("none");
    }
    document.getElementById("resultsHeader").style.visibility = "visible";
    document.getElementById("paraPerfect").style.visibility = "visible";


var closeWholeReported = 0;
    for (var i = 0; i < yourStudents_Scrub.length; i++) {
      if ((scoresSplit[i] > scoresWhole[i]) &&
          ((scoresWhole[i] < 1 && scoresWhole[i] >= requiredScoreWhole) ||
           (scoresSplit[i] < 1 && scoresSplit[i] >= requiredScoreSplit))) {

          var thisScore = (Math.round(scoresWhole[i] * 100));
          var thisScoreSplit = (Math.round(scoresSplit[i] * 100));

          console.log(thisScore + " vs " + thisScoreSplit + " on " + yourStudents_Scrub[i]);

          if (thisScoreSplit > thisScore) {
            thisScore = thisScoreSplit;
          }

          resultReport[i] = thisScore + "% " + yourStudents_Scrub[i] + " \xa0 / \xa0 " + otherList_Scrub[jWhole[i]];
              console.log(resultReport[i]);
              reportCloseMatch(resultReport[i]);
              closeWholeReported++;
      }
    }
    if (closeWholeReported == 0) {
        reportCloseMatch("none");
    }
    document.getElementById("paraClose").style.visibility = "visible";

    console.log("\n");
    console.log(calculations + " calculations");
    console.log(matchCountWhole + " total WHOLE matches");
    console.log(matchCountSplit + " total SPLIT matches");
    console.log("\n\n\n");
} // end checkNames()







function reportPerfectMatch(report) {
// having trouble abstracting this to cover close matches as well
    var node = document.createElement("LI");
    var textnode = document.createTextNode(report);
    node.appendChild(textnode);
    document.getElementById("listPerfect").appendChild(node);
}
function reportCloseMatch(report) {
// having trouble abstracting this to cover perfect matches as well
    var node = document.createElement("LI");
    var textnode = document.createTextNode(report);
    node.appendChild(textnode);
    document.getElementById("listClose").appendChild(node);
}



function lastNames(array) {
  for (var i = 0; i < array.length; i++) {
      var split = array[i].split(" ");
      var splitLength = split.length - 1;
      array[i] = split[splitLength];
      // console.log("I grabbed LASTname " + split[splitLength]);
  }
}
function firstNames(array) {
  var nickname = 5;
  for (var i = 0; i < array.length; i++) {
      var split = array[i].split(" ");
      array[i] = split[0].substring(0, nickname); // take first # letters of firstname
      console.log("I grabbed FIRSTname " + array[i]);
  }
}



function scrubArray(array) {
  console.log("\n\noriginal array:");
  console.log(array);

  // remove special chars
  for (var i = 0; i < array.length; i++) {
      array[i] = array[i].replace('\t',' ');
      array[i] = array[i].replace('~','');
      array[i] = array[i].replace('!','');
      array[i] = array[i].replace('@','');
      array[i] = array[i].replace('#','');
      array[i] = array[i].replace('$','');
      array[i] = array[i].replace('%','');
      array[i] = array[i].replace('^','');
      array[i] = array[i].replace('&','');
      array[i] = array[i].replace('*','');
      array[i] = array[i].replace('(','');
      array[i] = array[i].replace(')','');
      array[i] = array[i].replace('_','');
      array[i] = array[i].replace('=','');
      array[i] = array[i].replace('+','');
      array[i] = array[i].replace('[','');
      array[i] = array[i].replace(']','');
      array[i] = array[i].replace('{','');
      array[i] = array[i].replace('}','');
      array[i] = array[i].replace('\\','');
      array[i] = array[i].replace('|','');
      array[i] = array[i].replace(';','');
      array[i] = array[i].replace(':','');
      array[i] = array[i].replace('"','');
      array[i] = array[i].replace('.','');
      array[i] = array[i].replace('<','');
      array[i] = array[i].replace('>','');
      array[i] = array[i].replace('/','');
      array[i] = array[i].replace('?','');

      // remove whitespace
      for (var j = 0; j < array[i].length; j++) {
        if (/\S/.test(array[i][j])) {
          // console.log("No whitespace at " + j);
          array[i] = array[i].slice(j, array[i].length);
          break;
        }
      }
  } // end loop (removal special chars)
  console.log("scrub 1, special chars removed:");
  console.log("scrub 2, whitespace removed:");
  console.log(array);

  // remove short <4 chars
  for (var i = 0; i < array.length; i++) {
    if (array[i].length < 4) {
      array.splice(i, 1);
      i--;
    }
  }
  console.log("scrub 3, length < 4 removed:");
  console.log(array);

  // remove madonnas
  for (var i = 0; i < array.length; i++) {
    var split = array[i].split(" ");

    if (split[1] == undefined) {  // only 1 word, not a student name
      array.splice(i, 1);
      i--;
    }
  }
  console.log("scrub 4, madonnas removed:");
  console.log(array);
} // end scrubArray()



function clearBox(box) {
  document.getElementById(box).value = "";
}



function loadLocalStorage() {
  // load savedList4300 if it exists, otherwise create empty list
  if (!localStorage.savedList4300) {
    localStorage.savedList4300 = "";
        console.log("created NEW localStorage.savedList4300");
  }
  else {
    document.getElementById("yourStudents").value = localStorage.savedList4300;
        console.log("loaded STORED localStorage.savedList4300:\n" + localStorage.savedList4300);
  }
}



/*
      LEVENSHTEIN DISTANCE COMPARISON
      This script posted by overlord1234 on Stack Overflow:
      https://stackoverflow.com/questions/10473745/compare-strings-javascript-return-of-likely?answertab=votes#tab-top

      Appears to be adapted from googlicius GitHub repository similarity.js:
      https://gist.github.com/googlicius/a68a05473c3c73a7fe0e7d45872f8358

*/
function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
} // end similarity()
