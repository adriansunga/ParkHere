describe('LoginCtrl', function(){
    var scope;

    // load the controller's module
    // beforeEach(module('starter'));
    beforeEach(module('starter.controllers'));

    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        $controller('LoginCtrl', {$scope: scope});
    }));

    it('test', function(){

        expect(true).toEqual(true);
        // $scope.data.username = "test@gmail.com";
        //scope.data.password = "password123";
        //scope.login();
        //scope.digest();
    });
});

