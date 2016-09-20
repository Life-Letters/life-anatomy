'use strict';

angular.module('life.anatomy', [
  	'ngAnimate',
  	'ngLodash',
  	'angularSpinner',
  	'ngAudio',
  ])
	.factory('HumanAPI', function ($window) {
    return $window.HumanAPI ? $window.HumanAPI : {};
  })
  // .factory('$', function ($window) {
  //   return $window.$ ? $window.$ : {};
  // })
  .filter('trust', function ($sce) {
    return function (input) {
      return $sce.trustAsResourceUrl(input);
    };
  })
	.controller('anatomyDirectiveCtrl', function ($scope, $rootScope, $timeout, $interval, HumanAPI, lodash, ngAudio) {
		
		var human = null,
				floatDuration = 10000,
				ignoreScopeCameraChange = false,
				ignoreHumanCameraChange = true,
				sound = false;

		function getMillis() {
			return (new Date()).getTime();
		}
		function tweenVec(vec1, vec2, amount) {
			var from = 1 - amount;

			return {
				x: vec1.x*from + vec2.x*amount,
				y: vec1.y*from + vec2.y*amount,
				z: vec1.z*from + vec2.z*amount,
			};
		}
		function tweenCamera(cam1, cam2, amount) {
			return {
				position: tweenVec(cam1.position, cam2.position, amount),
				target: tweenVec(cam1.target, cam2.target, amount),
				up: tweenVec(cam1.up, cam2.up, amount),
			};
		}
		// function easeInOut(x) {
		// 	return 3*x*x - 2*x*x*x;
		// }

		$timeout(function() {

			// Check that the directive set everything up.
			if ( !$scope.url.length ) {
				return;
			}

			var animationCycle = false;

			// Start a cycle between two camera positions
			function startAnimation() {
				if (animationCycle) { return; }

				var startedAt = getMillis();
				animationCycle = $interval(function() {
			  	var diff = getMillis() - startedAt;
		  		var x = diff/floatDuration,
							y = (Math.cos(Math.PI*(2*x+1))+1)/2;

		  		var cam = tweenCamera($scope.scene.camA, $scope.scene.camB, y);
		  		human.send('camera.set', cam);
		  	}, 30);
			}

			function stopAnimation() {
				if (!animationCycle) { return; }
				$interval.cancel(animationCycle);
				animationCycle = false;
			}

			human = new HumanAPI({
	        iframeId: $scope.id,
	        showLog: true,
	        humanLog: true
	      });

			human.on('camera.updated', lodash.debounce(function(update) {
				if ( ignoreHumanCameraChange ) { return; }

				// Avoid responding to the camera update that the next few lines will trigger
				ignoreScopeCameraChange = true;
				$timeout(function() { ignoreScopeCameraChange = false; }, 500);

				$scope.camera = lodash.pick(update, ['position','target','up']);
				$scope.$apply();
			}, 500));
			

			// Animate the camera
			function updateCamera() {
				if ( !$scope.modelReady || $scope.scene.hidden ) { return; }

				// Have we switched to the manual mode?
				if ( $scope.isManualMode() ) {
					stopAnimation();
					human.send('camera.set', lodash.extend({animate: true}, $scope.camera), function() {
						ignoreHumanCameraChange = false;
					});
					
				} else {
					ignoreHumanCameraChange = true;
					human.send('camera.set', lodash.extend({animate: true}, $scope.scene.camA), startAnimation );
				}
			}

			$scope.$watch('camera', function() {
				if ( ignoreScopeCameraChange ) { return; }
				updateCamera();
			});

			human.on('human.ready', function() {
				if ( $scope.scene.sound ) {
					sound = ngAudio.load($scope.scene.sound);
					sound.loop = true;
				}
				$scope.modelReady = true;
				$scope.$apply();
			});

			// Have we been revealed?
			$scope.$watchGroup(['modelReady', 'scene.hidden'], function() {
				if ( !$scope.modelReady || $scope.scene.hidden ) { return; }

				// Reset camera
				human.send('camera.set', $scope.scene.camA, function() {
					// Restart sound
					if (sound) { 
						sound.play();
					}
					updateCamera();
				});
			});

			$scope.$watch('scene.hidden', function() {
				if ( !$scope.scene.hidden ) { return; }
				
				stopAnimation();
				ignoreHumanCameraChange = true;
				if (sound) { 
					sound.pause();
				}
				$scope.camera = {};
			});

	    $scope.$on('$destroy', function() {
	    	stopAnimation();
				ignoreHumanCameraChange = true;

	      if (sound) { 
					sound.stop();
					sound.destroy();
				}
        if ( human && !lodash.isUndefined(human._rpc) && !lodash.isFunction(human._rpc) ) {
        	console.log('destroying HumanAPI');
        	human._rpc.destroy();
        }
	    });
		});
	})
  .directive('anatomy', function (lodash) {
    return {
      // templateUrl: 'views/anatomy.html',
      template: 
					'<div class="anatomy" ng-show="isVisible()" style="background-image:{{ poster }};">'+
					  '<div class="spinner"><span us-spinner="{radius:20, width:3, length: 10}" ng-show="!isReady()"></span></div>'+
					  '<span ng-show="isReady()">'+
					  	'<iframe id="{{ id }}" ng-src="{{ url | trust }}" ng-if="url"></iframe>'+
						  '<a href="javascript:void(0)" ng-click="toggleMode()" class="back" ng-show="!isAutoMode()"><i class="fa fa-angle-left"></i> Back</a>'+
						  '<div class="cover" ng-show="isAutoMode()" ng-click="toggleMode()"></div>'+
						'</span>'+
					'</div>',
      restrict: 'E',
      replace: true,
      controller: 'anatomyDirectiveCtrl',
      scope: {
      	scene: '=',
      	camera: '=',
      },
      link: function postLink(scope) {

      	scope.url = '';
        scope.id = lodash.uniqueId('_human-');
        scope.modelReady = false;
        // Holds the user controlled camera movements.
        // If null, the camera is not in an interactive mode, i.e. it is controlled by the anatomy system.
        scope.camera = scope.camera || {};
        scope.poster = scope.scene.poster ? 'url(\''+scope.scene.poster+'\')' : 'none';

        // Support legacy projects
        if ( lodash.isObject(scope.scene.camera) ) {
					if ( !lodash.isObject(scope.scene.camA)) {
						scope.scene.camA = angular.copy(scope.scene.camera);
					}
					if ( !lodash.isObject(scope.scene.camB)) {
						scope.scene.camB = angular.copy(scope.scene.camera);
					}
					if ( !lodash.isObject(scope.scene.camCenter)) {
						scope.scene.camCenter = angular.copy(scope.scene.camera);
					}
        }

        if (!lodash.isObject(scope.scene.camA) ||
						!lodash.isObject(scope.scene.camB) ||
						!lodash.isObject(scope.scene.camCenter)) {
        	console.warn('Missing camera details. Please set scene.camera or scene.(camA|camB|camCenter)');
        	return;
        }

        scope.url  = 'https://human.biodigital.com/widget/?'+scope.scene.scene;
        scope.url += '&dk=e2300c218b9fb224951d19caab6219dc63c4ff2f';
        scope.url += '&bgstd=255,255,255,255,255,255';
        scope.url += '&ui-nav=false';
        scope.url += '&imageDisplay=fallback';

        scope.isVisible = function() {
        	return !scope.scene.hidden;
        };
        scope.isReady = function() {
        	return scope.modelReady;
        };
        scope.toggleMode = function() {
        	if ( scope.isAutoMode() ) {
        		// Puts it into manual mode
        		scope.camera = angular.copy(scope.scene.camCenter);
        	} else {
        		// Puts it into auto mode
        		scope.camera = {};
        	}
        };
        scope.isManualMode = function() {
        	return lodash.isObject(scope.camera) && lodash.size(scope.camera);
        };
        scope.isAutoMode = function() {
        	return !scope.isManualMode();
        };
      }
    };
  });
