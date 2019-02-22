/* stat-scripts.js */

  var graphData;


  function showData(element_to_fill) {
    return function(data){
      console.log(data.results[0].members[0])
      console.log(data.status)
      graphData = processData(data, element_to_fill) //callback

      console.info("graphData", graphData);
    };
  }
  // A) get raw data
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



  function processData(data, element_to_fill) {

    function copyDataMembersArray(data_json) {
      var members = data_json.results[0].members;
      return members.slice();
    }
    //Input: empty stat JSON, full 113th House data JSON
    //Output: fills stat JSON's totals object
    function partyTotals(data_json) {

      //array of objects

      var totals_obj = {
        D: 0,
        R: 0,
        I: 0
      }

      //loop NYT json data (watch out for senator/house linked scripts)

      var members = data_json.results[0].members

      for (var i = 0; i < members.length; i++) {
        //find party of current member
        var member_party = members[i].party
        //update by one the value of totals object matching value-name
        switch (member_party) {

          case "D":
            totals_obj.D += 1;
            //console.log("member_party is: "+member_party)
            break;
          case "R":
            totals_obj.R += 1;
            //console.log("member_party is: "+member_party)
            break;
          case "I":
            totals_obj.I += 1;
            //console.log("member_party is: "+member_party)
            break;

        }

      }

      console.log(JSON.stringify(totals_obj)) //FEEDBACK: totals_obj


      return totals_obj
    }

    //Input: half-empty stat JSON, full 113th House data JSON
    function withPartyVotes(totals_obj, data_json) {

      var votes_with_party_count = {
        withDems_count: 0,
        withReps_count: 0,
        withIndies_count: 0
      }

      var votes_with_party = {
        withDems: 0,
        withReps: 0,
        withIndies: 0
      }

      var members = data_json.results[0].members

      for (var i = 0; i < members.length; i++) {

        var vwp_pct = members[i].votes_with_party_pct
        var vwp_to_num = parseFloat(vwp_pct)

        var member_party = members[i].party
        switch (member_party) {
          case ("D"):
            votes_with_party_count.withDems_count += vwp_to_num;
            break;
          case ("R"):
            votes_with_party_count.withReps_count += vwp_to_num;
            break;
          case ("I"):
            votes_with_party_count.withIndies_count += vwp_to_num;
        }

      }
      // Find % Voted With Party for each Group
      // Applying forumla: sum of individual votes_with_party %s / total number of group members
      votes_with_party.withDems = (votes_with_party_count.withDems_count / totals_obj.D)
      votes_with_party.withReps = (votes_with_party_count.withReps_count / totals_obj.R)
      votes_with_party.withIndies = (votes_with_party_count.withIndies_count / totals_obj.I)


      return votes_with_party
    }

    //NOTE: this function converts strings to numbers!!
    function sortBy(sort_value, data_json) {

        var sorted_array = new Array;
        var members = copyDataMembersArray(data_json);

        sorted_array = members.sort(function (a, b) {

            return b[sort_value] - a[sort_value];
        })
        //console.log("====== SORTED by " + sort_value + " =====");
        //console.log(sorted_array);
        return sorted_array
    }

    function sortBySpecial(sort_value, array) {

        var sorted_array = new Array;

        sorted_array = array.sort(function (a, b) {

            return +a[sort_value] - +b[sort_value];
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

    function sliceBy(pct, slice_value, members_array) {

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

    //Input: empty statistics, calculation products
    //Output: filled statistics
    function fillStatsObj(stat_json, totals_obj, votes_with_party, top_missed_votes_sliced, bottom_missed_votes_sliced, top_with_party_voters, top_without_party_voters) {

        //put the results into the statistics Object

        stat_json.total_dems = totals_obj.D
        stat_json.total_reps = totals_obj.R
        stat_json.total_indies = totals_obj.I
        stat_json.votes_with_dems = +votes_with_party.withDems.toFixed(2)
        stat_json.votes_with_reps = +votes_with_party.withReps.toFixed(2);
        stat_json.votes_with_indies = +votes_with_party.withIndies.toFixed(2);

        stat_json.top_most_votes_missed =  top_missed_votes_sliced
        stat_json.top_least_votes_missed = sortBySpecial("missed_votes_pct", bottom_missed_votes_sliced);

        stat_json.top_with_party_voters = top_with_party_voters;
        stat_json.top_without_party_voters = top_without_party_voters;

        console.log(stat_json);
        return stat_json
    }

    function JSONtoTable(stat_json, element_string) {

      function fillAtAGlance(stat_json, string_elem_to_fill) {

        var $table = $(string_elem_to_fill + ' tbody')
        var $cells = $(string_elem_to_fill + ' tbody td')


        $cells[1].innerHTML = stat_json.total_reps
        $cells[2].innerHTML = stat_json.votes_with_reps + " %";
        $cells[4].innerHTML = stat_json.total_dems
        $cells[5].innerHTML = stat_json.votes_with_dems + " %";
        $cells[7].innerHTML = stat_json.total_indies
        $cells[8].innerHTML = stat_json.votes_with_indies + " %";


      }

      function fillAttendance(stat_json) {

        var $table1 = $('#bttm_attndnce tbody')
        var $table2 = $('#top_attndnce tbody')
        var bottom = stat_json.top_most_votes_missed
        var top = stat_json.top_least_votes_missed

        function fillRanking(ranking, table) {
          var length = ranking.length
          for (var i = 0; i < length; i++) {
            var $newRow = $("<tr>")
            var name = ranking[i].first_name + " " + ranking[i].last_name
            var $name = $("<td>").text(name)
            var votes = +ranking[i].missed_votes + " (of " + +ranking[i].total_votes + ")"
            var $votes = $("<td>").text(votes)
            var pct = +ranking[i].missed_votes_pct
            var $pct = $("<td>").text(pct + " %")
            table.append($newRow.append($name, $votes, $pct));
          }

        }

        fillRanking(bottom, $table1)
        fillRanking(top, $table2)
      }

      var element = $(element_string);

      if (element) {
        fillAtAGlance(stat_json, element_string );
        fillAttendance(stat_json)
      }

    }

    //Number of Representatives by Groups
    var party_totals = partyTotals(data);
    // % Voted With Party by Groups
    var votes_with_party_obj = withPartyVotes(party_totals, data);

    //missed_votes_pct
    var top_missed_votes = sortBy("missed_votes", data);

    var bottom_missed_votes = reverseArray(top_missed_votes);

    var top_missed_votes_sliced = sliceBy(10, "missed_votes_pct", top_missed_votes);

    var bottom_missed_votes_sliced = sliceBy(10, "missed_votes_pct", bottom_missed_votes);

    //votes_with_party_pct
    var votes_with_party_obj_array = sortBy("votes_with_party_pct", data);

    var top_with_party_voters = sliceBy(10, "votes_with_party_pct", votes_with_party_obj_array);

    var top_without_party_voters = sliceBy(10, "votes_with_party_pct", reverseArray(votes_with_party_obj_array));

    //fill statistics object with processed data
    statistics = fillStatsObj(statistics, party_totals, votes_with_party_obj, top_missed_votes_sliced, bottom_missed_votes_sliced, top_with_party_voters, top_without_party_voters);
    //fill tables with stats from statistics object
    JSONtoTable(statistics, element_to_fill);

    function makeGraphObject(stats) {

      var data = {};
      var most_engaged = [];
      var least_engaged = [];
      var source_array = stats.top_least_votes_missed;
      for(var i = 0; i < source_array.length; i++){

        var entry_most = {};
        var candidate_most = stats.top_least_votes_missed[i];
        entry_most.vwp = +candidate_most.missed_votes_pct;
        entry_most.name =  candidate_most.first_name + " " + candidate_most.last_name;
        most_engaged.push(entry_most);

        var entry_least = {};
        var candidate_least = stats.top_most_votes_missed[i];
        entry_least.vwp = +candidate_least.missed_votes_pct;
        entry_least.name =  candidate_least.first_name + " " + candidate_least.last_name;
        least_engaged.push(entry_least);

      }

      data.most_engaged = most_engaged;
      data.least_engaged = least_engaged;

        return data;
    }


    var graphObject = makeGraphObject(statistics);

    return graphObject;
  }
