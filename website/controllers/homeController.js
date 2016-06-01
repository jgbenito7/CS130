rescueApp.controller('homeCtrl', function($scope,$http) {
        $(".report").addClass("active");

        $(".dummy").hide();
        // create a message to display in our view
        $scope.dataObj = {};
        $scope.latitude;
        $scope.longitude;

        $scope.step = 1;
        $scope.fileStep = 1;

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

            var file1 = $('#file1').get(0).files[0];
            var file2 = $('#file2').get(0).files[0];
            var file3 = $('#file3').get(0).files[0];
            var file4 = $('#file4').get(0).files[0];

            var fd = new FormData();

            if(file1){
              fd.append('file1', file1);
            }
            if(file2){
              fd.append('file2', file2);
            }
            if(file3){
              fd.append('file3', file3);
            }
            if(file4){
              fd.append('file4', file4);
            }

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

        var input1 = document.querySelectorAll( '#file1' );
        var input2 = document.querySelectorAll( '#file2' );
        var input3 = document.querySelectorAll( '#file3' );
        var input4 = document.querySelectorAll( '#file4' );
        input1[0].addEventListener( 'change', function( e ){
          var label	 = input1[0].nextElementSibling, labelVal = label.innerHTML;
          fileUploaded(label, e);
        });
        input2[0].addEventListener( 'change', function( e ){
          var label	 = input2[0].nextElementSibling, labelVal = label.innerHTML;
          fileUploaded(label, e);
        });
        input3[0].addEventListener( 'change', function( e ){
          var label	 = input3[0].nextElementSibling, labelVal = label.innerHTML;
          fileUploaded(label, e);
        });
        input4[0].addEventListener( 'change', function( e ){
          var label	 = input4[0].nextElementSibling, labelVal = label.innerHTML;
          fileUploaded(label, e);
        });

        function fileUploaded(label, e){
          var fileName = '';
          if( this.files && this.files.length > 1 )
            fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
          else
            fileName = e.target.value.split( '\\' ).pop();

          if( fileName ){
            label.querySelector( 'span' ).innerHTML = fileName;
          }
          else{
            label.innerHTML = labelVal;
          }

          //Update the file inputs
          $scope.fileStep++;
          fileStep($scope.fileStep);

          var elem = "#" + e.target.id.toString();
          $(elem).siblings(".one").addClass("button-waiting");
          $(elem).siblings(".one").addClass("done");
          $(elem).siblings(".one").removeClass("button-waiting");


          //Update the overall form
          if($scope.fileStep==2){
            $scope.step++;
            formStep($scope.step);
          }
        }

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
            one.removeClass("button-waiting");
            $(".two").addClass("button-waiting");
            $(".circle.one").html("<i class='fa fa-check' aria-hidden='true'></i>");
            $(".circle.one").addClass("done");
            $(".circle.one").css("font-size","30px");
            $(".form-input-small.two").prop('disabled', false);
          }else if(step==3){
            $(".three").addClass("button-waiting");
            two.addClass("done");
            two.removeClass("button-waiting");
            two.css("font-size","25px");
            $(".circle.two").html("<i class='fa fa-check' aria-hidden='true'></i>");
            $(".form-input-small.three").prop('disabled', false);

          }else if(step==4){
            $(".four").addClass("button-waiting");
            three.addClass("done");
            three.removeClass("button-waiting");
            three.css("font-size","25px");
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

        function fileStep(step){

          if(step==1){

          }else if(step==2){
            $(".fileupload2").show();
          }else if(step==3){
            $(".fileupload3").show();
          }else if(step==4){
            $(".fileupload4").show();
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
