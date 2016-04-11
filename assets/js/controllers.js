// // codepen cut and paste from : http://www.angulartutorial.net/2014/03/rating-stars-in-angular-js-using.html
// canIWalk.directive('starRating',
// function() {
// return {
// restrict : 'A',
// template : '<ul class="rating">'
//    + ' <li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">'
//    + '  <i class="fa fa-star"></i>'
//    + ' </li>'
//    + '</ul>',
// scope : {
//  ratingValue : '=',
//  max : '=',
//  onRatingSelected : '&'
// },
// link : function(scope, elem, attrs) {
//  var updateStars = function() {
//   scope.stars = [];
//   for ( var i = 0; i < scope.max; i++) {
//    scope.stars.push({
//     filled : i < scope.ratingValue
//    });
//   }
//  };
//
//  scope.toggle = function(index) {
//   scope.ratingValue = index + 1;
//   scope.onRatingSelected({
//    rating : index + 1,
//   });
//  };
//
//  scope.$watch('ratingValue',
//   function(oldVal, newVal) {
//    if (newVal) {
//     updateStars();
//    }
//   });
// }
// };
// });
// //end codepen c/p
// canIWalk.controller('RatingController', RatingController)
//
// canIWalk.directive('starRating', starRating);
//
//   function RatingController() {
//     this.rating1 = 5;
//     this.rating2 = 2;
//     this.isReadonly = true;
//     this.rateFunction = function(rating) {
//       console.log('Rating selected: ' + rating);
//     };
//   }
//
//   function starRating() {
//     return {
//       restrict: 'EA',
//       template:
//         '<ul class="ratings-stars" ng-class="{readonly: readonly}">' +
//         '  <li ng-repeat="star in stars" class="ratings-stars" ng-class="{filled: star.filled}" ng-click="toggle($index)">' +
//         '    <i class="fa fa-star"></i>' + // or &#9733
//         '  </li>' +
//         '</ul>',
//       scope: {
//         ratingValue: '=ngModel',
//         max: '=?', // optional (default is 5)
//         onRatingSelect: '&?',
//         readonly: '=?'
//       },
//       link: function(scope, element, attributes) {
//         if (scope.max == undefined) {
//           scope.max = 5;
//         }
//         function updateStars() {
//           scope.stars = [];
//           for (var i = 0; i < scope.max; i++) {
//             scope.stars.push({
//               filled: i < scope.ratingValue
//             });
//           }
//         };
//         scope.toggle = function(index) {
//           if (scope.readonly == undefined || scope.readonly === false){
//             scope.ratingValue = index + 1;
//             scope.onRatingSelect({
//               rating: index + 1
//             });
//           }
//         };
//         scope.$watch('ratingValue', function(oldValue, newValue) {
//           if (newValue) {
//             updateStars();
//           }
//         });
//       }
//     };
//   }
//
//   //more cut and pasted

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

       $http({
         method: 'POST',
         url: 'https://peaceful-journey-51869.herokuapp.com/authentication/login?email='+this.loginEmail+'&password='+this.loginPassword
       }).then(function successCallback(response) {
         console.log("successful LOGIN");
         console.log(response);
         // we need to do something with the token here - save it into a global variable, por ejemple
         $scope.loginEmail = '';
         $scope.loginPassword = '';
         window.location.replace('#/home');
       }, function errorCallback(response) {
         console.log("unsuccessful LOGIN");
         console.log(response);
         alert("we were unable to sign you in. Why don't you try again?")
       });

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
        alert("we were unable to register you as a new user. Why don't you try again?");
      });
    } else { // if some registration fields are empty...
      alert("One or more registration fields is empty.");
    }
  };


}]);

canIWalk.controller('passwordController', ['$scope', '$http', function($scope, $http) {
  console.log("we are in the password Controller");

  $scope.initiatePasswordChange = function(){
    console.log($scope.passwordResetEmail)
    console.log("password change function activated");
    if ($scope.passwordResetEmail){
      // these two jquery actions should be removed once we have the GET working (they're inside the success function as well)
      // $('.login-passwordReset-modal-actionText').html("We've sent you an email with a link to update your password!");
      // $('.login-passwordReset-email-button').toggle();

      $http({
        method: 'GET',
        url: 'https://peaceful-journey-51869.herokuapp.com/authentication/password_reset?email='+this.passwordResetEmail
        // url: 'https://peaceful-journey-51869.herokuapp.com/authentication/password_reset?email=geoffrey.s.arnold@gmail.com'
      }).then(function successCallback(response) {
        console.log("successful password reset initiation");
        console.log(response);
        // we need to do something with the token
        $('.login-passwordReset-modal-actionText').html("We've sent you an email with a link to update your password!");
        $('.login-passwordReset-email-button').toggle();
      }, function errorCallback(response) {
        console.log("unsuccessful password reset initiation");
        console.log(response);
        alert("we were unable to initiate a password reset for you. Why don't you try again?");
      });

    } else {
      alert("Please provide the email address associated with your account");
    }

  }

  $scope.updatePassword = function() {
    if ($scope.newPassword && $scope.confirmPassword) { // check if the fields have been populated
      if ($scope.newPassword === $scope.confirmPassword) { // check if the passwords input were the same
        console.log("the passwords match");

        //this PUT is currently throwing an error
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
