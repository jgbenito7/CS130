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
        templateUrl: 'views/home2.html',
        controller: 'homeCtrl'
      }).otherwise({
        templateUrl: 'views/home2.html',
        controller: 'homeCtrl'
      });
  }]);
