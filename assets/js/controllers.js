//controller for rating page
canIWalk.controller('RatingController', ['$scope', '$http', function($scope, $http){
   this.rating1 = -1;
   this.rating2 = -1;
   this.rating3 = -1;
   this.rating4 = -1;
   //this initializes the ratings, but doesn't populate the star list with any. Change to 1 to have the first star populate. 0 will cause all of the stars to disappear
   var token = localStorage.getItem('token');
   var userID = localStorage.getItem('ID');
   var tripID = localStorage.getItem('currentTripID');

   this.rateFunction = function(rating) {
         console.log('Rating selected: ' + rating);
       };

   // $('.ratings-stars').on('click', function(){
   //    console.log($scope.rating.rating1); //gets rating 1 2 3 and 4 that correspond to corresponding fields.
   //    var rate = $scope.rating;
   //    if(rate.rating1 > 0 && rate.rating2 > 0 && rate.rating3 > 0 && rate.rating4 > 0){
   //       console.log('ratings made');
   //    }
   // }); this function is purely for seeing what we get on clicks, not needed for functionality
   $scope.sendRatings = function(){
      console.log('submitted');
      var rate = $scope.rating;
      var safety = rate.rating1;
      var ease = rate.rating2;
      var enjoyability = rate.rating3;
      var accessibility = rate.rating4;
      var comments = $('.ratings-comments').val();


      if(rate.rating1 > 0 && rate.rating2 > 0 && rate.rating3 > 0 && rate.rating4 > 0){

         console.log('all values accounted for');
         $http({
            method: 'POST',
            url: 'https://peaceful-journey-51869.herokuapp.com/ratings/',
            data: {
               "user_id": userID,
               "trip_id": tripID,
               "ease_rating": ease,
               "safety_rating": safety,
               "enjoyability_rating": enjoyability,
               "accessibility_rating": accessibility,
               "comment": comments,
               "token": token,
            },
         }).then(function successCallback(response){
            window.location.replace('#/input-destination');
            console.log(response);
            localStorage.setItem('currentTripID', 'null');
         }, function errorCallback(response){
            console.log(response);
            console.log('it failed :-(');
         })

      } else {
         alert('Please fill in all the categories!');
      }
   };
   $scope.noThanks = function(){
      localStorage.setItem('currentTripID', 'null');
      console.log('cleared');
   }
}]);
//end controller for rating page

//directive for rating page, populates stars and adds select to color functionality
canIWalk.directive('ratingsStars', function(){
   return {
      restrict: 'E',
      template: '<ul class="ratings-stars">' +
                  '<li ng-repeat="star in stars track by $index" class="star" ng-click="toggle($index)" ng-class="{filled: star.filled}">' +
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
            };
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

//start map controller, it finds the map.
canIWalk.controller('gMapController', ['$scope', 'mapFactory', function($scope, mapFactory) {

    $scope.dest = mapFactory.getDest();
    $scope.latLng = mapFactory.getLatLng();
    var userID = localStorage.getItem('ID');
    var token = localStorage.getItem('token');
    findTrip($scope.latLng, $scope.dest, userID, token);
}]); //end gmap controller, finds map

//during walk controller, starts the map for 'during walk in duringWalkMap.js
canIWalk.controller('duringWalkController', ['$scope', 'mapFactory', function($scope, mapFactory) {

    $scope.dest = mapFactory.getDest();
    $scope.latLng = mapFactory.getLatLng();
    var userID = localStorage.getItem('ID');
    var token = localStorage.getItem('token');
    liveMap($scope.latLng, $scope.dest, userID, token);
}]); //end during walk controller, starts the map for 'during walk in duringWalkMap.js'

//destination controller - deals with the google drop down, and passes info to the factory
canIWalk.controller('destinationController', ['$scope', '$http', 'mapFactory', function($scope, $http, mapFactory) {

  //stops submit on enter for dest controller
  $(".inputDest-input").keypress(function(e){
     if(e.which === 13){
        e.preventDefault();
     }
  });

  function placeChanged() { // when a user selects a Google Place in the destination drop down menu...
    var inputDest = document.getElementById('inputDest');
    var autocomplete = new google.maps.places.Autocomplete(inputDest);
    autocomplete.addListener('place_changed', function(){
      var place = autocomplete.getPlace();
      $scope.destLat = place.geometry.location.lat();
      $scope.destLng = place.geometry.location.lng();
      $scope.destName = place.name;
      $scope.latLng = mapFactory.setLatLng($scope.destLat, $scope.destLng);
      $scope.dest = mapFactory.setDest($scope.destName);
   })
  };
  var destInput = document.getElementById('inputDest');
  google.maps.event.addDomListener(destInput, 'click', placeChanged);

  //this section handles the suggested destinations functionality
  // fetch the user's max distance

  var usrMaxDistance = localStorage.getItem('maxDistance');
  if (usrMaxDistance === ""){
    usrMaxDistance = 1.5; // send a default user max distance if the user hasn't provided that information
  } else {
    // use the current value of usrMaxDistance
  }
  console.log(usrMaxDistance);
  var token = localStorage.getItem('token');
  var userID = localStorage.getItem('ID');

  // get the user's current location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) { //put their position into a variable 'pos'
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;

      $http({ // fetch the suggested destinations from the back end
        method: 'GET',
        url: 'https://peaceful-journey-51869.herokuapp.com/trips/destination_generator?max_distance='+usrMaxDistance+'&latitude='+lat+'&longitude='+lng+'&token='+token
      }).then(function successCallback(response) {
        console.log(response);
        console.log(response.data.suggestions);
        if (response.data.suggestions.length > 0){
          $scope.destinations = response.data.suggestions;
        } else {
          $scope.destinations = [{"destinations" : "Sorry, no destinations to suggest."}];
        }
      }, function errorCallback(response) {
        console.log(response);
        $('.inputDest-form-suggested-destinations-prompt').html("No Destinations to suggest. Search for one above!");
      });
    });

  } else { // Browser doesn't support Geolocation
    $('.inputDest-form-suggested-destinations-prompt').html("Hmm. Something went wrong. Please refresh the page.");
  }

}]);//end select destination controller

