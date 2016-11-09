describe('upcomingSpacesCtrl', function() {

    var controller,
        ionicPopup,
        state,
        user,
        scope;

    beforeEach(module('starter.controllers'));

    beforeEach(inject(function($rootScope, $controller, $q) {
        scope = $rootScope.$new();

        deferredLogin = $q.defer();
        
        user = {
            login: jasmine.createSpy('upcoming spaces spy')
                          .and.returnValue(deferredLogin.promise)           
        };

        state = jasmine.createSpyObj('$state spy', ['go']);

        ionicPopup = jasmine.createSpyObj('$ionicPopup spy', ['alert']);

        controller = $controller('upcomingSpacesCtrl', {'$scope': scope, '$ionicPopup': ionicPopup, '$state': state, 'user': user});
   
    }));

    it('scope variable left can swipe is true', function() {
        expect(scope.listCanSwipe).toEqual(true);
    });
});

