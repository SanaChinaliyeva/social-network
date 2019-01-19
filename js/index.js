var email = "schinaliyeva@gmail.com";
var lastDate = "";
var baseUrl = "http://146.185.154.90:8000/blog/" + email + "/profile";

var convertFormToObj = function (form) {
  var data = $(form).serializeArray();
  var result = {};
  for (var row of data) {
    result[row.name] = row.value;
  }
  return result;
};

var getProfile = function (url) {
  return $.get(url);
};

var editProfile = function (userInfo) {
  $.post(baseUrl, userInfo);
};

var showProfile = function (user) {
  var name = user.firstName + " " + user.lastName;
  $("#user").html(name);
};

$("#editProfile").on("submit", function (e) {
  e.preventDefault();
  var form = this;
  var userInfo = convertFormToObj(this);
  editProfile(userInfo);
});

getProfile(baseUrl)
.then(showProfile);