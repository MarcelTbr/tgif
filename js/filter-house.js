///=============filter-house.js==================\\\

//1. GETTING THE FILTER VALUES ===================\\

//Description OLD: gets checked boxes and puts their name into an array. know which checkboxes are selected
//Input: .checked state true/false of checkbox inputs | Work: fills array with letter of checked:true checkboxes  //Output: returns array with party letters of checked:true inputs
function checkboxValues() {

    var filter_by_party = [];

    var rep_checked = document.getElementsByName('R')[0].checked;

    if (rep_checked) {
        filter_by_party.push('R');
    }

    var dem_checked = document.getElementsByName('D')[0].checked;

    if (dem_checked) {
        filter_by_party.push('D');
    }


    var indie_checked = document.getElementsByName('I')[0].checked;

    if (indie_checked) {
        filter_by_party.push('I');
    }

    if (filter_by_party.length === 0) {
        filter_by_party = ['R', 'D', 'I'];

    }

    return filter_by_party // contains the selected party letters of the filter. To later match with the classes

} // returns an array that contains the selected party letters of the filter. To later match with the classes

//Work: getting selected dropdown menu option value
function stateValue() { 

    var e = document.getElementById("dropdown-state");
    var value = e.options[e.selectedIndex].value;
    return value
}


///2. HOUSE-DATA TABLE ========================\\

var house_data = document.getElementById("house-data")   //FUTURE: table#house_data | has to be global?

makeThead()

//3. FETCHING data for the house_of.html TABLE ====================\\

var members = data.results[0].members
    //console.log(JSON.stringify(members,null,2)) //FEEDBACK: log JSON into console in object format

//Work: makes table header with column titles. returns it like 'thead'
function makeThead() {
    var thead
    thead = document.createElement("thead")
    house_data.appendChild(thead)
   
    // creating the header row
    var th_row = document.createElement("tr")
    thead.appendChild(th_row)

    var th_name = "<th>Members</th>"
    var th_party = "<th>Party</th>"
    var th_state = "<th>State</th>"
    var th_senior = "<th>Seniority</th>"
    var th_votes = "<th>Votes With Party</th>"

    th_row.innerHTML = th_name + th_party + th_state + th_senior + th_votes

    
    return thead
} //FUTURE: makeThead(table) | table#house-data #157 GLOBAL VAR

// creating tbody
var tbody = document.createElement('tbody')
house_data.appendChild(tbody)

