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
				floatDuration = 10000; 

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
			human = new humanAPI.Human({
	        iframeId: $scope.id,
	        showLog: true,
	        humanLog: true
	      });

			human.camera.on('update', function(update) {
			  console.log("Camera flew to: " + JSON.stringify(update));
			});

			var animationCycle = null;

			human.on("ready", function() {
				var loadedAt = getMillis();

			  animationCycle = $interval( function() {
			  	if ( !$scope.animated ) {
			  		$interval.cancel(animationCycle);
			  	}

			  	var diff = getMillis()-loadedAt;
			  	if ( diff < introDuration ) {
			  		var x = easeInOut(diff/introDuration),
			  				cam = tweenCamera($scope.scene.init, $scope.scene.camera[0], x);

			  		human.camera.jumpTo(cam, function() {});
			  	} else {
			  		var x = (diff-introDuration)/floatDuration,
								y = (Math.cos(Math.PI*(2*x+1))+1)/2;

			  		var cam = tweenCamera($scope.scene.camera[0], $scope.scene.camera[1], y);
			  		human.camera.jumpTo(cam, function() {});
				    // human.camera.orbitBy({
				    //   yaw: 0.5,
				    //   pitch: 0.1
				    // });
			  	}
			  }, 30);
			});
		});

    $scope.$on('$destroy', function() {
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
      },
      link: function postLink(scope, element, attrs) {
        scope.id = '_human-'+lodash.random(1000000,10000000);
        scope.animated = true;

        scope.url  = 'https://human.biodigital.com/widget/?';
        scope.url += scope.scene.scene;
        scope.url += '&dk=e2300c218b9fb224951d19caab6219dc63c4ff2f';
        scope.url += '&bgstd=255,255,255,255,255,255';
        scope.url += '&ui-nav=false';
        scope.url += '&imageDisplay=fallback';

				$('iframe').on('load', function () {
				  var iframe = $('iframe').contents();
				});
				// $(window).on('click', function() {
				// 	console.log('click');
				// 	scope.animated = false;
				// });
				// $(window).on('blur', function() {
				// 	console.log('blur');
				// 	scope.animated = false;
				// });
				$('.cover', $(element)).on('mousedown', function() {
					scope.animated = false;
					$('.cover', $(element)).hide();
				});

      }
    };
  });
