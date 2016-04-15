//find the route information
function findTrip(destLatLng, destName, userID, token){
  console.log(userID);
  // console.log('find trip function working');
  var directionsDisplay = new google.maps.DirectionsRenderer;    //gets information from google that is an answer to the service
  var directionsService = new google.maps.DirectionsService;     //requests information from google's direction services
  var map = new google.maps.Map(document.getElementById('map'), { //initializes the map
  // zoom: 8,
  scaleControl: true,
  streetViewControl: false
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
        destination: destLatLng, // coords of destination point
        travelMode: google.maps.TravelMode.WALKING,
        },
        function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            var distance;
            var duration;
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
            localStorage.getItem('token');
            // this posts info about the trip to the Rails backend and get nearby places of interest back!
            $.ajax({
              type : 'POST',
              dataType : 'json',
              url: 'https://peaceful-journey-51869.herokuapp.com/trips',
              data: {
                "user_id": userID,
                "token": token,
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
                console.log(data);
                localStorage.setItem('currentTripID', data.trip[0].id);
                console.log("this trip's info has been sent to the database");

                //this GET will get the places of interest from other users based on the route data we send to the backend
                $.ajax({
                  method: 'GET',
                  url: 'https://peaceful-journey-51869.herokuapp.com/places/map_info/?distance='+distance+'&origin_lat='+pos.lat+'&origin_long='+pos.lng+'&dest_lat='+destLatLng.lat+'&dest_long='+destLatLng.lng+'&token='+token,
                  success: function (data) {
                    console.log("successful GET");
                    console.log(data);
                    //this bit of logic is going to populate the user reviews section:
                    var avgRate = data.average_ratings;

//average safety rating
                  if(avgRate.safety_average === null){
                       $('.walkInfo-rating-safety').text("Sorry, there's no rating available");
                  } else {
                     $('.walkInfo-rating-safety').text("Safety Rating: " + avgRate.safety_average);
                  }
//average ease rating
                 if(avgRate.ease_average === null){
                    $('.walkInfo-rating-ease').text("Sorry, there's no rating available");
                  } else {
                  $('.walkInfo-rating-ease').text("Ease Rating: " + avgRate.ease_average);
                  }
//average enjoyability rating
                  if(avgRate.enjoyability_average === null){
                    $('.walkInfo-rating-enjoyability').text("Sorry, there's no rating available");
                  } else {
                  $('.walkInfo-rating-enjoyability').text("Enjoyability Rating: " + avgRate.enjoyability_average);
                  }

//average accessibility ratings
                  if(avgRate.accessibility_average === null){
                    $('.walkInfo-rating-accessibility').text("Sorry, there's no rating available");
                  } else {
                  $('.walkInfo-rating-accessibility').text("Accessibility Rating: " + avgRate.accessibility_average);
                  }

//this is one place I can get the information about the walk. Is there another place I can do so? That's better suited to getting the reveiws and ratings?

                     console.log('test fxn');
                     console.log(data);
                     console.log(data.trip_ratings);
                     console.log(data.average_ratings.safety_average);


                    $('.walkInfo-weather-icon').attr('src', data.weather_icon);
                    $('.walkInfo-weather-icon').attr('alt', data.current_weather);
                    // console.log(data.weather_icon);
                    $('.walkInfo-weather-conditions').html(data.current_weather);
                    // console.log(data.current_weather);
                    $('.walkInfo-weather-temperature').html(data.temperature + "°F");
                    // console.log(data.temperature);
                    $('.walkInfo-weather-sunset').html("Sunset: " + data.sunset);
                    // console.log(data.sunset);

                    // var image = {
                    //   // url: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
                    //   url: 'assets/images/CIW_Logo.jpg',
                    //   // This marker is 20 pixels wide by 32 pixels high.
                    //   size: new google.maps.Size(20, 32),
                    //   // The origin for this image is (0, 0).
                    //   origin: new google.maps.Point(0, 0),
                    //   // The anchor for this image is the base of the flagpole at (0, 32).
                    //   anchor: new google.maps.Point(0, 32)
                    // };

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
                          title: title,
                          label: title,
                          map: map
                        });
                        google.maps.event.addListener(marker,'click', function() {
                          infoWindow.setContent(iwContent);
                          infoWindow.open(map, marker);
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
              }, error: function(request,error){
                console.log(request);
                console.log("error");
              }
            });
          } else {
            console.log(status);
            window.alert("Sorry, but we can't find walking directions to " + destName);
            window.location.replace('#/input-destination');
          };

      });

    }, function() {
      handleLocationError(true, infoWindow, map.getCenter()); //if there is a location error
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}
//end of findTrip function