//Inputs: table#house_data  & tbody  | Work: 1. Makes new tbbody. 2. Resets it.fills tbody with selected info from the house_data's JSON | Output: fillRow() #271
function fillTable() {

    tbody = house_data.children[1] //NOTE: super important line. Defnines the local variable for the nested functions

    var resetTable = document.getElementsByTagName("tbody")

    resetTable[0].innerHTML = " "

    //getting the selected checkboxes array and putting it into a var
    var getArray = checkboxValues() 
    console.log(getArray) //FEEDBACK: getArray() | array from checkboxValues()

    console.log("Members: " + members.length) //FEEDBACK: members.length

    //Input: table#house_data | Work: makeTbody(house_data)
    function makeRow(tbody) {
        row = document.createElement("tr")
        tbody.appendChild(row)
    }

    //creating members loop index
    var i = 0

    while (i < members.length) {

        //creating the rows
        var row //NOTE: row is declared outside the makeRow() funct. because it's going to be used later inside the while 

        makeRow(tbody)

        //FULL NAME
        var middleName = members[i].middle_name || "" // to avoid nulls
        var full_Name = members[i].first_name + " " + middleName + " " + members[i].last_name
        var url = members[i].url
        var name
        name = "<td>" + full_Name + "</td>"
        var name_url
        name_url = "<td><a  href=\"" + url + "\" >" + full_Name + "</a></td>"

        //PARTY
        var party = "<td>" + members[i].party + "</td>"
            //STATE
        var state = "<td>" + members[i].state + "</td>"
            //SENIORITY
        var senior = "<td>" + members[i].seniority + "</td>"
            //PERCENTAGE
        var votes = "<td>" + members[i].votes_with_party_pct + "%" + "</td>"

        //Work: puts all the selected variables into the CURRENT ROW of the iteration. This Function MUST BE inside the while loop, because of the iteration.
        function fillRow() {
            row.innerHTML = name_url + party + state + senior + votes
        }

        // ADDING PARTY CLASS
        var partyClass = members[i].party //get the value of property "party" in the "members\[i\]" object
        var rowClasses = row.classList //selecting the list of classes of current row
        rowClasses.add(partyClass) //appending the party property value as if it was a class

        //Input: array of active checkboxes | current "row.className"
        //Work: gets row.party and scans the checkbox array to find it
        //Output: boolean depending on if the class of the current row was or wasn't found in the checkbox array. //Dependance: later called in rowFiltering(). 
        function classFound(array) {

            //get the party of the current row. From the row's class
            var party = row.className
                //console.log("row.className = " + party) //FEEDBACK: testing row.className

            //filter the selected checkbox array
            var rowsClassFound = array.indexOf(party)

            if (rowsClassFound == -1) {
                //console.log("sorry not a single match found!") //FEEDBACK: testing classFound(array)
                return false

            } else if (rowsClassFound != -1) {
                //console.log("there was a match! nice!") //NOTE: testing classFound(array)
                return true
            }
        } //NOTE: extended Description | gets the non-matching rows out of the HTML. Depending on the array of selected checkboxes given by the function chechboxValues() called in var getArray. 


        //Inputs: index, value | Work: compare active select#dropdown-state's option[value] to the current row's state cell | Output: boolean
        function stateCompare(index, value) {

            var state_cell = members[index].state //NOTE:  members is a global variable
            var sel_opt_active = value //BEFORE: stateValue() now it's passed as a parameter
            var state_found_cond = state_cell === sel_opt_active
            var no_selection_cond = sel_opt_active === "ALL"
            //console.log("state_cell is: " + state_cell) //FEEDBACK: state_cell = members[index].state
            //console.log("sel_opt_active is: " + sel_opt_active) //FEEDBACK: sel_opt_active | stateCompare(index, value)
                //console.log("state_found_cond is: " + state_found_cond)
            if (sel_opt_active === "ALL") {
                //console.log("No State is Selected") //FEEDBACK: sel_opt_active == "ALL"
                return true
            }

            if (state_cell === sel_opt_active) {
                //console.log("stateCompare() proved true") //FEEDBACK: state_cell === sel_opt_active
                return true
            } else {
                //console.log("stateCompare() proved false") //FEEDBACK: !(state_cell === sel_opt_active)
                return false
            }

        }


        // Input: classFound(array). fillRow(). | Work: it filters out unmatched rows | Output: either fillRow() or row.remove() | Dependance: checkboxValues()
        function rowFiltering() {

            var outCondition = classFound(getArray) 

            //console.log("outCondition = " + outCondition) //FEEDBACK: outCondition | testing rowFiltering()
            
            //Work: condition to know if row's State cell is equal to the dropdown state selection
            var stateCondition = stateCompare(i, stateValue())

            if (outCondition && stateCondition) {
                //console.log("this one's making it to the show!") //FEEDBACK: outCondition == true | testing rowFiltering()
                //row gets filled
                fillRow()
                    //console.log(row) //FEEDBACK: current "row" after fillRow()| testing rowFiltering()

            } else {

                //console.log("this row didn't make it into the display array!") //FEEDBACK: testing rowFiltering()
                //removing the html of the unqualified row
                row.remove();

            }

        } //FUTURE: get rowFiltering function declaration out of the nest. Just call it with the right parameters instead.

        rowFiltering()

        //console.log(row)  //FEEDBACK: row object control checkpoint

        i = i + 1

    } // end of members object iteration, while loop

}

fillTable()


console.log("=========filter-house.js======")

console.log("end of program")
