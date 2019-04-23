//================ moustaching.js ========

// a file just for reference of mustaching techniques

function jQueryingRows(people, table){

    people.forEach(function(person){

    var row = $('<tr>')
        .append('<td>').text(person.first_name)
        .append('<td>').text(person.number_of_party_votes) .append('<td>').text(person.votes_with_party_pct)

    table.append(row)

    })
}


//Todo: people is data.results[0].members
function renderingTableWithMoustache(people){



    var html = "";

    var template = $('#member-template').html();

    people.forEach( function(person) {

        html += Mustache.render(template, person);
    });

    return html;


}




function fillTable(content){

    //document.getElementById('most-loyal-table').innerHTML = content

    $('#most-loyal-table').html(content)
}

var members = [{

    first_name: "John Doe",
    number_of_party_votes: 666,
    votes_with_party_pct: "90"

},{

    first_name: "Jane Doe",
    number_of_party_votes: 999,
    votes_with_party_pct: "97"

}]

//var fill = renderingTableWithMoustache(members)

//fillTable(renderingTableWithMoustache(members))

function buildTableHtmlWithLoopingTemplate(people) {

    var template = $('#most-loyal-template').html();

    return Mustache.render(template, { members: people }); // inline object
}

//buildTableHtmlWithLoopingTemplate(members)

function buildTableHtmlWithRowTemplate(people) { // people is a parameter

    var html = "";

    var template = $('#member-template').html();

    for (var i = 0; i < people.length; i++) {

        var person = people[i];
          console.log("person "+i) //FEEDBACK
          console.log(person.first_name)
        var mustacheData = {
            first: person.first_name,
            second: person.number_of_party_votes,
            third: person.votes_with_party_pct
        };

        var row = Mustache.render(template, mustacheData);

        html += row;
    }

    window.alert("buildTableHtmlWithRowTemplate(members) run!!")

    return html;
}

//fillTable(buildTableHtmlWithRowTemplate(members))
