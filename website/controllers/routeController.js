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
      }).when('/about-us', {
        templateUrl: 'views/about.html',
        controller: 'aboutCtrl'
      }).otherwise({
        templateUrl: 'views/home.html',
        controller: 'homeCtrl'
      });
  }]);
