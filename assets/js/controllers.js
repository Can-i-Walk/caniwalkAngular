canIWalk.controller('walkController', ['$http', '$scope', function($http, $scope) {

  $scope.message = "we are talking to Angular!";
  console.log('control!');

  // $http.get('https://obscure-lowlands-76683.herokuapp.com/').success(function(data){
  //
  //   console.log("we are talking to the rails json!");
  //   console.log(data);
  //   $scope.stuff = data;
  // });

  $scope.clickMe = function (){

};

}]);

canIWalk.controller('gMapController', function(NgMap) {
  NgMap.getMap().then(function(map) {
    console.log('canIwalk Controller working')
    findTrip();
    console.log(distance);
  });
});

//$scope and controller in another controller as a dependency
canIWalk.controller('destinationController',['$scope', function($scope) {
  // console.log("we are in the destination Controller");
  
  var vm = this;
  // vm.types = "['establishment']";
  vm.placeChanged = function() {
    vm.place = this.getPlace();
    $scope.destLat = vm.place.geometry.access_points[0].location.lat;
    $scope.destLng = vm.place.geometry.access_points[0].location.lng;
    $scope.destName = vm.place.name;
    console.log("scope lat " + $scope.destLat + " scope lng " + $scope.destLng + "scope destname"+$scope.destName);
    destLat = $scope.destLat;
    destLng = $scope.destLng;
    destName = $scope.destName;
  }
}]);

canIWalk.factory('mapFactory', function(){
  var tripData = {};
  var destLat = '';
  var destLng = '';
  var destName = '';

  var distance = '';
  var duration = '';

  return tripData;

});

canIWalk.controller('registrationController', ['$scope', '$http', function($scope) {
  console.log("we are in the registration Controller");

  $scope.register = function() {
    if ($scope.username && $scope.email && $scope.password) { // check if the fields have been populated

    // here is a standard jquery ajax call
      // $.ajax({
      //         type : 'POST',
      //         dataType : 'json',
      //         url: 'http://peaceful-journey-51869.herokuapp.com/users/?user[name]='+this.username+'&user[email]='+this.email+'&user[password]='+this.password,
      //         headers: {
      //             contentType: "application/json",
      //           },
      //         success : function(data) {
      //             console.log("posting registration data to the DB was successful");
      //
      //         }, error: function(request,error){
      //             console.log("this item has already been deleted from cartEvents");
      //         }
      // });
      //


    // and here is a native angular call
    // $http({
    //   method: 'POST',
    //   url: 'http://peaceful-journey-51869.herokuapp.com/users/?user[name]='+this.username+'&user[email]='+this.email+'&user[password]='+this.password
    // }).then(function successCallback(response) {
    // // this callback will be called asynchronously
    // // when the response is available
    // console.log("successful POST");
    // console.log(response);
    // }, function errorCallback(response) {
    // // called asynchronously if an error occurs
    // // or server returns response with an error status.
    // console.log("unsuccessful POST");
    // console.log(response);
    // });

    // http://peaceful-journey-51869.herokuapp.com/users/?user[name]=mason&user[email]=mason@mail.com&user[password]=password

      console.log(this.username + this.email + this.password);
      $scope.username = '';
      $scope.email = '';
      $scope.password = '';
    } else { // if some registration fields are empty...
      alert("One or more registration fields is empty.");
    }
  };


}]);
