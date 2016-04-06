var canIWalk = angular.module("canIWalk", ['ngRoute', 'ngMap']);

canIWalk.config(function($routeProvider) {
  $routeProvider
    .when('/home', {
      templateUrl: 'partials/inputDest.html'
      // controller: 'homepageController'
    })
    .when('/account', {
      templateUrl: 'partials/dashboard.html'
      // controller: 'homepageController'
    })
    .when('/edit_account', {
      templateUrl: 'partials/editAccount.html'
      // controller: 'homepageController'
    })
    .when('/walk_info', {
      templateUrl: 'partials/walkInfo.html'
      // controller: 'homepageController'
    })
    .when('/your_walk', {
      templateUrl: 'partials/duringWalk.html'
      // controller: 'homepageController'
    })
    .when('/login', {
      templateUrl: 'partials/login.html'
      // controller: 'homepageController'
    })
    .otherwise({
      redirectTo: '/home'
    });
});

gapi.load('auth2', function() {
  console.log("the google function was run")
  gapi.auth2.init();
});

function onSuccess(googleUser) {
  console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
}

function onFailure(error) {
  console.log(error);
}

function renderButton() {
  // console.log("renderButton function was run");
  gapi.signin2.render('g-signin2', {
    'scope': 'profile email',
    'width': 240,
    'height': 50,
    'longtitle': true,
    'theme': 'dark',
    'onsuccess': onSuccess,
    'onfailure': onFailure
  });
}
