// // create a marker to live track the user's location
// var myLatLng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
// var liveInfoWindow = new google.maps.InfoWindow();
var liveIWContent = "You are here";
// var littleBlueDude = {
//   url: 'assets/images/CIW_Logo_Transparent1.png',
//   scaledSize: new google.maps.Size(35, 50)
// };
// var liveMarker = new google.maps.Marker({
//   position: myLatLng,
//   icon: littleBlueDude,
//   map: dwMap,
//   zIndex:1
// });

// google.maps.event.addListener(liveMarker,'click', function() {
//   liveInfoWindow.setContent(liveIWContent);
//   liveInfoWindow.open(dwMap, liveMarker);
// });

$(document).ready(function() {
  navigator.geolocation.watchPosition(moveLiveMarker, reCenterError, {maximumAge: 1000, timeout: 300000, enableHighAccuacy: true}); // maximumAge tells the watchPosition how often to look for a new location, timeout tells the method when to quit if it can't find new location information after x amount of time
});

function reCenterError(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
}

// function moveLiveMarker(location){
//   console.log("moveLiveMarker function called");
//   myLatLng = new google.maps.LatLng(location.coords.latitude,location.coords.longitude);
//   //dwMap.setCenter(myLatLng);
//   liveMarker.setPosition(myLatLng);
//   //navigator.geolocation.clearWatch(watchId); not sure how we'd need this
// }; // end live tracking of user's location section
