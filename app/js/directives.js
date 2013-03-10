'use strict';

/* Directives */


angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
.directive('ngOnkeyup', function() {
        return {
          restrict: 'A',
          scope: {
            func: '&ngOnkeyup'
          },
          link: function( scope, elem, attrs ) {
            elem.bind('keyup', scope.func);
            return elem;
          }
        };
      });