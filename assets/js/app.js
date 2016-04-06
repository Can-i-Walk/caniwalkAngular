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
