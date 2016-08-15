'use strict';

describe('Directive: anatomy', function () {

  // load the directive's module
  beforeEach(module('anatomyApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<anatomy></anatomy>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the anatomy directive');
  }));
});
