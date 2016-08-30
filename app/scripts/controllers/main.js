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

  	$scope.camera = {};
    $scope.muteUi = false;

    $scope.scene = {
	        scene: 'be=19Ws',
	        poster: 'http://lifeletters-education.s3.amazonaws.com/anatomy-test.png',
	        camInit: {
            position:{x:14.202760578233727,y:-59.621763245938496, z:-2.9583409841417865},
            target:{x:7.569922821776217,y:-67.69964756381691, z:3.7228197319024927},
            up:{x:-0.42380384249610253,y:0.8086520033562826, z:0.4085681607054695}},
	        camA: {
            position:{x:13.89779063625143,y:-64.71780069976309, z:-2.0823764074809445},
            target:{x:7.319029194948756,y:-67.26696538657485, z:3.6197894659856744},
            up:{x:-0.16125012725226057,y:0.9791112332847622, z:0.1269668827557901}},
	        camB: {
            position:{x:14.699672978391659,y:-64.59720181328625, z:-0.9290013794208152},
            target:{x:7.319029194948756,y:-67.26696538657485, z:3.619789465985674},
            up:{x:-0.19117298005784997,y:0.9761708908648636, z:0.10641561691736882}},
	        camCenter: {"position":{"x":11.833044135249594,"y":-65.66737447703048,"z":2.4700447102056717},"target":{"x":4.325377666384033,"y":-67.09578330366426,"z":2.3547005284356395},"up":{"x":-0.10792507836650611,"y":0.9943509571609963,"z":-0.011536565708204466}}

	      };

  	$scope.toggle = function() {
  		$scope.scene.hidden = !$scope.scene.hidden;
  	};
    $scope.toggleUi = function() {
      $scope.muteUi = !$scope.muteUi;
    };

    $scope.setCamInit = function() {
      $scope.scene.camInit = angular.copy($scope.camera);
    };
    $scope.restoreCamInit = function() {
      $scope.camera = angular.copy($scope.scene.camInit);
    };
  	$scope.setCamA = function() {
  		$scope.scene.camA = angular.copy($scope.camera);
  	};
    $scope.restoreCamA = function() {
      $scope.camera = angular.copy($scope.scene.camA);
    };
  	$scope.setCamB = function() {
  		$scope.scene.camB = angular.copy($scope.camera);
  	};
    $scope.restoreCamB = function() {
      $scope.camera = angular.copy($scope.scene.camB);
    };


  	// $scope.$on('anatomy:camera:change', function(camera) {
  	// 	console.log(camera);
  	// 	$scope.camera = camera;
  	// });

    $scope.$watch('camera', function() {
      console.log(JSON.stringify($scope.camera));
    });
  });
