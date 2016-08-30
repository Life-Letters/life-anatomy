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
      // {
      //   position: {
      //     x: 11.107541524221833,
      //     y: -63.85547430141181,
      //     z: 2.8861229609081316
      //   },
      //   target: {
      //     x: 3.4444336099889687,
      //     y: -67.95483238856825,
      //     z: 0.28514646761257595
      //   },
      //   up: {
      //     x: -0.3571809732775669,
      //     y: 0.9250518116297471,
      //     z: -0.1322191292098776
      //   }
      // };

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
          camCenter: {position:{x:11.833044135249594,y:-65.66737447703048,z:2.4700447102056717},target:{x:4.325377666384033,y:-67.09578330366426,z:2.3547005284356395},up:{x:-0.10792507836650611,y:0.9943509571609963,z:-0.011536565708204466}}
        };

    // $scope.scene = {
    //     scene: 'm=coronary_heart_disease',
    //     tourChapter: 1,
    //     camera: {
    //       eye: {x: -8.977224007132818,y: -4.719704279269048,z: -4.627902449318974},
    //       look: {x: -7.503256969398716,y: -3.7889903043845545,z: -0.7952115251660704},
    //       up: {x: -0.05612484621522915,y: 0.9877002718977378,z: -0.14593894110364034}
    //     }
    //   };

  	$scope.toggleVis = function() {
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
    $scope.setCamCenter = function() {
      $scope.scene.camCenter = angular.copy($scope.camera);
    };
    $scope.restoreCamCenter = function() {
      $scope.camera = angular.copy($scope.scene.camCenter);
    };

  });
