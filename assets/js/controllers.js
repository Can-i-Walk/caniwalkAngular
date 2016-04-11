canIWalk.controller('RatingController', function(){
   this.rating1 = -1;
   this.rating2 = -1;
   this.rating3 = -1;
   this.rating4 = -1;
   //this initializes the ratings, but doesn't populate the star list with any. Change to 1 to have the first star populate. 0 will cause all of the stars to disappear
   this.rateFunction = function(rating) {
         console.log('Rating selected: ' + rating);
       };
});

canIWalk.directive('ratingsStars', function(){
   return {
      restrict: 'E',
      template: '<ul class="ratings-stars">' +
                  '<li ng-repeat="star in stars" class="star" ng-click="toggle($index)" ng-class="{filled: star.filled}">' +
                     '<i class="fa fa-star"></i>'+
                  '</li>' +
                '</ul>',
      scope: {
         ratingValue: '=ngModel',
         onRatingSelect: '&?',
      },
      link: function(scope, element, attributes) {
         scope.max = 5; //# of stars to populate ratings-stars
         function updateStars(){
            scope.stars = [];
            for(var i = 0; i < scope.max; i++) {
               scope.stars.push({
                  filled: i < scope.ratingValue,
               });
            }
         };
         scope.toggle = function(index){

               scope.ratingValue = index + 1;
               scope.onRatingSelect({
                  rating: index + 1,
               });

         };
         scope.$watch('ratingValue', function(oldValue, newValue){
            if(newValue){
               updateStars();
            }
         })

      }
   }
}); //end of ratings-stars directive






canIWalk.controller('gMapController', ['$scope', 'mapFactory', function($scope, mapFactory) {
  // NgMap.getMap().then(function(map) {
    // console.log('gMapController working');
    $scope.dest = mapFactory.getDest();
    console.log($scope.dest);
    $scope.latLng = mapFactory.getLatLng();
    console.log($scope.latLng);
    findTrip($scope.latLng);
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
    $scope.destLat = vm.place.geometry.access_points[0].location.lat;
    $scope.destLng = vm.place.geometry.access_points[0].location.lng;
    $scope.destName = vm.place.name;
    // console.log("scope lat " + $scope.destLat + " scope lng " + $scope.destLng + "scope destname"+$scope.destName);
    destLat = $scope.destLat;
    destLng = $scope.destLng;
    destLatLng = "{lat: "+$scope.destLat+", lng: "+$scope.destLng+"}";
    destName = $scope.destName;
    $scope.latLng = mapFactory.setLatLng(destLat, destLng);
    // console.log($scope.latLng);
    $scope.dest = mapFactory.setDest(destName);
    // console.log($scope.dest);
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
