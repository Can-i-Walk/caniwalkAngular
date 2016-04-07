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

canIWalk.controller('gMapController', function(NgMap) {
  NgMap.getMap().then(function(map) {
    console.log('canIwalk Controller working')
   //  console.log(map.getCenter());
   //  initMap();
   findTrip();
   //  console.log('markers', map.markers);
   //  console.log('shapes', map.shapes);
  });

});
