//======== stat-scripts.js=======

//Making: #0000  FUNCTION CALLING  
var party_totals = partyTotals(data)
var missed_votes = missedVotesArray(party_totals, data) //Note: use?
var missed_votes_pct = pctMissedVotesArray(missed_votes, party_totals, data) //Note: use?


var top_missed_votes
top_missed_votes = topMissedVotes(data)
    //Making: #000  reversing tops array
var bottom_missed_votes
bottom_missed_votes = reverseArray(top_missed_votes)
    //var bottom_missed_votes = bottomMissedVotes(data)
    //var bottom_missed_votes = reverseTopVotes(top_missed_votes)
    //var missed_votes_rank = missedVotesArray(data)
var top_missed_votes_sliced
top_missed_votes_sliced = sliceByMissed(20, top_missed_votes, data) //Before: top_missed_votes

var bottom_missed_votes_sliced //FIXME isn't getting the right output
bottom_missed_votes_sliced = sliceByMissed(20, bottom_missed_votes, data)

//withPartyVotes(party_totals, data)


//NOTE: complete statistics JSON fill
fillStatsObj(statistics, party_totals, withPartyVotes(party_totals, data), top_missed_votes_sliced);

//Making: #00001  bottom_missed_votes_sliced isn't passed
//fillStatsObj(statistics, party_totals, withPartyVotes(party_totals, data), top_missed_votes_sliced, bottom_missed_votes_sliced);

//TODO: pass function calls as variables


//Input: empty stat JSON, full 113th Senate data JASON
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

//Input: half-empty stat JSON, full 113th Senate data JASON
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
                console.log("found an Independent!"); //FEEDBACK: Indie Joke
                votes_with_party_count.withIndies_count += vwp_to_num; //not needed but still
        }



    }

    votes_with_party.withDems = (votes_with_party_count.withDems_count / totals_obj.D)
    votes_with_party.withReps = (votes_with_party_count.withReps_count / totals_obj.R)
    votes_with_party.withIndies = (votes_with_party_count.withIndies_count / totals_obj.I)


    return votes_with_party
}

//MAKING: #1 missedVotesArray(totals_obj, data_json)
//Input: statistics JSON, party_totals
function missedVotesArray(totals_obj, data_json) {
    var mv_array
    var members = data.results[0].members

    mv_array = members.map(function (member) {


        return +member.missed_votes
    })

    return mv_array
}

function pctMissedVotesArray(missed_votes_array, totals_obj, data_json) {
    var mv_pct_array = []
    var members = data.results[0].members

    for (var i = 0; i < members.length; i++) {

        var mv_pct_full = missed_votes_array[i] * 100 / members[i].total_votes
        var mv_pct = +mv_pct_full.toFixed(2)

        mv_pct_array.push(mv_pct)

    }

    return mv_pct_array
}

//MAKING: #2 sorting out objects | NOT SORTING FINE! convert string to number | OPTION: formatting entire json missed_votes propriety to string
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

function missedVotesArray(data_json) {

    var output_array = new Array;
    var top = topMissedVotes(data) //Note: have to use global, local won't work 
    var bottom = bottomMissedVotes(data)

    output_array.push(top);
    output_array.push(bottom);

    return output_array

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


//MAKING  #3 sliceByMissed() MAKE IT SORT BOTTOM
function sliceByMissed(pct, sorted_array, data_jason) {
    var members = null
    members = data_jason.results[0].members
    var sliced_by_missed = new Array
    var length = members.length * pct * 0.01
    console.log(length)
    var k = members.length * pct * 0.01
    var test_arr = new Array //TODO: #1 remove test_arr

    console.log("sorted_array INSIDE function=")
    console.log(sorted_array)
    
    
    
    

    for (var i = 0, j = 1; i < members.length; i++) {
        var cond1 = (j < length) //Note: it must be j!
        var count
        var current = sorted_array[i];
        var cond2 = (current.missed_votes == sorted_array[j].missed_votes);
        var cond3 = (i <= length) //Before i >= length
        var cond4 = (k == 0) //Making: #4444444 Before j > length
        var cond5 = (k >= 0)
        var cond6 = (k==1)//(i >= length)
        //var m = i - 1;
        //var cond7 = (sorted_array[i] == sorted_array[m])

       if (cond3 && cond5) { //Before: cond3 && cond5 | OLD: cond1 && cond3
           if(cond4){

               console.log("||||||this should end here!|||||")
               return sliced_by_missed
           } 
           
           
           sliced_by_missed.push(current); //before: members[i]
            //save last members object's missed_votes. Used to compare with the next
            
            if ( i == length){
                
                console.log("=========== i is Length ======")
            }
            
            if (cond2 && cond6) { //Before: cond2 && cond6 | OLD: cond2 && cond4
                length = length + 1;
                k++
                console.log("length grows! " + length);   
               
            }
            
            if(j == length){
                console.log("=========== J is Length ======")
            }

           console.log("i: " + i + "; j:" + j + "; k: " + k ) //+ "; m: " + m
           console.log("count: " + parseFloat(sorted_array[i].missed_votes) + "; length: " + length)
            console.log("length before j++: " + length) //FEEDBACK
            j++ 
            k-- // this is the counter to know if we reached the minimum items we are filtering for
           
        } 


        count = sorted_array[i].missed_votes

        //console.log("i: " + i + "; j:" + j + "; k: " + k + "; m: " + m)
        //console.log("count: " + parseFloat(sorted_array[i].missed_votes) + "; length: " + length)
            //FEEDBACK:  console.log("i is: " + i + " count is: " + parseFloat(members[i].missed_votes))

        test_arr.push(count)
        //m++

    }

    console.log(test_arr)
        //return sliced_by_missed
}


//MAKING #77777
function sliceBy(pct, sort_value, object_array, data_json) {




}

//sliceBy(16)

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

    //Making: #0 fill tops
    stat_json.top_most_votes_missed = top_missed_votes_sliced;
    stat_json.top_least_votes_missed = bottom_missed_votes_sliced;


    return stat_json
} //TODO: complete fillStatsObj(...)


//FEEDBACK: TESTING

console.log("statistics.votes_with_dems: " + statistics.votes_with_dems + "%")
console.log("statistics.votes_with_reps: " + statistics.votes_with_reps + "%")
console.log("statistics.votes_with_indies: " + statistics.votes_with_indies + "%")


//FEEBACK: old arrays
//console.log("missed_votes =")
//console.log(missed_votes)
//console.log("missed_votes_pct =")
//console.log(missed_votes_pct)


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


console.log("top_missed_votes_sliced =")
console.log(mapObjectArray(top_missed_votes_sliced))
console.log("bottom_missed_votes_sliced =") //FIXME: it isn't giving the right output
console.log(mapObjectArray(bottom_missed_votes_sliced))
console.log("top missed votes = ")
console.log(mapObjectArray(top_missed_votes))
console.log("bottom missed votes = ")
console.log(mapObjectArray(bottom_missed_votes))


//Note: experiment
//console.log("TOP array =")
//console.log(missed_votes_rank[0])
//console.log("BOTTOM array = ")
//console.log(missed_votes_rank[1])

//bottomMissedVotes(data)

console.log("statistics.top_most_votes_missed =")
console.log(mapObjectArray(statistics.top_most_votes_missed))
console.log("statistics.top_least_votes_missed =")
console.log(statistics.top_least_votes_missed)
