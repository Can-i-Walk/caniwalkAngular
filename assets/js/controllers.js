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

canIWalk.controller('gMapController', ['$scope', 'mapFactory', function($scope, mapFactory) {
  // NgMap.getMap().then(function(map) {
    // console.log('gMapController working');
    $scope.dest = mapFactory.getDest();
    console.log($scope.dest);
    $scope.latLng = mapFactory.getLatLng();
    console.log($scope.latLng);
    // findTrip($scope.latLng);
    findTrip($scope.latLng, $scope.dest);
    // console.log(distance);
  // });
}]);

//$scope and controller in another controller as a dependency
canIWalk.controller('destinationController', ['$scope', 'mapFactory', function($scope, mapFactory) {
  // console.log("we are in the destination Controller");
  // var destLat;

  var vm = this;
  // vm.types = "['establishment']";
  vm.placeChanged = function() {
    vm.place = this.getPlace();
    console.log(vm.place);
    $scope.destLat = vm.place.geometry.location.lat();
    $scope.destLng = vm.place.geometry.location.lng();
    $scope.destName = vm.place.name;
    //   console.log(vm.place.geometry.location.lng());
    // destLat = $scope.destLat;
    // destLng = $scope.destLng;
    // destLatLng = "{lat: "+$scope.destLat+", lng: "+$scope.destLng+"}";
    // destName = $scope.destName;
    $scope.latLng = mapFactory.setLatLng($scope.destLat, $scope.destLng);
    // console.log($scope.latLng);
    $scope.dest = mapFactory.setDest($scope.destName);
    // this is where we'll need to determine if (vm.place.geometry.access_points[0]) is true - if NOT, we need to pass the google place name to the directions function instead of lat/lng
    // if (vm.place.geometry.access_points) { // if the requested destination has a single lat/lng point we can use...
    //   console.log(vm.place.geometry.location.lat());
    //   console.log(vm.place.geometry.location.lng());
    //   $scope.destLat = vm.place.geometry.access_points[0].location.lat;
    //   $scope.destLng = vm.place.geometry.access_points[0].location.lng;
    //   $scope.destName = vm.place.name;
    //   destLat = $scope.destLat;
    //   destLng = $scope.destLng;
    //   destLatLng = "{lat: "+$scope.destLat+", lng: "+$scope.destLng+"}";
    //   destName = $scope.destName;
    //   $scope.latLng = mapFactory.setLatLng(destLat, destLng);
    //   // console.log($scope.latLng);
    //   $scope.dest = mapFactory.setDest(destName);
    // } else { // if the requested destination has more than a single associated lat/lng point (it's a bigger place)
    //   console.log("place does not have geography")
    //   console.log(vm.place.geometry.location.lat());
    //   console.log(vm.place.geometry.location.lng());
    // }
  };
}]);

canIWalk.factory('mapFactory', function() {
  return {
    currentLat : null,
    currentLng : null,
    currentDest : null,
    setLatLng : function(lat, lng) {
      this.currentLat = lat;
      this.currentLng = lng;
      // console.log(this.currentLat + " " + this.currentLng);
      return {"lat": lat, "lng": lng};
    },
    getLatLng : function() {
      // console.log(this.currentLat + " " + this.currentLng);
      return {"lat": this.currentLat, "lng": this.currentLng};
    },
    setDest : function(dest) {
      this.currentDest = dest;
      // console.log(this.currentDest);
      return this.currentDest;
    },
    getDest : function() {
      // console.log(this.currentDest);
      return this.currentDest;
    }
  }
 });

canIWalk.controller('registrationController', ['$scope', '$http', function($scope, $http) {
  console.log("we are in the registration Controller");
  $scope.register = function() {
    if ($scope.username && $scope.email && $scope.password) { // check if the fields have been populated

        // this doesn't really work
        // $scope.regInfo = {
        //   "name": $scope.username,
        //   "email": $scope.email,
        //   "password": $scope.password
        // }
        //
        // $http.post('https://peaceful-journey-51869.herokuapp.com/users', $scope.regInfo)
        // .success(function (data) {
        // // this callback will be called asynchronously
        // // when the response is available
        // console.log("successful POST");
        // console.log(response);
        // window.location.replace('#/home');
        // })
        // .error(function (data, status, headers, config) {
        // // called asynchronously if an error occurs
        // // or server returns response with an error status.
        // console.log("unsuccessful POST");
        // console.log(response);
        // return status;
        // });

      // here is a standard jquery ajax call. it works, but it throws an error.
        // $.ajax({
        //         type : 'POST',
        //         dataType : 'json',
        //         url: 'https://peaceful-journey-51869.herokuapp.com/users/?user[name]='+this.username+'&user[email]='+this.email+'&user[password]='+this.password,
        //         headers: {
        //             contentType: "application/json",
        //           },
        //         success : function(data) {
        //             console.log("posting registration data to the DB was successful");
        //             window.location.replace('#/home');
        //
        //         }, error: function(request,error){
        //             console.log("error");
        //         }
        // });
        //


      // and here is a native angular call
      $http({
        method: 'POST',
        url: 'https://peaceful-journey-51869.herokuapp.com/users/?user[name]='+this.username+'&user[email]='+this.email+'&user[password]='+this.password
      }).then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
        console.log("successful POST");
        $('.login-register-signIn').html("Success! Please go check your email to confirm your account!");
        $scope.username = '';
        $scope.email = '';
        $scope.password = '';
      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console.log("unsuccessful POST");
        console.log(response);
        alert("we were unable to register you as a new user. Why don't you try again?")
      });
    } else { // if some registration fields are empty...
      alert("One or more registration fields is empty.");
    }
  };


}]);
