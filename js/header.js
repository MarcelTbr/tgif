
function showHeader(content) {
  $('.header').html(content);
}

function showNavbar(content) {
  $('nav.navbar').html(content);
}

var headerData = {
  "logo": {
    "url": "index.html",
    "src": "assets/images/TGIF_logo.png",
    "width": 80
  },
  "title": {
    "url": "index.html",
    "text": "Transparent Governement In Fact"
  },
  "email": {
    "url": "mailto:info@tgif.net",
    "text": "    info@tgif.net"
  }
}

function buildHeader(data){
  var emailTpl = '<a href="{{email.url}}"><span class="glyphicon glyphicon-send"></span>{{email.text}}</a>';
  var titleTpl = '<a  href="{{title.url}}"><span>{{title.text}}</span></a>';
  var logoTpl = "<a href='{{logo.url}}'><img src='{{logo.src}}' width='{{logo.width}}'></a>";
  var tpl = "<div id='logo' class='col-lg-1'>" + logoTpl + "</div>" +
            "<div id='title' class='col-lg-9 cyan'>" + titleTpl + "</div>" +
            '<div id="e-mail" class="col-lg-2">' + emailTpl + '</div>';
  return Mustache.render(tpl, data);
}

var navbarData = {
  "brand": {
    "url": "index.html",
    "text": "TGIF"
  },
  "navbar":[
    { url: "index.html", text: "Home", isDropdown: false, isStandard: true},
    { url: "#", text: "Congress 113", isDropdown: true, isStandard: false,
      dropdown: [
        { url:"senate.html", text: "Senate"},
        { url:"house_of.html", text: "House"}
      ]
    },
    { url: "#", text: "Attendance", isDropdown: true, isStandard: false,
      dropdown: [
        { url:"senate-attendance.html", text: "Senate Attendance"},
        { url:"house-attendance.html", text: "House Attendance"}
      ]
    },
    { url: "#", text: "Party Loyalty", isDropdown: true, isStandard: false,
      dropdown: [
        { url:"senate-party-loyalty.html", text: "Senate Loyalty"},
        { url:"house-party-loyalty.html", text: "House Loyalty"}
      ]
    }
  ]

}

function buildNavbar(data) {
  var brandTpl = '<a class="navbar-brand" href="{{brand.url}}">{{brand.text}}</a>'
  var navHeadTpl = '<div  class="navbar-header">' +
          '<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar">'+
            '<span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span>' +
          '</button>' + brandTpl + '</div>'

  var navItemTpl =  '<a href="{{url}}">{{text}}</a>';
  var standardLinkTpl = '{{#isStandard}}<li>' + navItemTpl + '</li>{{/isStandard}}';

  var dropdownTitleTpl = '<a class="dropdown-toggle" data-toggle="dropdown" href="{{url}}">{{text}}<span class="caret"></span></a>';
  var dropdownItemTpl = '<li><a href="{{url}}">{{text}}</a></li>';
  var dropdownUlTpl = '<ul class="dropdown-menu">{{#dropdown}}' + dropdownItemTpl + '{{/dropdown}}</ul>';
  var dropdownTpl = dropdownTitleTpl + dropdownUlTpl;
  var dropdownLinkTpl = '{{#isDropdown}}<li class="dropdown">' + dropdownTpl + '</li>{{/isDropdown}}';

  var menuTpl = '<ul class="nav navbar-nav">{{#navbar}}' + standardLinkTpl + dropdownLinkTpl + '{{/navbar}}</ul>';
  var navBodyTpl = '<div id="navbar" class="collapse navbar-collapse">' + menuTpl +
                    '</div> <!--- end #navbar -->'
  var tpl = '<div class="container-fluid">' + navHeadTpl + navBodyTpl + '</div>'
  return Mustache.render(tpl, data);
}

showHeader(buildHeader(headerData));
showNavbar(buildNavbar(navbarData));
