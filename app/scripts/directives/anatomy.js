'use strict';

angular.module('anatomyApp')
	.factory('humanAPI', function ($window) {
    return $window.HumanAPI ? $window.HumanAPI : {};
  })
  .factory('$', function ($window) {
    return $window.$ ? $window.$ : {};
  })
  .filter('trust', function ($sce) {
    return function (input) {
      return $sce.trustAsResourceUrl(input);
    };
  })
	.controller('anatomyDirectiveCtrl', function ($scope, $rootScope, $timeout, $interval, humanAPI, lodash) {

		var human = null, 
				introDuration = 2000,
				floatDuration = 10000,
				ignoreScopeCameraChange = false,
				ignoreHumanCameraChange = true;

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
		function easeInOut(x) {
			return 3*x*x - 2*x*x*x;
		}

		$timeout(function() {

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
					human.send('camera.set', _.extend({}, $scope.camera, {animate: true}), function() {
						ignoreHumanCameraChange = false;
					});
					
				} else {
					ignoreHumanCameraChange = true;
					human.send('camera.set', _.extend({}, $scope.scene.camA, {animate: true}), startAnimation );
				}
			}

			$scope.$watch('camera', function() {
				if ( ignoreScopeCameraChange ) { return; }
				updateCamera();
			});

			human.on('human.ready', function() {
				$scope.modelReady = true;
				$scope.$apply();
			});

			// Have we been revealed?
			$scope.$watchGroup(['modelReady', 'scene.hidden'], function() {
				if ( !$scope.modelReady || $scope.scene.hidden ) { return; }

				// Reset camera
				human.send('camera.set', $scope.scene.camInit);
				$timeout(updateCamera, 500);
			});

			$scope.$watch('scene.hidden', function() {
				if ( !$scope.scene.hidden ) { return; }
				
				stopAnimation();
				console.log('detach');
				ignoreHumanCameraChange = true;
				$scope.camera = {};
			});
		});

    $scope.$on('$destroy', function() {
    	stopAnimation();
      if ( human ) {
        console.log('Destroying humanAPI');
        human.destroy();
      }
    });
	})
  .directive('anatomy', function (lodash, $) {
    return {
      templateUrl: 'views/anatomy.html',
      restrict: 'E',
      replace: true,
      controller: 'anatomyDirectiveCtrl',
      scope: {
      	scene: '=',
      	camera: '=',
      },
      link: function postLink(scope, element, attrs) {
        scope.id = lodash.uniqueId('_human-');
        scope.autoMode = true;
        scope.modelReady = false;
        scope.camera = scope.camera || {};

        scope.poster = scope.scene.poster ? 'url(\''+scope.scene.poster+'\')' : 'none';

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
