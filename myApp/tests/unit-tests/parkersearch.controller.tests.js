describe('parkerSearchCtrl', function() {

    var controller,
        ionicPopup,
        state,
        parkerSearch,
        scope;

    beforeEach(module('starter.controllers'));

    beforeEach(inject(function($rootScope, $controller, $q) {
        scope = $rootScope.$new();

        deferredLogin = $q.defer();
        
        parkerSearch = {
            login: jasmine.createSpy('ParkerSearchCtrl spy')
                          .and.returnValue(deferredLogin.promise)           
        };

        state = jasmine.createSpyObj('$state spy', ['go']);

        ionicPopup = jasmine.createSpyObj('$ionicPopup spy', ['alert']);

        controller = $controller('parkerSearchCtrl', {'$scope': scope, '$ionicPopup': ionicPopup, '$state': state, 'parkerSearch': parkerSearch});
        

    }));


    it('parkingSpaceList is intitialized to nothing', function() {  
        expect(parkerSearch.parkingSpaceList.length).toEqual(0);
    });

    it('adding to parkingSpaceList', function() {  
        parkerSearch.parkingSpaceList.push("parking space example");
        expect(parkerSearch.parkingSpaceList.length).toEqual(1);
    });

    it('removing from parkingSpaceList', function() {  
        parkerSearch.parkingSpaceList.push("parking space example");
        parkerSearch.parkingSpaceList.splice(0,1);
        expect(parkerSearch.parkingSpaceList.length).toEqual(0);
    });
   
    it('test that start date is the current date', function() {  
        expect(parkerSearch.startDate).toEqual(new Date());
    });

    it('Check whether var geopoint is of type GeoPoint() upon initialization', function() {
        expect(parkerSearch.geoPoint instanceof Parse.GeoPoint()).toEqual(true);
    });

    
   
   

});







