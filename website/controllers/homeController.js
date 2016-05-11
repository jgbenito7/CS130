rescueApp.controller('homeCtrl', function($scope,$http) {
        $(".report").addClass("active");
        // create a message to display in our view
        $scope.dataObj = {};
        $scope.latitude;
        $scope.longitude;

        $scope.getData = function(form){

          //Change Submit Button Html
          $(".submit").html("<div class='loading'><div class='loading-gif'></div></div>");



          $scope.dataObj = angular.copy(form);
          //$(".overlay").show();

          if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(function(position){
                $scope.latitude = position.coords.latitude;
                $scope.longitude = position.coords.longitude;
                $scope.dataObj.latitude = $scope.latitude;
                $scope.dataObj.longitude = $scope.longitude;
                //$(".overlay").hide();
                var missing = formValidate();

                if(missing.length>0){
                  window.scrollTo(0,0);
                  for(var x=0; x<missing.length;x++)
                  {
                    var listElem = "<li>" + missing[x] + "</li>";
                    $('.error-list').append(listElem);
                  }
                  $('.error-wrap').show();
                  $(".submit").html("Submit");
                }
                else{

                  var file = $('#file').get(0).files[0];
                  $scope.dataObj.file = file;
                  var fd = new FormData();
                  fd.append('file', file);
                  fd.append('animal_notes',$scope.dataObj.animal_notes);
                  fd.append('animal_type',$scope.dataObj.animal_type);
                  fd.append('latitude',$scope.dataObj.latitude);
                  fd.append('longitude',$scope.dataObj.longitude);
                  $http.post('https://www.rescuehero.org/reports', fd,{
                    withCredentials: false,
                    headers: {
                      'Content-Type': undefined
                    },
                    transformRequest: angular.identity,
                    params: {
                      fd
                    },
                    responseType: "arraybuffer"
                  }).then(function successCallback(response) {
                    //console.log($scope.dataObj);
                    $("#myModal").modal('show');
                    $(".submit").html("Submit");

                  }, function errorCallback(response) {
                    $(".submit").html("Submit");
                    //alert("An error occurred...");
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                  });
                }

              });
              //alert("Location must be enabled");
              $(".submit").html("Submit");

          } else {
              $scope.message = "Geolocation is not supported by this browser.";
              $(".submit").html("Submit");
          }
        }

        var inputs = document.querySelectorAll( '.inputfile' );
        Array.prototype.forEach.call( inputs, function( input )
        {

          var label	 = input.nextElementSibling, labelVal = label.innerHTML;
          input.addEventListener( 'change', function( e )
          {
            var fileName = '';
            if( this.files && this.files.length > 1 )
            fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
            else
            fileName = e.target.value.split( '\\' ).pop();

            if( fileName ){
              label.querySelector( 'span' ).innerHTML = fileName;
            }
            else
            label.innerHTML = labelVal;
            $scope.dataObj.file_name = fileName;
          });
        });

        function formValidate(){
          var missing = [];
          if($scope.dataObj.animal_type == undefined){
            missing.push("Animal Type");
          }
          if($scope.dataObj.animal_notes == undefined){
            missing.push("Animal Notes");
          }
          if($scope.dataObj.file_name == undefined){
            missing.push("File");
          }
          if($scope.dataObj.latitude == undefined || $scope.longitude == undefined){
            missing.push("Location");
          }

          return missing;
        }

        $('#myModal').on('hidden.bs.modal', function () {
         location.reload();
        });




});

rescueApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
