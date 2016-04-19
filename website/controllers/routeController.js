/*Initialize the application*/
var rescueApp = angular.module('rescueApp', [
  'ngRoute',
]);

rescueApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'views/test.html',
        controller: 'testCtrl'
      });
  }]);

rescueApp.controller('testCtrl', function($scope) {
        // create a message to display in our view
        $scope.message = 'Everyone come and see how good I look!';
});
