describe('ownerHomeCtrl', function() {

    var controller,
        ionicPopup,
        state,
        parkingSpace,
        scope;

    beforeEach(module('starter.controllers'));

    beforeEach(inject(function($rootScope, $controller, $q) {
        scope = $rootScope.$new();

        deferredLogin = $q.defer();
        
        parkingSpace = {
            login: jasmine.createSpy('ownerHomeCtrl spy')
                          .and.returnValue(deferredLogin.promise)           
        };

        state = jasmine.createSpyObj('$state spy', ['go']);

        ionicPopup = jasmine.createSpyObj('$ionicPopup spy', ['alert']);

        controller = $controller('ownerHomeCtrl', {'$scope': scope, '$ionicPopup': ionicPopup, '$state': state, 'parkingSpace': parkingSpace});
        
    }));


    it('check if parking space is empty object upon initialization', function() {  
        expect(parkingSpace.parkingSpace).toEqual({});
    });

    it('test setting the url', function() {  
        expect(parkingSpace.setURL("www.google.com")).toEqual('www.google.com');
    });


   
});