//start walk decision controller
canIWalk.controller('walkDecisionController', ['$scope', '$http', function($scope, $http) {

   var token = localStorage.getItem('token');

    $scope.tripNotTaken = function(){
      var tripID = localStorage.getItem('currentTripID');
      $http({
        method: 'PUT',
        url: 'https://peaceful-journey-51869.herokuapp.com/trips/'+tripID+'?trip[completion]=false'+'&token='+token
      }).then(function successCallback(response) {
         console.log(response);
        console.log("successful denial of trip");
        window.location.replace('#/input-destination');
        localStorage.setItem('currentTripID', null);
      }, function errorCallback(response) {
        console.log("unsuccessful denial of trip");
        console.log(response);
      });
    };

    $scope.tripTaken = function(){
      var tripID = localStorage.getItem('currentTripID');
      $http({
        method: 'PUT',
        url: 'https://peaceful-journey-51869.herokuapp.com/trips/'+tripID+'?trip[completion]=true'+'&token='+token
      }).then(function successCallback(response) {
         console.log(response);
        console.log("successful acceptance of trip");
        window.location.replace('#/your_walk');
      }, function errorCallback(response) {
        console.log("unsuccessful acceptance of trip");
        console.log(response);
      });
    };

}]);//end of trip decision controller

//start factory for lat and long
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
 });//end factory for moving lat and long around b/t partials

canIWalk.controller('POIController', ['$scope', '$http', function($scope, $http) {

 $scope.submitPOI = function() {
   if ($scope.POIname){ // if the user has submitted text in the place name field
      var userID = localStorage.getItem('ID');
      var token = localStorage.getItem('token');
      var tripID = localStorage.getItem('currentTripID');
      var placename = $scope.POIname; // this works

      navigator.geolocation.getCurrentPosition(function(position) { // get the current latlng so we know where to put the POI
        lat = position.coords.latitude;
        lng = position.coords.longitude;

        //this function plots the new POI on the duringWalk map - we aren't going to use this
        //plotNewPOI(placename, lat, lng);

        //This POST sends user-created places of interest to the back end
        $http({
          method: 'POST',
          url: 'https://peaceful-journey-51869.herokuapp.com/places/?token='+token,
          data: {
            'user_id' : userID,
            'trip_id' : tripID,
            'place_name': placename,
            'latitude' : lat,
            'longitude' : lng
          }
        }).then(function successCallback(response) {
          console.log(response);
          console.log("successful POI creation")
          $('.duringWalk-map-createPOI-fields-input').val("");
          $('.duringWalk-map-createPOI').html("New Favorite place saved! Add another?");
        }, function errorCallback(response) {
          console.log("unsuccessful POI creation");
          console.log(response);
        });
      });
    } else {
      // do nothing
    }

 };

}]);//end POI controller

