//controller for rating page
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
//end controller for rating page

//directive for rating page, populates stars and adds select to color functionality
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
});
//end of ratings-stars directive


canIWalk.controller('gMapController', ['$scope', 'mapFactory', function($scope, mapFactory) {

    $scope.dest = mapFactory.getDest();
    $scope.latLng = mapFactory.getLatLng();
    var userID = localStorage.getItem('ID');
    var token = localStorage.getItem('token');
    findTrip($scope.latLng, $scope.dest, userID);

}]);

canIWalk.controller('duringWalkController', ['$scope', 'mapFactory', function($scope, mapFactory) {

    $scope.dest = mapFactory.getDest();
    $scope.latLng = mapFactory.getLatLng();
    var userID = localStorage.getItem('ID');
    var token = localStorage.getItem('token');
    liveMap($scope.latLng, $scope.dest, userID);

}]);


canIWalk.controller('destinationController', ['$scope', 'mapFactory', function($scope, mapFactory) {

  //trying to stop submit on enter for dest controller
  $(".inputDest-input").keypress(function(e){
     if(e.which === 13){
        e.preventDefault();
     }
 });

  //


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

canIWalk.controller('walkDecisionController', ['$scope', '$http', function($scope, $http) {

    $scope.tripNotTaken = function(){
      var tripID = localStorage.getItem('currentTripID');
      console.log("trip not taken function activated");
      $http({
        method: 'PUT',
        url: 'https://peaceful-journey-51869.herokuapp.com/trips/'+tripID+'?trip[completion]=false'
      }).then(function successCallback(response) {
        console.log("successful denial of trip");
        window.location.replace('#/input-destination');
      }, function errorCallback(response) {
        console.log("unsuccessful denial of trip");
        console.log(response);
      });
    };

    $scope.tripTaken = function(){
      var tripID = localStorage.getItem('currentTripID');
      console.log("trip taken function activated");
      $http({
        method: 'PUT',
        url: 'https://peaceful-journey-51869.herokuapp.com/trips/'+tripID+'?trip[completion]=true'
      }).then(function successCallback(response) {
        console.log("successful acceptance of trip");
        window.location.replace('#/your_walk');
      }, function errorCallback(response) {
        console.log("unsuccessful acceptance of trip");
        console.log(response);
      });
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

     $http({
       method: 'POST',
       url: 'https://peaceful-journey-51869.herokuapp.com/authentication/login?email='+this.loginEmail+'&password='+this.loginPassword
     }).then(function successCallback(response) {
       if (response.data.token) {
         console.log("successful LOGIN");
         localStorage.setItem('token', response.data.token);
         localStorage.setItem('ID', response.data.id);
         $scope.loginEmail = '';
         $scope.loginPassword = '';
         window.location.replace('#/input-destination');
       } else if (response.data.errors[0] === "Login failed."){
         console.log(response.data.errors);
         $('.login-signIn-errorContainer').html("Email or password is incorrect.");
       } else {
         console.log("unsuccessful LOGIN");
         console.log(response.data.errors);
         $('.login-signIn-errorContainer').html("Login failed.");
       }
     }, function errorCallback(response) {
       console.log("unsuccessful LOGIN");
       console.log(response);
       $('.login-signIn-errorContainer').html("Login failed.");
     });

   } else { // if one of the login fields is empty...
     $('.login-signIn-errorContainer').html("Please enter your email address and password.");
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

        if (response.data.success === true) {
          console.log("successful POST");
          console.log(response);
          $('.login-register-signIn').html("Success! Please go check your email to confirm your account!");
          $scope.username = '';
          $scope.email = '';
          $scope.password = '';
        } else if (response.data.errors){
          console.log("unsuccessful registration");
          console.log(response.data.errors);
          $('.login-register-signIn').html("Sorry, we weren't able to register you as a new user.");
        } else {
          console.log("unsuccessful registration");
          console.log(response);
          $('.login-register-signIn').html("We were unable to register you as a new user. Please try again.");
        }



      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console.log("unsuccessful POST");
        console.log(response);
        $('.login-register-signIn').html("We were unable to register you as a new user. Please try again.");
      });
    } else { // if some registration fields are empty...
      $('.login-register-signIn').html("Please submit your name, email, and password.");
    }
  };


}]);

canIWalk.controller('passwordController', ['$scope', '$http', function($scope, $http) {
  console.log("we are in the password Controller");

  $scope.initiatePasswordChange = function(){
    console.log($scope.passwordResetEmail)
    console.log("password change function activated");
    if ($scope.passwordResetEmail){

      $http({
        method: 'GET',
        url: 'https://peaceful-journey-51869.herokuapp.com/authentication/password_reset?email='+this.passwordResetEmail
        // url: 'https://peaceful-journey-51869.herokuapp.com/authentication/password_reset?email=geoffrey.s.arnold@gmail.com'
      }).then(function successCallback(response) {

        if (response.data.id) {
          console.log("successful password reset initiation");
          console.log(response);
          // we need to do something with the token
          $('.login-passwordReset-modal-actionText').html("We've sent you an email with a link to update your password!");
          $('.login-passwordReset-email-button').toggle();
        } else if (response.data.errors[0] === "No user found with that email."){
          console.log(response.data.errors);
          $('.login-passwordReset-modal-actionText').html("We couldn't find a user with that email.");
        } else {
          console.log("unsuccessful password reset initiation");
          console.log(response.data.errors);
          $('.login-passwordReset-modal-actionText').html("Sorry, but we couldn't send you a password reset email.");
        }
      }, function errorCallback(response) {
        console.log("unsuccessful password reset initiation");
        console.log(response);
        $('.login-passwordReset-modal-actionText').html("Sorry, but we couldn't send you a password reset email.");
      });

    } else {
      alert("Please provide the email address associated with your account");
    }

  }

  $scope.updatePassword = function() {
    if ($scope.newPassword && $scope.confirmPassword) { // check if the fields have been populated
      if ($scope.newPassword === $scope.confirmPassword) { // check if the passwords input were the same
        console.log("the passwords match");

         $http({
           method: 'PUT',
           url: 'https://peaceful-journey-51869.herokuapp.com/users/1?user[password]='+$scope.newPassword
         }).then(function successCallback(response) {
           console.log("successful password update");
           window.location.replace('#/home'); // redirect the user to wherever they need to go first
         }, function errorCallback(response) {
           console.log("unsuccessful password update");
           console.log(response);
           alert("we were unable to change your password. Why don't you try again?")
         });

      } else { // if the passwords don't match
        alert("Your passwords don't match. Please insert your new password in both fields");
      }
    } else { // if some registration fields are empty...
      alert("Please fill out all fields on the page");
    }
  };

}]);
