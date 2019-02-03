/* ======== stat-scripts.js======= */

$(function () {

    //var data_copy = copyDataJSON(data)


    //MAKING: Declaration of ======== getJSON()
    var data;

    function doIt(json) {
        console.log(json)
        data = json

        console.log(data.results[0].members[0])
        console.log(data.status)

        restOfCode(data) //callback
    }
    // A) get raw data
    function getJSON() {
        var url = 'https://nytimes-ubiqum.herokuapp.com/congress/113/senate'

                        // B) Apply Code if data is present otherwise show error.
        $.getJSON(url).done(doIt).fail(function () {

            console.log("Sorry! JSON file not available at the moment... We are working on it.");

        });

        // $.getJSON(url,doIt)

    }

    getJSON()


    //console.log(data.status)  >> FAIL

    function restOfCode(data) {

        var data_copy = copyDataJSON(data)

        //var statistics = getStatistics()

        function getStatistics() {

            var stat_obj = $('#statistics_object')

            return stat_obj

        }

        function copyDataMembersArray(data_json) {
            var members = data_json.results[0].members
            var output_array = members.slice()
            return output_array
        } //vanilla JS for quick reference copy

        function copyDataJSON(data_json) {

            var copy = (JSON.parse(JSON.stringify(data_json)))

            return copy
        } //new copy of the JSON data to store in a variable

        //Making: FUNCTION CALLING
        var party_totals = partyTotals(data);

        var votes_with_party_obj = withPartyVotes(party_totals, data)

        var top_missed_votes = sortBy("missed_votes", data)
            //Before: top_missed_votes = topMissedVotes(data)

        //TODO: test and choose one reverse method
        var bottom_missed_votes
        bottom_missed_votes = reverseArray(top_missed_votes)
            //var bottom_missed_votes = bottomMissedVotes(data)
            //var bottom_missed_votes = reverseTopVotes(top_missed_votes)
            //var missed_votes_rank = missedVotesArray(data)

        var top_missed_votes_sliced
        top_missed_votes_sliced = sliceByMissed(10, top_missed_votes, data) //Before: top_missed_votes

        var bottom_missed_votes_sliced //FIXME isn't getting the right output
        bottom_missed_votes_sliced = sliceByMissed(10, bottom_missed_votes, data)


        //MAking  votes_with_party_obj_array========== sortBy("votes_with_party_pct", data)

        var votes_with_party_obj_array = sortBy("votes_with_party_pct", data);

        var top_with_party_voters = sliceBy(10, "votes_with_party_pct", votes_with_party_obj_array)

        var top_without_party_voters = sliceBy(10, "votes_with_party_pct", reverseArray(votes_with_party_obj_array))

        //MAking: Declaration of ======== oneToRuleThemAll(){

        function oneToRuleThemAll(data_json, pct, property_name) {


            var data_2 = copyDataJSON(data_json)
            var output_array = []
            var votes_with_party_obj_array = sortBy(property_name, data_json) //Before: data_json
                //console.log("==========pre addNewProperty")
                //console.log(votes_with_party_obj_array)
            var vwp_obj_array_2 = addNewProperty(makeMemberPartyVotesArray(copyDataMembersArray(data_json)), "number_of_party_votes", votes_with_party_obj_array)

            //console.log("votes_with_party_obj_array")
            //console.log(votes_with_party_obj_array)
            var top_with_party_voters = sliceBy(pct, property_name, vwp_obj_array_2)
            var bottom_with_party_voters = sliceBy(pct, property_name, reverseArray(vwp_obj_array_2))

            //console.log("top_with_party_voters") //FEEDBACK
            //console.log(mapObjectArrayWithKey(top_with_party_voters, "number_of_party_votes"));

            output_array.push(top_with_party_voters);
            output_array.push(bottom_with_party_voters);

            return output_array

        }
        console.log("==========oneToRuleThemAll()!!!")
        console.log(oneToRuleThemAll(data, 10, "votes_with_party_pct"))


        //NOTE: complete statistics JSON fill
        //MAKING: Calling============  fillStatsObj() | arguments====== statistics, party_totals, votes_with_party_obj, top_missed_votes_sliced, bottom_missed_votes_sliced
        fillStatsObj(statistics, party_totals, votes_with_party_obj, top_missed_votes_sliced, bottom_missed_votes_sliced); //withPartyVotes(party_totals, data)

        //TODO: pass function calls as variables

        //Input: empty stat JSON, full 113th Senate data JSON
        //Output: fills stat JSON's totals
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

        //Input: half-empty stat JSON, full 113th Senate data JSON
        function withPartyVotes(totals_obj, data_json) { //TODO: rethink this structure. What output do we need?? We need one value for every member.

            //TODO: withPartyVotes(...) | convert memberVote%strings to numbers
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
                //Making:[x] #0 How to know how many votes a member did WITH their own party

            for (var i = 0; i < members.length; i++) {

                //BEFORE: var vwp_to_num = +members[i].votes_with_party_pct
                //TODO: find the correct line to apply .toFixed(2)
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
                        //console.log("found an Independent!"); //FEEDBACK: Indie Joke
                        votes_with_party_count.withIndies_count += vwp_to_num; //not needed but still
                }



            }

            votes_with_party.withDems = (votes_with_party_count.withDems_count / totals_obj.D)
            votes_with_party.withReps = (votes_with_party_count.withReps_count / totals_obj.R)
            votes_with_party.withIndies = (votes_with_party_count.withIndies_count / totals_obj.I)


            return votes_with_party
        }

        //MAKING: [x] #2 sorting out objects | convert string to number | OPTION: formatting entire json missed_votes propriety to string
        function topMissedVotes(data_json) {

            var members = new Array

            members = data_json.results[0].members

            var sorted_top = members.sort(function (a, b) {

                return b.missed_votes - a.missed_votes
            })

            console.log("sorted top = ")
            console.log(mapObjectArray(sorted_top))
            return sorted_top
        }

        function bottomMissedVotes(data_json) {

            var members = new Array
            members = data_json.results[0].members
                //var sort_condition = //parseInt(members[i].missed_votes)
            var sorted_bottom = members.sort(function (a, b) {

                return a.missed_votes - b.missed_votes
            });

            console.log("sorted bottom = ")
            console.log(mapObjectArray(sorted_bottom))

            return sorted_bottom

        }

        function reverseTopVotes(object_array) {
            var reversed
            reversed = object_array.reverse()

            return reversed

        }

        function reverseArray(input) {
            var ret = new Array;
            for (var i = input.length - 1; i >= 0; i--) {
                ret.push(input[i]);
            }
            return ret;
        }

        //MAKING  [x] #3 sliceByMissed() MAKE IT SORT BOTTOM
        function sliceByMissed(pct, sorted_array, data_jason) {
            var members = null
            members = data_jason.results[0].members
            var sliced_by_missed = new Array
            var length = members.length * pct * 0.01
            console.log(length)
            var k = members.length * pct * 0.01
            var test_arr = new Array //TODO: #1 remove test_arr

            //console.log("sorted_array INSIDE function=") //FEEDBACK
            //console.log(sorted_array)

            for (var i = 0, j = 1; i < members.length; i++) {
                //var cond1 = (j < length) //Note: it must be j!== Not in use ==
                var count
                var current = sorted_array[i];
                var cond2 = (current.missed_votes == sorted_array[j].missed_votes);
                var cond3 = (i <= length)
                var cond4 = (k == 0)
                var cond5 = (k >= 0)
                var cond6 = (k == 1)

                if (cond3 && cond5) {
                    if (cond4) {
                        return sliced_by_missed
                    }


                    sliced_by_missed.push(current); //before: members[i]
                    //save last members object's missed_votes. Used to compare with the next

                    if (cond2 && cond6) {
                        length = length + 1;
                        k++
                        // console.log("length grows! " + length); //FEEDBACK

                    }

                    // console.log("i: " + i + "; j:" + j + "; k: " + k ) //FEEDBACK on sliceByMixed() indexes
                    //console.log("count: " + parseFloat(sorted_array[i].missed_votes) + "; length: " + length)
                    //console.log("length before j++: " + length)
                    j++
                    k-- // this is the counter to know if we reached the minimum items we are filtering for

                }


                count = sorted_array[i].missed_votes

                //console.log("i: " + i + "; j:" + j + "; k: " + k )
                //console.log("count: " + parseFloat(sorted_array[i].missed_votes) + "; length: " + length)
                //FEEDBACK:  console.log("i is: " + i + " count is: " + parseFloat(members[i].missed_votes))

                test_arr.push(count)


            }

            console.log(test_arr)
                //return sliced_by_missed
        }

        //MAKING Declaration of ============makeMemberPartyVotesArray(obj_array)======= push by groups of same sort_value then check if array is full enough
        function makeMemberPartyVotesArray(members_array) {

          function calcMemberPartyVotes(w_party_pct, total_votes, missed_votes) {
            var w_party_votes = Math.round(w_party_pct * (total_votes - missed_votes) / 100)
            return w_party_votes
          }

          var output_array = []

          for (var i = 0; i < members_array.length; i++) {

            var w_party_pct = +members_array[i].votes_with_party_pct
            var total_votes = +members_array[i].total_votes
            var missed_votes = +members_array[i].missed_votes

            var member_p_votes = calcMemberPartyVotes(w_party_pct, total_votes, missed_votes)

            output_array.push(member_p_votes)


          }

          return output_array
        }



        //NOTE: this function converts strings to numbers!!
        function sortBy(sort_value, data_json) {

            var sorted_array = new Array
            var members = copyDataMembersArray(data_json)

            //var members = data_json.results[0].members

            /*sorted_array = members.map(function (member) {


                return parseFloat(member[sort_value])



            })*/

            sorted_array = members.sort(function (a, b) {

                return b[sort_value] - a[sort_value]
            })

            //console.log("sortBy ============ ")
            //console.log(mapObjectArrayWithKey(sorted_array, sort_value))

            return sorted_array
        }
        //console.log("======================sorted Arrays: " + sortBy("missed_votes", data))  //FEEDBACK

        function sliceBy(pct, slice_value, object_array) { //, data_json
            //var members = data_json.results[0].members

            var length = object_array.length * pct * 0.01;
            var output_array = [];
            var j = length - 1;
            var cond1 = (object_array[j][slice_value] == object_array[length][slice_value])



            for (var i = 0; i < length; i++) {
                var current = object_array[i]


                if (cond1) {

                    length++
                }
                //console.log("i: " + i + "; length: " + length) //FEEDBACK:
                //console.log("current: " + current)
                output_array.push(current)

            }

            console.log("sliceBy Output ===================")
            console.log(output_array) //Feedback
            return output_array

        }

        //sliceBy(10, "votes_with_party_pct", sortBy("votes_with_party_pct", data))//
        console.log("========================sortBy output:")
        console.log(mapObjectArrayWithKey(sortBy("votes_with_party_pct", data), "votes_with_party_pct"))

        //Making: [x]Declaration of =========== addPropertyArray()======== Parameters: value_array / property_name / object

        function addPropertyArray(value_array, property_name, object) {

            for (var i = 0; i < object.length; i++) {

                object[property_name] = value_array[i];

            }

            return object

        }

        //Making: Declaration of =============addNewProperty() ============== (input_value_array,  property_name,   output_object_array)
        function addNewProperty(input_value_array, property_name, output_object_array) {

            for (var i = 0; i < output_object_array.length; i++) {

                output_object_array[i][property_name] = input_value_array[i];
                //console.log(input_value_array[i]) //FEEDBACK
            }

            return output_object_array

        }


        //MAKING: Declaration of =========== fillStatsObj(...)
        //Input: empty statistics, calculation products
        //Output: filled statistics
        function fillStatsObj(stat_json, totals_obj, votes_with_party, top_missed_votes_sliced, bottom_missed_votes_sliced) {

            console.log(totals_obj, votes_with_party) //FEEDBACK: variables passed to fillStatsObj(...)


            //put the results into the statistics JSON

            //Note: #1 partyTotals(...) | fillStatsObj(...)
            stat_json.total_dems = totals_obj.D
            stat_json.total_reps = totals_obj.R
            stat_json.total_indies = totals_obj.I

            console.log(stat_json) //FEEDBACK: statistics after partyTotals()


            stat_json.votes_with_dems = +votes_with_party.withDems.toFixed(2)
            stat_json.votes_with_reps = +votes_with_party.withReps.toFixed(2);
            stat_json.votes_with_indies = +votes_with_party.withIndies.toFixed(2);

            stat_json.top_most_votes_missed = top_missed_votes_sliced;
            stat_json.top_least_votes_missed = bottom_missed_votes_sliced;

            var wparty_voters_array = oneToRuleThemAll(data, 10, "votes_with_party_pct")

            //stat_json.top_with_party_voters = top_with_party_voters;
            //stat_json.top_without_party_voters = top_without_party_voters;
            stat_json.top_with_party_voters = wparty_voters_array[0];
            stat_json.top_without_party_voters = wparty_voters_array[1];




            return stat_json
        } //TODO: [x]complete fillStatsObj(...)



        //Making: Declaration of ====================== JSONtoTable()
        function JSONtoTable(stat_json) {

            /*var senate_glance = document.querySelector('#senate_glance tbody')
            var bttm_attndnce = document.querySelector('#bttm_attndnce tbody');
            var top_attndnce = document.querySelector('#top_attndnce tbody');*/

            var senate_glance = document.getElementById('senate_glance')
            var house_glance = document.getElementById('house_glance')

            if (senate_glance) {
                fillSenGlance(stat_json)
                fillAttendance(stat_json)
            }

            if (house_glance) {

                window.alert("Fill the House!")
            }



        }

        JSONtoTable(statistics)


        function fillSenGlance(stat_json) {

            //var rows = table.childNodes
            var $table = $('#senate_glance tbody')
            var $cells = $('#senate_glance tbody td')


            $cells[1].innerHTML = stat_json.total_reps
            $cells[2].innerHTML = stat_json.votes_with_reps + " %";
            $cells[4].innerHTML = stat_json.total_dems
            $cells[5].innerHTML = stat_json.votes_with_dems + " %";
            $cells[7].innerHTML = stat_json.total_indies
            $cells[8].innerHTML = stat_json.votes_with_indies + " %";
            //console.log($cells) //FEEDBACK

        }


        function fillAttendance(stat_json) {

            var $table1 = $('#bttm_attndnce tbody')
            var $table2 = $('#top_attndnce tbody')
            var bottom = stat_json.top_most_votes_missed
            var top = stat_json.top_least_votes_missed
                //    bottomAtt()

            fillRanking(bottom, $table1)
            fillRanking(top, $table2)


            function fillRanking(ranking, table) {
                var length = ranking.length
                for (var i = 0; i < length; i++) {
                    //var bottom = statistics.top_most_votes_missed
                    var $newRow = $("<tr>") //.text("Row"+i)
                    var name = ranking[i].first_name + " " + ranking[i].last_name
                        //var $name = $("<td>").text(name)
                    var $name = $("<td>").text(name)
                    var votes = +ranking[i].missed_votes + " (of " + +ranking[i].total_votes + ")"
                    var $votes = $("<td>").text(votes)
                    var pct = +ranking[i].missed_votes_pct
                    var $pct = $("<td>").text(pct + " %")
                    table.append($newRow.append($name, $votes, $pct));


                }
                //console.log("fillRanking() triggered!")
            }

        }

        //FEEDBACK: TESTING

        //console.log("statistics.votes_with_dems: " + statistics.votes_with_dems + "%")
        //console.log("statistics.votes_with_reps: " + statistics.votes_with_reps + "%")
        //console.log("statistics.votes_with_indies: " + statistics.votes_with_indies + "%")

        //MAKING: [x] otputting missed_votes of object array
        function mapObjectArray(object_array) {
            var output_arr = []
            var current
            for (var i = 0; i < object_array.length; i++) {
                current = object_array[i].missed_votes;
                output_arr.push(+current)

            }
            return output_arr
        }

        function mapObjectArrayWithKey(object_array, key) {

            var output_arr = []
            var current
            for (var i = 0; i < object_array.length; i++) {
                current = object_array[i][key];
                output_arr.push(+current)

            }
            return output_arr

        }


        //FEEDBACK: ===== Feedback Functions =======

        function fillTableFeedback() {
            //console.log("top_missed_votes_sliced =")
            //console.log(mapObjectArray(top_missed_votes_sliced))
            //console.log("bottom_missed_votes_sliced =") //FIXME: [x]it isn't giving the right output
            //console.log(mapObjectArray(bottom_missed_votes_sliced))
            //console.log("top missed votes = ")
            //    //console.log(sortBy("missed_votes", data))
            //console.log(mapObjectArrayWithKey(top_missed_votes, "missed_votes"))
            //console.log("bottom missed votes = ")
            //console.log(mapObjectArray(bottom_missed_votes))
            //
            //
            //console.log("statistics.top_most_votes_missed =")
            //console.log(mapObjectArray(statistics.top_most_votes_missed))
            //console.log("statistics.top_least_votes_missed =")
            //console.log(mapObjectArray(statistics.top_least_votes_missed))
        }

        fillTableFeedback()

        //MAKing: ==============TEST and OUTPUT area ==========

        function testAndOutputFeedback() {
            console.log("==============TEST and OUTPUT area ==========")

            //NOTE: function to get an array of the number of votes in the order of the data_jason
            console.log(makeMemberPartyVotesArray(copyDataMembersArray(data)))

            console.log(top_with_party_voters)
            console.log(mapObjectArrayWithKey(top_with_party_voters, "votes_with_party_pct"))


            //console.log(addNewProperty(makeMemberPartyVotesArray(copyDataMembersArray(data)), "number_of_party_votes", data_copy.results[0].members));

        }

        testAndOutputFeedback()


    }; //end restOfCode(data)

    //restOfCode(data) >> FAIL

  });
