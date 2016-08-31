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

    // $scope.scene = {
    //       scene: 'be=19Ws',
    //       poster: 'http://lifeletters-education.s3.amazonaws.com/anatomy-test.png',
    //       camInit: {
    //         position:{x:14.202760578233727,y:-59.621763245938496, z:-2.9583409841417865},
    //         target:{x:7.569922821776217,y:-67.69964756381691, z:3.7228197319024927},
    //         up:{x:-0.42380384249610253,y:0.8086520033562826, z:0.4085681607054695}},
    //       camA: {
    //         position:{x:13.89779063625143,y:-64.71780069976309, z:-2.0823764074809445},
    //         target:{x:7.319029194948756,y:-67.26696538657485, z:3.6197894659856744},
    //         up:{x:-0.16125012725226057,y:0.9791112332847622, z:0.1269668827557901}},
    //       camB: {
    //         position:{x:14.699672978391659,y:-64.59720181328625, z:-0.9290013794208152},
    //         target:{x:7.319029194948756,y:-67.26696538657485, z:3.619789465985674},
    //         up:{x:-0.19117298005784997,y:0.9761708908648636, z:0.10641561691736882}},
    //       camCenter: {position:{x:11.833044135249594,y:-65.66737447703048,z:2.4700447102056717},target:{x:4.325377666384033,y:-67.09578330366426,z:2.3547005284356395},up:{x:-0.10792507836650611,y:0.9943509571609963,z:-0.011536565708204466}}
    //     };

    $scope.scene = {
          scene: 'm=heart',
          poster: 'http://lifeletters-education.s3.amazonaws.com/m=heart.jpg',
          sound: 'http://lifeletters-education.s3.amazonaws.com/heartbeat-normal.wav',
          // camera: {
          //   position: {
          //     x: 0.701953487190026,
          //     y: 3.9884145547343373,
          //     z: -11.77579397078548
          //   },
          //   target: {
          //     x: 4.845565095305164,
          //     y: -0.49586481468699944,
          //     z: 6.705059080717307
          //   },
          //   up: {
          //     x: 0.024273794593603713,
          //     y: 0.9884996104163345,
          //     z: 0.15185619217793286
          //   }
          // },
          camInit: {
            "position": {
              "x": -1.4860714628325813,
              "y": 5.9240248297043765,
              "z": -23.385393429238977
            },
            "target": {
              "x": 7.83234336651744,
              "y": -0.5141658455826924,
              "z": 2.733404964430547
            },
            "up": {
              "x": 0.04115259246000349,
              "y": 0.9891599772158154,
              "z": 0.14370109118663052
            }
          },
          camA: {
            "position": {
              "x": 0.701953487190026,
              "y": 3.9884145547343373,
              "z": -11.77579397078548
            },
            "target": {
              "x": 4.845565095305164,
              "y": -0.49586481468699944,
              "z": 6.705059080717307
            },
            "up": {
              "x": 0.024273794593603713,
              "y": 0.9884996104163345,
              "z": 0.15185619217793286
            }
          },
          camB: {
            "position": {
              "x": 3.5354425341214606,
              "y": 4.370011697633717,
              "z": -12.36849851200941
            },
            "target": {
              "x": 3.3349796502116966,
              "y": -0.2793671490091761,
              "z": 6.530265974213734
            },
            "up": {
              "x": -0.011276245749393725,
              "y": 0.9871224309251603,
              "z": 0.1619973846893843
            }
          },
          camCenter: {
            "position": {
              "x": -1.7939719380172108,
              "y": 3.5221970151746453,
              "z": -9.40836747813701
            },
            "target": {
              "x": 0.3985604686912099,
              "y": 0.03146937110594769,
              "z": 5.466563761832621
            },
            "up": {
              "x": 0.012327164814958467,
              "y": 0.9891599772158154,
              "z": 0.14896838752578442
            }
          }
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
