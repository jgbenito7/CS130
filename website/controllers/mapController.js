rescueApp.controller('mapCtrl', function($scope,$http) {

  $http.get('https://www.rescuehero.org/reports').success(function(data) {
    console.log(data);
    function initialize() {
      var myLatLng = new google.maps.LatLng( 34.0635, -118.4455 );
      var mapInfo = {
        center:myLatLng,
        zoom:13,
        mapTypeId:google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        zoomControl: true
      };
      var map = new google.maps.Map( document.getElementById("googleMap"), mapInfo );
      map.set('styles', getMapStyles());
      map.controls[google.maps.ControlPosition.TOP].push( document.getElementById('legend-wrapper') );
      google.maps.event.addListenerOnce(map, 'idle', function() {
          $('#legend-wrapper').show();
      });

      var youMarker;
      var youPosition;
      var youImage = {
        url: 'assets/img/stick.png',
        size: new google.maps.Size( 32, 32 ),
        origin: new google.maps.Point( 0, 0 ),
        anchor: new google.maps.Point( 16, 16 )
      };

      if ( navigator.geolocation ) {
        navigator.geolocation.getCurrentPosition(function (position) {
          youPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          map.setCenter( youPosition );
          youMarker = new google.maps.Marker({
            position: youPosition,
            map: map,
            icon: youImage,
          });
        });
      }

      var marker;

      // set the markers
      for ( var i = 0; i < data.length; i++ ) {
        var posObj = new google.maps.LatLng(parseFloat(data[i]["latitude"]),parseFloat(data[i]["longitude"]));
        var iconImage = {
          url: '/assets/img/logos/',
          size: new google.maps.Size( 32, 32 ),
          origin: new google.maps.Point( 0, 0 ),
          anchor: new google.maps.Point( 0, 32 )
        };

        switch ( data[i].status ) {
          case "Active":
          iconImage.url += "rescuehero_logo_mini.png";
          break;
          case "Rescued":
          iconImage.url += "rescuehero_logo_radioactive_green_mini.png";
          break;
          case "OnTheWay":
          iconImage.url += "rescuehero_logo_pukegold_mini.png";
          break;
          default:
          iconImage.url += "rescuehero_logo_mini.png";
        }

        marker = new google.maps.Marker({
          position: posObj,
          map: map,
          icon: iconImage,
          title: data[i].type,
          notes: data[i].notes,
          id: data[i].id,
          image: data[i].files[0],
          status: data[i].status
        });

        marker.addListener('click', function() {
          // add info at the bottom
          var url = "https://www.rescuehero.org/images/" + this.image;
          $('.animal-image').attr('src', url);
          $('.type-content').html(this.title);
          $('.notes-content').html(this.notes);
          $('.map-panel').slideDown();
          $('html, body').animate({
            scrollTop: $(".map-panel").offset().top
          }, 1000);

          $('.status-content').html( this.status );

          switch ( this.status ) {
            case "Active":
            $('.status').css('background-color', '#d73c0a');
            break;
            case "Rescued":
            $('.status').css('background-color', '#00c934');
            break;
            case "OnTheWay":
            $('.status').css('background-color', '#c0aa1a');
            break;
            default:
            $('.status').css('background-color', '#ffffff');
          }
        });
      }
    }

    initialize();
  });

  // Map and Animal Image resizing and initialization
  var mapWidth = $('#googleMap').width();
  $('#googleMap').height( (mapWidth * 0.8) );
  var animalImageWidth = $('.animal-image').width();

  $(window).resize(function(){
    mapWidth = $('#googleMap').width();
    $('#googleMap').height( (mapWidth*.8) );
  });

  // scroll back to top and close map panel
  $scope.exitMapPanel = function() {
    $('.map-panel').slideUp();
    $('html, body').animate({
      scrollTop: $("#googleMap").offset().top
    }, 1000);
  };
});
