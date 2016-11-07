/*describe('My parsejs app', function () {

  it('should load some data from parse', function () {
    var stub = Parse.Mock.stubQueryFind(function (options) {
      return [new Parse.Object('User', {name: 'test@gmail.com'})]
    });

    expect(getUser()).toBeUndefined();

    loadUser(); //function that invokes Query.find

    expect(getUser()).toBeDefined();
    expect(stub.callCount).toEqual(1); //do assertions on stub object if necessary
  });

  afterEach(inject(function () {
    Parse.Mock.clearStubs(); //manually dispose of stubs
  }));


});*/


describe('LoginCtrl', function(){
    var scope;

    // load the controller's module
    beforeEach(module('starter.controllers'));
    var $controller;

    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        $controller('LoginCtrl', {$scope: $scope});
    }));

    it('back end login testing', function(){

        $scope.data.username = "test@gmail.com";
        expect(scope.data.username).toEqual("test@gmail.com");
        //scope.data.password = "password123";
        //scope.login();
        //scope.digest();


    });
});
