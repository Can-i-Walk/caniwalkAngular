canIWalk.controller('walkController', ['$http', '$scope', function($http, $scope) {

  $scope.message = "we are talking to Angular!";
  console.log('control!');

  $http.get('https://obscure-lowlands-76683.herokuapp.com/').success(function(data){

    console.log("we are talking to the rails json!");
    console.log(data);
    $scope.stuff = data;
  });

  $scope.clickMe = function (){

};

}]);

canIWalk.controller('loginModalController', ['$scope', function($scope) {

  $scope.showLoginModal = function(){
    console.log("modal function was called");
  };




}])
