rescueApp.controller('mapCtrl', function($scope,$http) {

  $http.get('https://www.rescuehero.org/reports').success(function(data) {

    console.log("Request made");
    function initialize() {
      var map = {
        center:new google.maps.LatLng(34.4707,-119.8311),
        zoom:6,
        mapTypeId:google.maps.MapTypeId.ROADMAP
      };
      var map=new google.maps.Map(document.getElementById("googleMap"),map);

      map.set('styles', getMapStyles());

      //var myLatLng = {lat: 34.4707, lng: -119.8311};
      var myLatLng = new google.maps.LatLng(34.4707,-119.8311);

      var marker;
      for (var i=0; i<data.length; i++){
        var posObj = new google.maps.LatLng(parseFloat(data[i]["latitude"]),parseFloat(data[i]["longitude"]));
        //console.log(posObj);
        marker = new google.maps.Marker({
          position: posObj,
          map: map,
          title: 'Hello World!'
        });
      }
    }
    initialize();
    //$scope.$apply();
  });

  google.maps.event.addListener(marker, 'dblclick', function(event){
      map = marker.getMap();

      map.setCenter(overlay.getPosition()); // set map center to marker position
      smoothZoom(map, 12, map.getZoom()); // call smoothZoom, parameters map, final zoomLevel, and starting zoom level
  })


  // the smooth zoom function
  function smoothZoom (map, max, cnt) {
      if (cnt >= max) {
              return;
          }
      else {
          z = google.maps.event.addListener(map, 'zoom_changed', function(event){
              google.maps.event.removeListener(z);
              smoothZoom(map, max, cnt + 1);
          });
          setTimeout(function(){map.setZoom(cnt)}, 80); // 80ms is what I found to work well on my system -- it might not work well on all systems
      }
  }  
});
