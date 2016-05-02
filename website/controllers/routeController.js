/*Initialize the application*/
var rescueApp = angular.module('rescueApp', [
  'ngRoute',
  'ngResource',
]);

/***************************************************/
/* Angular Config
/***************************************************/
rescueApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'views/home.html',
        controller: 'homeCtrl'
      });
  }]);

rescueApp.controller('homeCtrl', function($scope,$http) {
        // create a message to display in our view
        $scope.dataObj = {};
        $scope.latitude;
        $scope.longitude;

        $scope.getData = function(form){
          $scope.dataObj = angular.copy(form);
          $scope.dataObj.latitude = $scope.latitude;
          $scope.dataObj.longitude = $scope.longitude;
          console.log($scope.dataObj);

          /*$http.post('http://54.186.47.42/reports', $scope.dataObj).success(function(data) {
               console.log("Success");
          });*/
        }

        $scope.location = function(){
              if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(function(position){
                    $scope.latitude = position.coords.latitude;
                    $scope.longitude = position.coords.longitude;
                  });
              } else {
                  $scope.message = "Geolocation is not supported by this browser.";
              }


        }


        $scope.uploadFile = function(event){
          var files = event.target.files;
          $scope.dataObj.file_name = files[0].name;
        };


});

rescueApp.directive('customOnChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeHandler = scope.$eval(attrs.customOnChange);
      element.bind('change', onChangeHandler);
    }
  };
});
