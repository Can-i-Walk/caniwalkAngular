var distance;
var duration;

//find the route information
function findTrip(destLatLng, destName){
  console.log('find trip function working');
  var directionsDisplay = new google.maps.DirectionsRenderer;    //gets information from google that is an answer to the service
  var directionsService = new google.maps.DirectionsService;     //requests information from google's direction services
  var map = new google.maps.Map(document.getElementById('map'), { //initializes the map
  zoom: 14
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

      // this stuff was brought in to get the current location's place name
      var geocoder = new google.maps.Geocoder;
      // var latlng = {lat: latitude, lng: longitude};
      var originName;

      geocoder.geocode({'location': pos}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          console.log(results);
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
          console.log("geocoder is not OK!");
        }
        console.log(originName);

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
            distance = response.routes[0].legs[0].distance.text;
            duration = response.routes[0].legs[0].duration.text;
            //  this is getting the distance (in miles) and the duration (in hours & minutes) of our trip and assigning those values to variables.
            console.log(response);
            $(".walkInfo-distance").html(distance);
            $(".walkInfo-duration").html(duration);

            // ajax call with test data - shit works!
            // $.ajax({
            //   type : 'POST',
            //   dataType : 'json',
            //   url: 'https://peaceful-journey-51869.herokuapp.com/trips',
            //   data: {
            //     "user_id": 1,
            //     "trip_name": "DBAP",
            //     "distance": .4,
            //     "origin_name": "The Parlour",
            //     "origin_lat": 35.996571,
            //     "origin_long": -78.902358,
            //     "dest_name": "DBAP",
            //     "dest_lat": 35.991785,
            //     "dest_long": -78.905056
            //   },
            //   headers: {
            //      contentType: "application/json",
            //    },
            //   success : function(data) {
            //
            //     console.log("this trip's info has been sent to the database");
            //     //this GET will get the places of interest from other users based on the route data we send to the backend
            //     $.ajax({
            //       method: 'GET',
            //       url: 'https://peaceful-journey-51869.herokuapp.com/places/nearby_favorite_places/?distance=.4&origin_lat=35.996571&origin_long=-78.902358&dest_lat=35.991785&dest_long=-78.905056',
            //       success: function (data) {
            //       console.log("successful GET");
            //       console.log(data);
            //       }, error: function (request,error) {
            //       console.log("unsuccessful GET");
            //       console.log(request);
            //       }
            //     });
            //
            //
            //   }, error: function(request,error){
            //     console.log(request);
            //     console.log("error");
            //   }
            // });

            // this posts info about the trip to the Rails backend and get nearby places of interest back!
            $.ajax({
              type : 'POST',
              dataType : 'json',
              url: 'https://peaceful-journey-51869.herokuapp.com/trips',
              data: {
                "user_id": 1,
                "trip_name": destName,
                "distance": distance,
                "origin_name": originName,
                "origin_lat": pos.lat,
                "origin_long": pos.lng,
                "dest_name": destName,
                "dest_lat": destLatLng.lat,
                "dest_long": destLatLng.lng
              },
              headers: {
                 contentType: "application/json",
              },
              success : function(data) {

                console.log("this trip's info has been sent to the database");
                //this GET will get the places of interest from other users based on the route data we send to the backend
                $.ajax({
                  method: 'GET',
                  url: 'https://peaceful-journey-51869.herokuapp.com/places/nearby_favorite_places/?distance='+distance+'&origin_lat='+pos.lat+'&origin_long='+pos.lng+'&dest_lat='+destLatLng.lat+'&dest_long='+destLatLng.lng,
                  success: function (data) {
                    console.log("successful GET");
                    console.log(data);
                  }, error: function (request,error) {
                    console.log("unsuccessful GET");
                    console.log(request);
                  }
                });
              }, error: function(request,error){
                console.log(request);
                console.log("error");
              }
            });
          } else {
            console.log(status);
            window.alert("Sorry, but we can't find walking directions to " + destName);
          };

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
