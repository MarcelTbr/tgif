


function showStates(content) {
  $('#dropdown-state').html(content);
}

function buildStatesDropdown(data) {

  var tpl = '<option value="ALL" selected="selected">State</option>' +
    '{{#.}}' + '<option value="{{abbreviation}}">{{name}}</option>' + '{{/.}}'

  return Mustache.render(tpl, data);

}

showStates(buildStatesDropdown(usStates));
