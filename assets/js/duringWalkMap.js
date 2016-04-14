var distance;
var duration;
var dwMap;

//find the route information
function liveMap(destLatLng, destName, userID, token){
  console.log(userID);
  var directionsDisplay = new google.maps.DirectionsRenderer;    //gets information from google that is an answer to the service
  var directionsService = new google.maps.DirectionsService;     //requests information from google's direction services
  var dwMap = new google.maps.Map(document.getElementById('duringWalkMap'), { //initializes the map
  // zoom: 8,
  scaleControl: true
  });
  directionsDisplay.setMap(dwMap); //displays directions on the map that we've displayed already

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

            // this GET will get the places of interest from other users based on the route data we send to the backend
            $.ajax({
              method: 'GET',
              url: 'https://peaceful-journey-51869.herokuapp.com/places/places_of_interest/?origin_lat='+pos.lat+'&origin_long='+pos.lng+'&dest_lat='+destLatLng.lat+'&dest_long='+destLatLng.lng+'&token='+token,
              success: function (data) {
                console.log("successful GET");
                console.log(data);

                if (data.favorite_places.length > 0){ // if there are favorite places associated with the current route
                  for (var i=0; i < data.favorite_places.length; i++){
                    // var marker = new MarkerWithLabel({
                    var marker = new google.maps.Marker({
                      position: new google.maps.LatLng(data.favorite_places[i].latitude, data.favorite_places[i].longitude),
                      map: dwMap,
                      // icon: image,
                      // icon: 'assets/images/CIW_Logo.jpg',
                      title: data.favorite_places[i].place_name,
                      label: data.favorite_places[i].place_name
                    });
                  };
                } else {
                  // do nothing
                }

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

function plotNewPOI(POIname, lat, lng){ // this function is called when the user makes a new POI (called in the POI controller in controllers.js)
  console.log("plotnewpoi ran");
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(lat, lng),
    map: dwMap,
    title: POIname,
    label: POIname
    });
  marker.setMap(dwMap);
};
