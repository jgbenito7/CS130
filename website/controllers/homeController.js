rescueApp.controller('homeCtrl', function($scope,$http) {
        $(".report").addClass("active");

        $(".dummy").hide();
        // create a message to display in our view
        $scope.dataObj = {};
        $scope.latitude;
        $scope.longitude;

        $scope.step = 1;

        //Initialize
        formStep($scope.step);

        $scope.getLocation = function(){
          if($scope.step==4)
          {
            if (navigator.geolocation) {
                $(".location").html("<div class='loading'><div class='loading-gif'></div></div>");
                navigator.geolocation.getCurrentPosition(function(position){
                  $scope.latitude = position.coords.latitude;
                  $scope.longitude = position.coords.longitude;
                  $scope.dataObj.latitude = $scope.latitude;
                  $scope.dataObj.longitude = $scope.longitude;
                  $(".location").html("Location Found!");
                  $scope.step++;
                  formStep($scope.step);
                });
            } else {
                $scope.message = "Geolocation is not supported by this browser.";
            }
          }
        }


        $scope.getData = function(form){
          if($scope.step==5)
          {
            //Change Submit Button Html
            $(".submit").html("<div class='loading'><div class='loading-gif'></div></div>");
            $scope.dataObj = angular.copy(form);

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
              $scope.step++;
              formStep($scope.step);

            }, function errorCallback(response) {
              $(".submit").html("Report Submitted!");
            });
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
            $scope.step++;
            formStep($scope.step);
          });
        });

        /*function formValidate(){
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
        }*/

        $('#myModal').on('hidden.bs.modal', function () {
         location.reload();
        });

        function formStep(step){
          var one = $(".one");
          var two = $(".two");
          var three = $(".three");
          var four = $(".four");
          var five = $(".five");
          if(step==1){
            one.addClass("button-waiting");

          }else if(step==2){
            $(".two").addClass("button-waiting");

            one.addClass("done");
            one.removeClass("button-waiting");
            one.css("font-size","30px");
            $(".circle.one").html("<i class='fa fa-check' aria-hidden='true'></i>");

            $(".form-input-small.two").prop('disabled', false);

          }else if(step==3){
            $(".three").addClass("button-waiting");
            two.addClass("done");
            two.removeClass("button-waiting");
            two.css("font-size","30px");
            $(".circle.two").html("<i class='fa fa-check' aria-hidden='true'></i>");
            $(".form-input-small.three").prop('disabled', false);

          }else if(step==4){
            $(".four").addClass("button-waiting");
            three.addClass("done");
            three.removeClass("button-waiting");
            three.css("font-size","30px");
            $(".circle.three").html("<i class='fa fa-check' aria-hidden='true'></i>");
          }else if(step==5){
            $(".five").addClass("button-waiting");
            four.addClass("done");
            four.removeClass("button-waiting");
            four.css("font-size","30px");
            $(".circle.four").html("<i class='fa fa-check' aria-hidden='true'></i>");
          }else if(step==6){
            five.addClass("done");
            five.removeClass("button-waiting");
            five.css("font-size","30px");
            $(".circle.five").html("<i class='fa fa-check' aria-hidden='true'></i>");
          }
        }


        $scope.input_one = function(){
          if($scope.dataObj.animal_type != ""){
            $scope.step = 3;
            formStep($scope.step);
          }else{

          }
        };

        $scope.input_two = function(){
          if($scope.dataObj.animal_notes != ""){
            $scope.step = 4;
            formStep($scope.step);
          }else{

          }
        };

        $scope.reset = function(){
          location.reload();
        }
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
