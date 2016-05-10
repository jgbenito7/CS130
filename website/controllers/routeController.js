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
      }).when('/map', {
        templateUrl: 'views/map.html',
        controller: 'mapCtrl'
      }).otherwise({
        templateUrl: 'views/home.html',
        controller: 'homeCtrl'
      });
  }]);
