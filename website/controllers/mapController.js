rescueApp.controller('mapCtrl', function($scope,$http) {

  $http.get('https://www.rescuehero.org/reports').success(function(data) {
       function initialize() {
         var map = {
           center:new google.maps.LatLng(34.4707,-119.8311),
           zoom:6,
           mapTypeId:google.maps.MapTypeId.ROADMAP
         };
         var map=new google.maps.Map(document.getElementById("googleMap"),map);

         //var myLatLng = {lat: 34.4707, lng: -119.8311};
         var myLatLng = new google.maps.LatLng(34.4707,-119.8311);

         console.log(myLatLng);

         /*var marker = new google.maps.Marker({
          position: myLatLng,
          map: map,
          title: 'Hello World!'
        });*/
          var marker;
         for (var i=0; i<data.length; i++){
           var posObj = new google.maps.LatLng(parseFloat(data[i]["latitude"]),parseFloat(data[i]["longitude"]));
           console.log(posObj);
           marker = new google.maps.Marker({
             position: posObj,
             map: map,
             title: 'Hello World!'
           });
         }
       }
       google.maps.event.addDomListener(window, 'load', initialize);
       //$scope.$apply();
  });


});
