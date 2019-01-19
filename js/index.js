var email = "john@doe.com";
var lastDate = "";
var baseUrl = "http://146.185.154.90:8000/blog/" + email;

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
  var profileUrl = baseUrl + "/profile";
  if (userInfo.firstName && userInfo.lastName) {
    $.ajax ({
      url: profileUrl,
      method: "POST",
      data: userInfo,
      success: function () {
        $("#editModal").modal("hide");
      }
    });
  }
};

var showProfile = function (user) {
  var name = user.firstName + " " + user.lastName;
  $("#user").html(name);
  return user;
};

var getPosts = function () {
  if (lastDate) {
    var dateUrl = baseUrl + "/posts?datetime=" + lastDate; 
  } else {
    var dateUrl = baseUrl + "/posts";
  }
  return getProfile(dateUrl);
};

var getLastPost = function (posts) {
  if(posts.length) {
    var lastIndex = posts.length-1;
    return posts[lastIndex];
  }
};

var setLastDate = function (post) {
  if (post) {
    lastDate = post.datetime;
  }
};

var markupPosts = function (post) {
  var name = post.user.firstName + " " + post.user.lastName;
  var card = `<div class="card m-3">
  <div class="card-body">
  <h5 class="card-title"><span>${name}</span><span> said:</span></h5>
  <p class="card-text">${post.message}</p>
  </div>
  </div>`;
  $("#feed").prepend(card);
};

var renderPosts = function (posts) {  
  var lastPost = getLastPost(posts);
  setLastDate(lastPost);  
  for (var post of posts) {
    markupPosts(post);
  }
  return posts;
};

var sendPost = function (post) {
  var url = baseUrl + "/posts"
  $.post(url, post);
};

var clearForm = function (form) {
  var formId = form.id;
  var formInputs = "#" + formId + " input";
  $(formInputs).val("");
};

var subscribe = function (email) {
  var url = baseUrl + "/subscribe";
  $.ajax ({
    url,
    method: "POST",
    data: email,
    success: function () {
      $("#subscribeModal").modal("hide");
    }
  });
};

var updatePosts = function () {
  getPosts()
  .then(renderPosts);
};

$("#editProfile").on("submit", function (e) {
  e.preventDefault();
  var form = this;
  var userInfo = convertFormToObj(this);
  editProfile(userInfo);
  getProfile(baseUrl + "/profile")
  .then(showProfile);
  clearForm(this);
});

$("#sendPost").on("submit", function (e) {
  e.preventDefault();
  var form = this;
  var post = convertFormToObj(this);
  sendPost(post);
  updatePosts();
  clearForm(this);
});

$("#subscribeForm").on("submit", function (e) {
 e.preventDefault();
 var form = this;
 var email = convertFormToObj(this);
 if (email.email) {
   subscribe(email);
   updatePosts();
   clearForm(this);
 } else {
  alert("Enter valid email");
}
});

getProfile(baseUrl + "/profile")
.then(showProfile)
.then(getPosts)
.then(renderPosts);

setInterval(updatePosts, 5000);