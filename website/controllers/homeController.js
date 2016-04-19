var rescueApp = angular.module('rescueApp', []);

rescueApp.controller('homeCtrl', function ($scope) {
  $scope.test = [
    {'name': 'test',
     'snippet': 'yo mama so phat.'}
  ];
});
