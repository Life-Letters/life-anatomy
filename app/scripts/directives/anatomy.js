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
				locked = true;

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
				eye: tweenVec(cam1.eye, cam2.eye, amount),
				look: tweenVec(cam1.look, cam2.look, amount),
				up: tweenVec(cam1.up, cam2.up, amount),
			};
		}
		function easeInOut(x) {
			return 3*x*x - 2*x*x*x;
		}

		$timeout(function() {

			var animationCycle = false;

			// Start a cycle between two camera positions
			function startAutoMode() {
				if (animationCycle) { return; }

				var startedAt = getMillis();
				animationCycle = $interval(function() {
			  	var diff = getMillis()-startedAt;
		  		var x = diff/floatDuration,
							y = (Math.cos(Math.PI*(2*x+1))+1)/2;

		  		var cam = tweenCamera($scope.scene.camA, $scope.scene.camB, y);
		  		human.camera.jumpTo(cam);
		  	});
			}

			function stopAutoMode() {
				if (!animationCycle) { return; }
				$interval.cancel(animationCycle);
				animationCycle = false;
			}

			human = new humanAPI.Human({
	        iframeId: $scope.id,
	        showLog: true,
	        humanLog: true
	      });

			human.camera.on('update', lodash.debounce(function(update) {
				if ( $scope.autoMode || !$scope.isVisible() ) { return; }
				locked = true;
				$timeout(function() { locked = false; }, 500);

				$scope.camera = lodash.pick(update, ['eye','look','up']);
				$scope.$apply();
			}), 500);

			$scope.$watch('camera', function() {
				if ( locked || $scope.scene.hidden ) { return; }

				if ( $scope.autoMode ) {
					$scope.autoMode = false;
				} else {
					human.camera.flyTo($scope.camera);
				}
			});


			human.on("ready", function() {
				$scope.modelReady = true;
				$scope.$apply();
			});

			// Have we been revealed?
			$scope.$watchGroup(['modelReady','scene.hidden'], function() {
				if ( !$scope.modelReady || $scope.scene.hidden ) { return; }

				human.camera.jumpTo($scope.scene.camInit);
				$timeout(function() {
					// TODO: slow this animation down
					human.camera.flyTo($scope.scene.camA, startAutoMode);
				}, 500);
			});

			$scope.$watch('scene.hidden', function() {
				if ( $scope.scene.hidden ) {
					stopAutoMode();
				}
			});

			var init = true;
			$scope.$watch('autoMode', function() {
				if (init) { init = false; return; }

				if ( $scope.autoMode ) {
					human.camera.flyTo( $scope.scene.camA, startAutoMode );
				} else {
					stopAutoMode();
					human.camera.flyTo( lodash.isObject($scope.camera) && lodash.size($scope.camera) ? 
							$scope.camera : 
							$scope.scene.camCenter );
				}
			});
		});

    $scope.$on('$destroy', function() {
    	stopAutoMode();
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
        	if ( !scope.isReady() ) { return; }
        	scope.autoMode = !scope.autoMode;
        };
        scope.isAutoMode = function() {
        	return scope.autoMode;
        };
      }
    };
  });
