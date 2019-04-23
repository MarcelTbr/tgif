/* ====== loyalty-scripts ====== */


function showData(element_to_fill) {
  return function(data){
    console.log(data.results[0].members[0])
    console.log(data.status)

    var members = data.results[0].members

    function getMostLoyal(members, pct){

      var sorted_members = sortBy("votes_with_party_pct", members);

      var most_loyal = sliceBy(pct, sorted_members);

      //console.log(most_loyal);

      return most_loyal;
    }

    function getLeastLoyal(members, pct){

      var sorted_members = sortBy("votes_with_party_pct", members);

      var reversed_members = reverseArray(sorted_members);

      var least_loyal = sliceBy(pct, reversed_members);

      //console.log(least_loyal);

      return least_loyal;
    }


    //fill ...at a Glance
    graphData = processData(data, element_to_fill);
    console.info("graphData", graphData)


    var most_loyal = getMostLoyal(members, 10);
    var least_loyal = getLeastLoyal(members, 10);

    //fill loyalty Tables;
    fillTable(buildTableHtmlWithRowTemplate(most_loyal), $('#most-loyal-table'));
    fillTable(buildTableHtmlWithRowTemplate(least_loyal), $('#least-loyal-table'));
  };
}

function getJSON(param, element_to_fill) {
  var url = 'https://nytimes-ubiqum.herokuapp.com/congress/113/'+param;
  var elem = element_to_fill;
  $("#preloader").show();
                  // B) Apply Code if data is present otherwise show error.
  $.getJSON(url, showData(elem)).fail(function () {

      console.log("Sorry! JSON file not available at the moment... We are working on it.");

  }).always(function(){
    $("#preloader").hide();
  });
}

function fillTable(content, element){

  element.html(content)
}

function buildTableHtmlWithRowTemplate(people) {

    function middleName(name) {
      if(name != null){
        return " " + name + " ";
      } else {
        return " ";
      }
    }

    function calcVotesWithParty(vwp_pct, total_votes){
      vwp = +vwp_pct * +total_votes / 100;

      return Number(vwp.toFixed(1)) + " of (" + total_votes + ")";
    }
    var html = "";

    var template = $('#member-template').html();

    for (var i = 0; i < people.length; i++) {

        var person = people[i];
          //console.log("person "+i) //FEEDBACK
          //console.log(person.first_name)
        var mustacheData = {
            first: person.first_name +  middleName(person.middle_name) +  person.last_name ,
            second: calcVotesWithParty(person.votes_with_party_pct, person.total_votes),
            third: person.votes_with_party_pct + " %"
        };

        var row = Mustache.render(template, mustacheData);

        html += row;
    }

    return html;
}

/* helper functions */

//NOTE: this function converts strings to numbers!!
function sortBy(sort_value, members_array) {

    var sorted_array = new Array;
    var members = members_array.slice();

    sorted_array = members.sort(function (a, b) {

        return b[sort_value] - a[sort_value];
    })
    //console.log("====== SORTED by " + sort_value + " =====");
    //console.log(sorted_array);
    return sorted_array
}

function reverseArray(input) {
    var ret = new Array;
    for (var i = input.length - 1; i >= 0; i--) {
        ret.push(input[i]);
    }
    return ret;
}

function sliceBy(pct, members_array) {

  var length = members_array.length * pct * 0.01;
  var output_array = [];

  for (var i = 0; i < length; i++) {
    var current = members_array[i];

    output_array.push(current);
  }
  //console.log("sliceBy ============ " + slice_value);
  //console.log(output_array) //Feedback
  return output_array

}
