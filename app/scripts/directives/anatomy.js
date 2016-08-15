'use strict';

angular.module('anatomyApp')
	.factory('humanAPI', function ($window) {
    return $window.HumanAPI ? $window.HumanAPI : {};
  })
  .filter('trust', function ($sce) {
    return function (input) {
      return $sce.trustAsResourceUrl(input);
    };
  })
	.controller('anatomyDirectiveCtrl', function ($scope, $rootScope, $timeout, $interval, humanAPI, lodash) {

    $scope.$on('$destroy', function() {
      if ( human ) {
        console.log('Destroying humanAPI');
        human.destroy();
      }
    });
	})
  .directive('anatomy', function (lodash) {
    return {
      templateUrl: 'views/anatomy.html',
      restrict: 'E',
      replace: true,
      controller: 'anatomyDirectiveCtrl',
      scope: {
      	scene: '=',
      },
      link: function postLink(scope, element, attrs) {
        scope.id = 'human-'+lodash.random(1000000,10000000);
        scope.url  = 'https://human.biodigital.com/widget/?';
        scope.url += scope.scene.scene;
        scope.url += '&dk=e2300c218b9fb224951d19caab6219dc63c4ff2f';
        scope.url += '&bgstd=255,255,255,255,255,255';
        scope.url += '&ui-nav=false';
        scope.url += '&imageDisplay=fallback';
      }
    };
  });
