var distance;
var duration;


//find the route information
function findTrip(destLatLng){
   console.log('find trip function working');
   var directionsDisplay = new google.maps.DirectionsRenderer;    //gets information from google that is an answer to the service
   var directionsService = new google.maps.DirectionsService;     //requests information from google's direction services
   var map = new google.maps.Map(document.getElementById('map'), { //initializes the map
    zoom: 14,
   //  center: {lat: 36.0, lng: -78.447}
  });
  directionsDisplay.setMap(map); //displays directions on the map that we've displayed already

  // console.log(directionsService); //these two console.logs show what we're sending and what we're receiving from google
  // console.log(directionsDisplay);

  if (navigator.geolocation) {      //if we can get user's position
    navigator.geolocation.getCurrentPosition(function(position) { //put their position into a variable 'pos'
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      directionsService.route({
        origin: {lat: pos.lat, lng: pos.lng,},  // Origin. We have this set to what the position currently is (pos.lat and pos.lng)
        destination: destLatLng, //we really are going to need lat-lng for the things we find, I can't get strings to work.

//cocoa cinn lat and long: {lat: 36.00396, lng:-78.9010705}
//southpoint mall lat and long: {lat: 35.90472, lng: -78.941595,}
        travelMode: google.maps.TravelMode.WALKING,
     }, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      //  $scope.distance = response.routes[0].legs[0].distance.text;
      //  $scope.duration = response.routes[0].legs[0].duration.text;
       //this is getting the distance (in miles) and the duration (in hours & minutes) of our trip and assigning those values to variables.
      //  console.log($scope.distance);
      //  console.log($scope.duration);
      });

      // infoWindow.setPosition(pos);
      // infoWindow.setContent('Location found.');
      // map.setCenter(pos); //center map on the position we get from geolocation
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter()); //if there is a location error
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}
//end of findTrip function

// console.log("this is the distance variable " + distance); //these console logs are to try and find the distance and duration outside of the function.
// console.log("this is the duration variable " + duration);
