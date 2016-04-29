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
        templateUrl: 'views/test.html',
        controller: 'testCtrl'
      });
  }]);

rescueApp.controller('testCtrl', function($scope,$http) {
        // create a message to display in our view
        $scope.message = 'Everyone come and see how good I look!';

        var dataObj = {
				      animal_type : "Seal",
				      animal_notes : "Testing, testing, 123.",
		    };
  		  $http.post('http://54.186.47.42/reports', dataObj).success(function(data) {
			       alert("Success");
		    });


      //  $scope.animals = Animals.query();
        //console.log($scope.animals);

        /*$http.get('http://54.186.47.42/reports').success(function(data) {
          $scope.animals = data;
          console.log($scope.animals);
        });*/
});
