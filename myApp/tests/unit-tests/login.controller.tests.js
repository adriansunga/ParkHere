describe('LoginCtrl', function() {

    var controller,
        scope;

    console.log('hello');

    // load the module for our app
    // beforeEach(module('myApp'));

    // load the controller's module
    beforeEach(module('starter.controllers'));
    // beforeEach(module('starter.services'));
    // beforeEach(module('myApp'));

    // beforeEach(module(function($provide, $urlRouterProvider) {
    //     $provide.value('$ionicTemplateCache', function(){} );
    //     $urlRouterProvider.deferIntercept();
    // }));

    console.log('before');

    beforeEach(inject(function($rootScope, $controller) {
        console.log('in before each');
        scope = $rootScope.$new();
        controller = $controller('LoginCtrl', {$scope: scope, $ionicPopup: ionicPopup, $state: state, user: user});
        
        console.log('controller problem' + controller);

    }));

    console.log('after');

    it('test', function() {
            // expect(dinnerServiceMock.login).toHaveBeenCalledWith('test1', 'password1'); 
            expect(1+2).toEqual(3);
    });
    
    // disable template caching
    
    
    // instantiate the controller and mocks for every test
    // beforeEach(inject(function($controller, $q) {
        // deferredLogin = $q.defer();
        
        // mock dinnerService
        // dinnerServiceMock = {
        //     login: jasmine.createSpy('login spy')
        //                   .and.returnValue(deferredLogin.promise)           
        // };
        
        // mock $state
        // stateMock = jasmine.createSpyObj('$state spy', ['go']);
        
        // mock $ionicPopup
        // ionicPopupMock = jasmine.createSpyObj('$ionicPopup spy', ['alert']);
        
        // instantiate LoginController
        // controller = $controller('LoginCtrl', 
                        // { 
                        // '$ionicPopup': ionicPopupMock, 
                        // '$state': stateMock, 
                        // 'DinnerService': dinnerServiceMock }
                     // );
    // }));
    
    // describe('#$scope.signUpClicked', function() {
        
        // call doLogin on the controller for every test
        // beforeEach(inject(function(_$rootScope_) {
        //     $rootScope = _$rootScope_;
        //     controller.username = 'test1';
        //     controller.password = 'password1';
        //     controller.doLogin();
        // }));
        
        // it('test', function() {
        //     // expect(dinnerServiceMock.login).toHaveBeenCalledWith('test1', 'password1'); 
        //     expect(true).toEqual(true);
        // });
        
        // describe('when the login is executed,', function() {
        //     it('if successful, should change state to my-dinners', function() {
                
        //         deferredLogin.resolve();
        //         $rootScope.$digest();
                
        //         expect(stateMock.go).toHaveBeenCalledWith('my-dinners');
        //     });
            
        //     it('if unsuccessful, should show a popup', function() {
                
        //         deferredLogin.reject();
        //         $rootScope.$digest();
                
        //         expect(ionicPopupMock.alert).toHaveBeenCalled();
        //     });
        // });
    // })
});