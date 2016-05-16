rescueApp.controller('mapCtrl', function($scope,$http) {

  var width = $("#googleMap").width();
  $("#googleMap").height((width*.8));
  //Update map size
  $(window).resize(function(){
    width = $("#googleMap").width();
    $("#googleMap").height((width*.8));
  });

  $http.get('https://www.rescuehero.org/reports').success(function(data) {

    console.log("Request made");
    console.log(data);

    function initialize() {
      var myLatLng = new google.maps.LatLng( 34.0635, -118.4455 );
      var mapInfo = {
        center:myLatLng,
        zoom:13,
        mapTypeId:google.maps.MapTypeId.ROADMAP
      };
      var map = new google.maps.Map( document.getElementById("googleMap"), mapInfo );
      map.set('styles', getMapStyles());

      var marker;

      // set the markers
      for (var i=0; i<data.length; i++){
        var posObj = new google.maps.LatLng(parseFloat(data[i]["latitude"]),parseFloat(data[i]["longitude"]));
        var iconImage = {
          url: '/assets/img/logos/',
          size: new google.maps.Size( 512, 512 ),
          origin: new google.maps.Point( 0, 0 ),
          anchor: new google.maps.Point( 0, 32 )
        };

        switch ( data[i].status ) {
          case "Reported":
          iconImage.url += "rescuehero_logo_mini.png";
          break;
          case "Rescued":
          iconImage.url += "rescuehero_logo_radioactive_green_mini.png";
          break;
          case "OntheWay":
          iconImage.url += "rescuehero_logo_pukegold_mini.png"
          break;
          default:
          iconImage.url += "rescuehero_logo_pukegold_mini.png";
        }

        console.log(iconImage);

        marker = new google.maps.Marker({
          position: posObj,
          map: map,
          icon: iconImage,
          title: data[i].type,
          notes: data[i].notes,
          id: data[i].id,
          image: data[i].files[0]
        });

        marker.addListener('click', function() {
          // add info at the bottom
          var url = "url('https://www.rescuehero.org/images/" + this.image + "')";
          $('.animal-image').css('background-image', url);
          $('.type-content').html(this.title);
          $('.notes-content').html(this.notes);
          $('.map-panel').slideDown();
          $('html, body').animate({
            scrollTop: $(".map-panel").offset().top
          }, 1000);
          console.log(this.id);

        });
      }
    }

    initialize();
    //$scope.$apply();
  });

  $scope.exitMapPanel = function() {
    // scroll back to top and close map panel
    $('.map-panel').slideUp();
    $('html, body').animate({
      scrollTop: $("#googleMap").offset().top
    }, 1000);
  }

});
