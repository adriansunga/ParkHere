describe('LoginCtrl test', function(){
     var scope,
      controller;
    //
    // // load the controller's module
     //beforeEach(module('starter.controllers'));
    //
    beforeEach(module('starter.controllers'));
    console.log("out");

    beforeEach(inject(function($rootScope, $controller) {
      console.log("hi");
      controller = $controller('LoginCtrl', {$scope: scope, $ionicPopup: ionicPopup, $state: state, user: user});

      // scope = $rootScope.$new();
      // $scope = {};
      // $controller('LoginCtrl', {$scope: scope});
    }));

    it('back end login testing', function(){
        //$scope.data.username = "test@gmail.com";
        expect(true).toBe(true);
        //scope.data.password = "password123";
        //scope.login();
        //scope.digest();
    });
});
