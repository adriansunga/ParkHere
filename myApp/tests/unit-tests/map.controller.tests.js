describe('MapCtrl', function() {

    var controller,
        ionicPopup,
        state,
        user,
        scope;

    var loginController;


    beforeEach(module('starter.controllers'));

    beforeEach(inject(function($rootScope, $controller, $q) {
        scope = $rootScope.$new();

        deferredLogin = $q.defer();
        
        user = {
            login: jasmine.createSpy('MapCtrl spy')
                          .and.returnValue(deferredLogin.promise)           
        };

        state = jasmine.createSpyObj('$state spy', ['go']);

        ionicPopup = jasmine.createSpyObj('$ionicPopup spy', ['alert']);

        controller = $controller('MapCtrl', {'$scope': scope, '$ionicPopup': ionicPopup, '$state': state, 'user': user});
   
    }));

    it('Test timeout option in Map Controller', function() {
        expect(scope.options.timeout).toEqual(10000);
    });

	it('Test enableHighAccuracy option in Map Controller', function() {
        expect(scope.options.enableHighAccuracy).toEqual(true);
    });
   
});