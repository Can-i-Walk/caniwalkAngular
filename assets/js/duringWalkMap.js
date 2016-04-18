var distance;
var duration;
var dwMap;
var placeButton = $('.duringWalk-map-createPOI-fields-button');

//find the route information
function liveMap(destLatLng, destName, userID, token){
  console.log(userID);
  var directionsDisplay = new google.maps.DirectionsRenderer; //gets information from google that is an answer to the service
  var directionsService = new google.maps.DirectionsService;  //requests information from google's direction services
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

      // this stuff was brought in to get the starting location's place name
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
      // end triporigin location placename fetch

      // create a marker to live track the user's location
      var myLatLng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      var liveInfoWindow = new google.maps.InfoWindow();
      var liveIWContent = "You are here";
      var littleBlueDude = {
        url: 'assets/images/CIW_Logo_Transparent1.png',
        scaledSize: new google.maps.Size(35, 50)
      };
      var liveMarker = new google.maps.Marker({
        position: myLatLng,
        icon: littleBlueDude,
        map: dwMap,
        zIndex:1
      });

      google.maps.event.addListener(liveMarker,'click', function() {
        liveInfoWindow.setContent(liveIWContent);
        liveInfoWindow.open(dwMap, liveMarker);
      });

      $(document).ready(function() {
        navigator.geolocation.watchPosition(moveLiveMarker, reCenterError, {maximumAge: 1000, timeout: 300000, enableHighAccuacy: true}); // maximumAge tells the watchPosition how often to look for a new location, timeout tells the method when to quit if it can't find new location information after x amount of time
      });

      function reCenterError(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
      }

      function moveLiveMarker(location){
        console.log("moveLiveMarker function called");
        myLatLng = new google.maps.LatLng(location.coords.latitude,location.coords.longitude);
        //dwMap.setCenter(myLatLng);
        liveMarker.setPosition(myLatLng);
        //navigator.geolocation.clearWatch(watchId); not sure how we'd need this
      }; // end live tracking of user's location section

      // start route generator
      directionsService.route({
        origin: {lat: pos.lat, lng: pos.lng,},  // coords of origin point
        destination: destLatLng, // coords of destination point - THIS CAN ALSO BE THE PLACE NAME (formatted as a string) IF NO single LAT/LNG coord is available
        travelMode: google.maps.TravelMode.WALKING,
        },
        function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            var distance = response.routes[0].legs[0].distance.text;

            // this GET will get the places of interest from other users based on the route data we send to the backend
            $.ajax({
              method: 'GET',
              url: 'https://peaceful-journey-51869.herokuapp.com/places/places_of_interest/?origin_lat='+pos.lat+'&origin_long='+pos.lng+'&dest_lat='+destLatLng.lat+'&dest_long='+destLatLng.lng+'&token='+token+'&distance='+distance,
              success: function (data) {
                console.log("successful GET");
                console.log(data);

                // code credit for code below: http://stackoverflow.com/questions/12355249/how-to-create-infowindows-for-multiple-markers-in-a-for-loop
                var littleOrangeDude = {
                  url: 'assets/images/CIW_Logo_Transparent2.png',
                  scaledSize: new google.maps.Size(35, 50)
                };

                var infoWindow = new google.maps.InfoWindow();

                if (data.favorite_places.length > 0){ // if there are favorite places associated with the current route
                  for (var i=0; i < data.favorite_places.length; i++){
                    var markerLatlng = new google.maps.LatLng(data.favorite_places[i].latitude, data.favorite_places[i].longitude);
                    var title = data.favorite_places[i].place_name
                    var iwContent = data.favorite_places[i].place_name
                    createMarker(markerLatlng ,title,iwContent);
                  }

                  function createMarker(latlon,title,iwContent) {
                    var marker = new google.maps.Marker({
                      position: latlon,
                      icon: littleOrangeDude,
                      map: dwMap
                    });
                    google.maps.event.addListener(marker,'click', function() {
                      infoWindow.setContent(iwContent);
                      infoWindow.open(dwMap, marker);
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

// google maps domlistener to put new point on map when user creates it
// var POIInput = $('.duringWalk-map-createPOI-fields-button');
// google.maps.event.addDomListener(POIInput, 'click', plotNewPOI($scope.POIname, $scope.lat, $scope.lng));

// I need to add an event listener to these guys so they are added dynamically
// also check this out: https://developers.google.com/maps/documentation/javascript/examples/marker-remove
// function plotNewPOI(POIname, lat, lng){ // this function is called when the user makes a new POI (called in the POI controller in controllers.js)
//   console.log("plotnewpoi ran");
//   var infowindow = new google.maps.InfoWindow({
//     content: POIname
//   });
//   var newMarker = new google.maps.Marker({
//     position: new google.maps.LatLng(lat, lng),
//     map: dwMap,
//     animation: google.maps.Animation.DROP
//   }).addListener('click', function() {
//     infowindow.open(dwMap, newMarker);
//   });
// };
