'use strict';

/**
 * @ngdoc function
 * @name anatomyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the anatomyApp
 */
angular.module('anatomyApp')
  .controller('MainCtrl', function ($scope) {
    $scope.scene = {
	        "scene": "be=19Ws",
	        "camera": {"eye":{"x":13.89779063625143,"y":-64.71780069976309,"z":-2.0823764074809445},"look":{"x":7.319029194948756,"y":-67.26696538657485,"z":3.6197894659856744},"up":{"x":-0.16125012725226057,"y":0.9791112332847622,"z":0.1269668827557901}}
	      };
  });
