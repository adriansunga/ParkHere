describe('ReservationCtrl', function() {

    var controller,
        ionicPopup,
        state,
        reservationInfo,
        scope;

    beforeEach(module('starter.controllers'));

    beforeEach(inject(function($rootScope, $controller, $q) {
        scope = $rootScope.$new();

        deferredLogin = $q.defer();
        
        reservationInfo = {
            login: jasmine.createSpy('reservationInfo spy')
                          .and.returnValue(deferredLogin.promise)           
        };

        state = jasmine.createSpyObj('$state spy', ['go']);

        ionicPopup = jasmine.createSpyObj('$ionicPopup spy', ['alert']);

        controller = $controller('ReservationCtrl', {'$scope': scope, '$ionicPopup': ionicPopup, '$state': state, 'reservationInfo': user});
        
    }));


    it('test set price function for reservation service', function() {  
        expect(reservationInfo.setPrice("5")).toEqual(5);
    });

    it('test set spot name function for reservation service', function() {  
        expect(reservationInfo.setSpotName("spot")).toEqual("spot");
    });
   
});







