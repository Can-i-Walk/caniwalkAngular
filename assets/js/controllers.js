canIWalk.controller('walkController', ['$http', '$scope', function($http, $scope) {

  $scope.message = "we are talking to Angular!";
  console.log('control!');

  $http.get('https://obscure-lowlands-76683.herokuapp.com/').success(function(data){
    console.log("we are talking to the rails json!");
    $scope.stuff = data;
  });


}]);