canIWalk.controller('headerController', ['$scope', '$http', function($scope, $http) {

  $scope.logOut = function() {
    var userID = localStorage.getItem('ID');
    var token = localStorage.getItem('token');

    //This PUT tell the backend that the user has logged out and sets the local token to nil as well
     $http({
       method: 'DELETE',
       url: 'https://peaceful-journey-51869.herokuapp.com/authentication/logout?id='+userID+'&token='+token
     }).then(function successCallback(response) {
       console.log(response);
       console.log("successful logout")
       window.location.replace('#/login');
       localStorage.setItem('token', null);
       localStorage.setItem('ID', null);
       localStorage.setItem('accessibility_type', null);
       localStorage.setItem('maxDistance', null);
       localStorage.setItem('currentTripID', null);
     }, function errorCallback(response) {
       console.log("unsuccessful logout");
       console.log(response);
     });
  };
}]);//end header controller

//start login controller
canIWalk.controller('loginController', ['$scope', '$http', function($scope, $http) {
 console.log("we are in the login Controller");
 $scope.login = function() {
   if ($scope.loginEmail && $scope.loginPassword) { // check if the fields have been populated
     console.log("you're in the sign in function!");

     $http({
       method: 'POST',
       url: 'https://peaceful-journey-51869.herokuapp.com/authentication/login?email='+this.loginEmail+'&password='+this.loginPassword
     }).then(function successCallback(response) {
        console.log(response.data);
        if (response.data.user) {
         console.log("successful LOGIN");
         localStorage.setItem('token', response.data.user[0].session_token.token);
         localStorage.setItem('ID', response.data.user[0].id);
         localStorage.setItem('maxDistance', response.data.user[0].max_distance);
         localStorage.setItem('accessibility_type', response.data.user[0].accessibility_type);
         $scope.loginEmail = '';
         $scope.loginPassword = '';
         window.location.replace('#/input-destination');
       } else if (response.data.errors[0] === "Login failed."){
         console.log(response.data.errors);
         $('.login-signIn-errorContainer').html("Email or password is incorrect.");
       } else if (response.data.errors[0] === "Please confirm your email to login."){
         console.log(response.data.errors);
         $('.login-signIn-errorContainer').html("You haven't confirmed your account. You should receive a confirmation email shortly.");
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

}]);  //end login controller

//start of account dashboard controller
canIWalk.controller('accountDashboardController', ['$scope', '$http', function($scope, $http){

   var token = localStorage.getItem('token');
   var id = localStorage.getItem('ID');
   console.log(token);
   console.log(id);

   $http({
      method: 'GET',
      url: 'https://peaceful-journey-51869.herokuapp.com/users/dashboard?id='+id+'&token='+token,
      data: {
         'token': token,
         'user_ID':  id
      },
   }).then(function successCallback(response, data){
      console.log(response);
      $scope.completedTrips = [];
      for(var tripNum=0; tripNum < response.data.trips.length; tripNum++){
         if(response.data.trips[tripNum].completion === true){
            $scope.completedTrips.push(response.data.trips[tripNum]);
         }
      };
      console.log($scope.completedTrips);
      console.log('successful GET');
      var total = 0;
      var walkDist = [];

      for(var i = 0; i < $scope.completedTrips.length; i++){
         var tripDistance = Number($scope.completedTrips[i].distance);
         total = total + tripDistance;
         walkDist.push(tripDistance);
      };
      var totalDistance = Math.round(total);
      walkDist.sort(function(a,b){
         return a-b
      });
      var longestWalk = walkDist.pop();
      console.log(longestWalk);

      $('.dashboard-total-distance').text('Total Distance Walked: '+ totalDistance + ' miles');
      $('.dashboard-longest-walk').text('Longest Walk: '+longestWalk+' miles');
   })

   // the below code controls the accordion function
   $scope.findIndex = function($index){
      $scope.open = $index;
      };

   $scope.openRating = function($index){
      if($scope.open === $index){
         return true;
      }
   };



}])//end of account dashboard controller


// start of account dashboard directive
canIWalk.directive('accountDashboard', function(){
   return {
      restrict: 'E',
      template: '<li ng-repeat= "trip in completedTrips track by $index" ng-click="findIndex($index)">{{completedTrips[$index].walked_at | date:shortDate}} {{ completedTrips[$index].trip_name }} {{completedTrips[$index].distance}} miles'+
                   '<ul class="dashboard-ratings" ng-show="openRating($index)">'+
                      '<li>Safety: {{completedTrips[$index].ratings[0].safety_rating}} </li>'+
                      '<li>Ease: {{completedTrips[$index].ratings[0].ease_rating}}</li>' +
                      '<li>Enjoyability: {{completedTrips[$index].ratings[0].enjoyability_rating}}</li>' +
                      '<li>Comments: {{completedTrips[$index].ratings[0].comment}}</li>'+
                   '</ul>'+
                '</li>',
   }
});
// end of account dashboard directive

//start edit account controller
canIWalk.controller('editAccountController', ['$scope', '$http', function($scope, $http) {

   var token = localStorage.getItem('token');
   var id = localStorage.getItem('ID');
   console.log(token);
   console.log(id);

    $http({
      method: 'GET',
      url: 'https://peaceful-journey-51869.herokuapp.com/users/'+id+'?token='+token
    }).then(function(response){
      console.log(response);
         $(".editAccount-name").val(response.data.name);
         $(".editAccount-email").val(response.data.email);
         $(".editAccount-distance-input").val(response.data.max_distance);
         $(".editAccount-accessibility-select").val(response.data.accessibility_type);
    });


    $scope.updateUser = function (){
      var name = $('.editAccount-name').val();
      var email = $('.editAccount-email').val();
      var maxDist = $('.editAccount-distance-input').val();
      var accessibility = $('.editAccount-accessibility-select').val();
      var password = $('.editAccount-newPassword').val();
      var confPassword = $('.editAccount-confirmPassword').val();


      if (!password && !confPassword) { // if neither password field is filled out
        if (!name || !email) { // if name or email field are left blank
          alert("Please enter a name and email for your account");
        } else {

          $http({
             method: 'PUT',
             url: 'http://peaceful-journey-51869.herokuapp.com/users/'+id+'?token='+token,
             data: {
                // 'token': token,
                'name': name,
                'email': email,
                'max_distance': maxDist,
                'accessibility_type': accessibility
             }
          }).then(function(response){
            console.log("successful account update");
            console.log(response);
            localStorage.setItem('accessibility_type', accessibility);
            localStorage.setItem('maxDistance', maxDist);
            window.location.replace('#/account');
          }, function errorCallback(response) {
            console.log("unsuccessful account update");
            console.log(response);
          });

        };
      } else if (!password || !confPassword) {
        $('.editAccount-password-errorMsg').html("Please insert your new password twice if you'd like to update it");
      } else if (password !== confPassword) {
        $('.editAccount-password-errorMsg').html("Passwords do not match");
      } else if (password === confPassword) {

        $http({
           method: 'PUT',
           url: 'https://peaceful-journey-51869.herokuapp.com/users/'+id+'?token='+token,
           data: {
              'name': name,
              'email': email,
              'max_distance': maxDist,
              'accessibility_type': accessibility,
              'password' : password
           }
        }).then(function(response){
          console.log("successful account update");
           console.log(response);
           window.location.replace('#/account');
        }, function errorCallback(response) {
           console.log("unsuccessful account update");
           console.log(response);
        });

      } else {
        // do nothing
      };
    };
}]); //end edit account controller


//registration controller
canIWalk.controller('registrationController', ['$scope', '$http', function($scope, $http) {
  console.log("we are in the registration Controller");
  $scope.register = function() {
    if ($scope.username && $scope.email && $scope.password) { // check if the fields have been populated

      $http({
        method: 'POST',
        url: 'https://peaceful-journey-51869.herokuapp.com/users/?name='+this.username+'&email='+this.email+'&password='+this.password
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
}]); // end registration controller

//password controller
canIWalk.controller('passwordController', ['$scope', '$http', function($scope, $http) {
  console.log("we are in the password Controller");

  $scope.initiatePasswordChange = function(){
    console.log($scope.passwordResetEmail)
    console.log("password change function activated");
    if ($scope.passwordResetEmail){

      $http({
        method: 'GET',
        url: 'https://peaceful-journey-51869.herokuapp.com/authentication/password_reset?email='+this.passwordResetEmail
      }).then(function successCallback(response) {
        console.log(response.data.success);
        console.log(response);
        if (response.data.success === true) {
          console.log("successful password reset initiation");
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
      $('.login-passwordReset-modal-actionText').html("Please provide the email address associated with your account");
    }

  }

  $scope.updatePassword = function() {
    if ($scope.newPassword && $scope.confirmPassword) { // check if the fields have been populated
      if ($scope.newPassword === $scope.confirmPassword) { // check if the passwords input were the same
        console.log("the passwords match");

        var passwordToken = window.location.hash.split('?')[1]; // grab the token from the change password page

         $http({
           method: 'PUT',
           url: 'https://peaceful-journey-51869.herokuapp.com/authentication/password_update',
           data : {
             "password" : $scope.newPassword,
             "token" : passwordToken
           }
         }).then(function successCallback(response) {
           console.log(response);
           console.log("successful password update");
           window.location.replace('#/home'); // send user to log in after updating their password
         }, function errorCallback(response) {
           console.log("unsuccessful password update");
           console.log(response);
         });

      } else { // if the passwords don't match
        alert("Your passwords don't match. Please insert your new password in both fields");
      }
    } else { // if either password field is left blank
      alert("Please fill out all fields on the page");
    }
  };
}]);//end of password controller
