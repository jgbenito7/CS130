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

rescueApp.factory('Animals', ['$resource',
  function($resource){
    return $resource('http://localhost:8080/test2', {}, {
      query: {method:'GET'}
    });
  }]);

rescueApp.controller('testCtrl', function($scope,Animals) {
        // create a message to display in our view
        $scope.message = 'Everyone come and see how good I look!';


        $scope.animals = Animals.query();
        console.log($scope.animals);
});
