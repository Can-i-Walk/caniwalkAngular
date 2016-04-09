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


canIWalk.controller('destinationController', ['$scope', 'mapFactory', function($scope, mapFactory) {
  // console.log("we are in the destination Controller");
  var vm = this;
  vm.placeChanged = function() { // when a user selects a Google Place in the destination drop down menu...
    vm.place = this.getPlace();
    console.log(vm.place);
    $scope.destLat = vm.place.geometry.location.lat();
    $scope.destLng = vm.place.geometry.location.lng();
    $scope.destName = vm.place.name;
    $scope.latLng = mapFactory.setLatLng($scope.destLat, $scope.destLng);
    $scope.dest = mapFactory.setDest($scope.destName);
  };
}]);

canIWalk.factory('mapFactory', function() { // this factory allows communication between controllers
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

 canIWalk.controller('loginController', ['$scope', '$http', function($scope, $http) {
   console.log("we are in the login Controller");
   $scope.login = function() {
     if ($scope.loginEmail && $scope.loginPassword) { // check if the fields have been populated
       console.log("you're in the sign in function!");

      // this will be the POST we'll make when a user attempts to log in
      //  $http({
      //    method: 'POST',
      //    // not sure what this url will be for login
      //    url: 'https://peaceful-journey-51869.herokuapp.com/users/?user[email]='+this.loginEmail+'&user[password]='+this.loginPassword
      //  }).then(function successCallback(response) {
      //    console.log("successful LOGIN");
      //    $scope.loginEmail = '';
      //    $scope.loginPassword = '';
      //    // here, we probably want to do a GET to fetch the login token
      //    window.location.replace('#/home'); // redirect the user to wherever they need to go first
      //  }, function errorCallback(response) {
      //    console.log("unsuccessful POST");
      //    console.log(response);
      //    alert("we were unable to sign you in. Why don't you try again?")
      //  });

     } else { // if one of the login fields is empty...
       alert("We need your email and password to log you in!");
     }
   };
 }]);


canIWalk.controller('registrationController', ['$scope', '$http', function($scope, $http) {
  console.log("we are in the registration Controller");
  $scope.register = function() {
    if ($scope.username && $scope.email && $scope.password) { // check if the fields have been populated

      $http({
        method: 'POST',
        url: 'https://peaceful-journey-51869.herokuapp.com/users/?user[name]='+this.username+'&user[email]='+this.email+'&user[password]='+this.password
      }).then(function successCallback(response) {
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
