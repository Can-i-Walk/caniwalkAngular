
function initMap() {
   console.log("initMap function working");
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 35.994, lng: -78.898},
    zoom: 13,

 });  //this is starting the new map. map is an object with the properties center and zoom.

  var infoWindow = new google.maps.InfoWindow({map: map});

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}
// end function initMap

   function handleLocationError(browserHasGeolocation, infoWindow, pos) {
      console.log('handleLocationError function working')
     infoWindow.setPosition(pos);
     infoWindow.setContent(browserHasGeolocation ?
                           'Error: The Geolocation service failed.' :
                           'Error: Your browser doesn\'t support geolocation.');
   };
//end function handleLocationError
var distance;
var duration;

//find the route information
function findTrip(){
   console.log('find trip function working');
   var directionsDisplay = new google.maps.DirectionsRenderer;    //gets information from google that is an answer to the service
   var directionsService = new google.maps.DirectionsService;     //requests information from google's direction services
   var map = new google.maps.Map(document.getElementById('map'), { //initializes the map
    zoom: 14,
    center: {lat: 36.0, lng: -78.447}
  });
  directionsDisplay.setMap(map); //displays directions on the map that we've displayed already

  // calculateAndDisplayRoute(directionsService, directionsDisplay); //calls the calc and display function
  // document.getElementById('mode').addEventListener('change', function() {
  //   calculateAndDisplayRoute(directionsService, directionsDisplay);
  // }); //this isn't needed by us, but it's for selecting the mode of transport that goes into the directionsService.route
  console.log(directionsService);
  console.log(directionsDisplay);
  if (navigator.geolocation) {      //if we can get user's position
    navigator.geolocation.getCurrentPosition(function(position) { //put their position into a variable 'pos'
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      directionsService.route({
        origin: {lat: pos.lat, lng: pos.lng,},  // Origin. We have this set to what the position currently is (pos.lat and pos.lng)
        destination: {lat: 35.90472, lng: -78.941595,}, //we really are going to need lat-lng for the things we find, I can't get strings to work.

//cocoa cinn lat and long: {lat: 36.00396, lng:-78.9010705}
//southpoint mall lat and long: {lat: 35.90472, lng: -78.941595,}
        travelMode: google.maps.TravelMode.WALKING,
      }, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
       var distance = response.routes[0].legs[0].distance.text;
       var duration = response.routes[0].legs[0].duration.text;
       //this is getting the distance (in miles) and the duration (in hours & minutes) of our trip and assigning those values to variables.
       console.log(distance);
       console.log(duration);
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

console.log("this is the distance variable " + distance);
console.log("this is the duration variable " + duration);
console.log(response);


function calculateAndDisplayRoute(directionsService, directionsDisplay) {
   console.log('calc and display route working');
  directionsService.route({
    origin: {lat: 36, lng: -78.9,},  // Origin. We want to set this to what the pos is (or the lat lng)
    destination: {lat: 36.00396, lng:-78.9032592},  // Ocean Beach.
    // Note that Javascript allows us to access the constant
    // using square brackets and a string value as its
    // "property."
    travelMode: google.maps.TravelMode.WALKING,
  }, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}
//end of calculateAndDisplayRoute function
