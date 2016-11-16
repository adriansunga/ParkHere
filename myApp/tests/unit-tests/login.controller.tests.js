describe('LoginCtrl', function() {

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
            login: jasmine.createSpy('login spy')
                          .and.returnValue(deferredLogin.promise)           
        };

        state = jasmine.createSpyObj('$state spy', ['go']);

        ionicPopup = jasmine.createSpyObj('$ionicPopup spy', ['alert']);

        controller = $controller('LoginCtrl', {'$scope': scope, '$ionicPopup': ionicPopup, '$state': state, 'user': user});
        
    }));


    it('scope is expected to initialize to empty object', function() {
        expect(scope.data).toEqual({});
    });

    it('test setUsername function in user service', function() {  
        expect(user.setUsername('Cole')).toEqual('Cole');
    });

    it('test setEmail function in user service', function() {  
        expect(user.setEmail('parker@gmail.com')).toEqual('parker@gmail.com');
    });


   
});







