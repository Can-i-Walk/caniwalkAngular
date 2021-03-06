var distance;
var duration;

//find the route information
function liveMap(destLatLng, destName, userID){
  console.log(userID);
  var directionsDisplay = new google.maps.DirectionsRenderer;    //gets information from google that is an answer to the service
  var directionsService = new google.maps.DirectionsService;     //requests information from google's direction services
  var map = new google.maps.Map(document.getElementById('duringWalkMap'), { //initializes the map
  zoom: 14
  });
  directionsDisplay.setMap(map); //displays directions on the map that we've displayed already

  if (navigator.geolocation) {      //if we can get user's position
    navigator.geolocation.getCurrentPosition(function(position) { //put their position into a variable 'pos'
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      // this stuff was brought in to get the current location's place name
      var geocoder = new google.maps.Geocoder;
      // var latlng = {lat: latitude, lng: longitude};
      var originName;

      geocoder.geocode({'location': pos}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[1]){ // if there's a 'neighborhood' name...
            originName = results[1].address_components[0].long_name; // fetch the neighborhood name
          } else if (results[0]){ // if there's a street address
            originName = results[0].formatted_address; // fetch the street address
          } else if (results[3]){
            originName = results[3].formatted_address;
          } else {
            originName = "Trip Origin Unknown";
          }
        } else {
          originName = "Trip Origin Unknown";
        }
      });
      // end current location placename fetch

      directionsService.route(
        {
        origin: {lat: pos.lat, lng: pos.lng,},  // coords of origin point
        destination: destLatLng, // coords of destination point - THIS CAN ALSO BE THE PLACE NAME (formatted as a string) IF NO single LAT/LNG coord is available
        travelMode: google.maps.TravelMode.WALKING,
        },
        function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            // distance = response.routes[0].legs[0].distance.text;
            // duration = response.routes[0].legs[0].duration.text;
            // //  this is getting the distance (in miles) and the duration (in hours & minutes) of our trip and assigning those values to variables.
            // $(".walkInfo-distance").html(distance);
            // $(".walkInfo-duration").html(duration);
            // this GET will get the places of interest from other users based on the route data we send to the backend
            $.ajax({
              method: 'GET',
              url: 'https://peaceful-journey-51869.herokuapp.com/places/places_of_interest/?origin_lat='+pos.lat+'&origin_long='+pos.lng+'&dest_lat='+destLatLng.lat+'&dest_long='+destLatLng.lng,
              success: function (data) {
                console.log("successful GET");
                console.log(data);
              }, error: function (request,error) {
                console.log("unsuccessful GET");
                console.log(request);
              }
            });
          } else {
            console.log(status);
            window.alert("Sorry, but we can't find walking directions to " + destName);
          };

        });

    }, function() {
      handleLocationError(true, infoWindow, map.getCenter()); //if there is a location error
    });
  } else {
    handleLocationError(false, infoWindow, map.getCenter());
  }
};
