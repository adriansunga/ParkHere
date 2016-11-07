describe('LogCtrl ', function(){

    beforeEach(function() {
        browser.get('/#/login');
        username = element(by.model('data.username'));
        password = element(by.model('data.password'));
        parker = element(by.id('login-radio1'));
        owner = element(by.id('login-radio3'));
        loginButton = element(by.id('login-button1'));
    });

    // beforeEach(inject(function($rootScope, $controller, $compile) {
    //          compile = $compile;
    //          scope = $rootScope.$new();
    //          stateMock = jasmine.createSpyObj('$state spy', ['go']);
    //          ionicPopupMock = jasmine.createSpyObj('$ionicPopup spy', ['alert']);
    //          log("$controller value: " + $controller);
    //          controller = $controller('LoginCtrl', {$scope: scope, '$state': stateMock, '$ionicPopup': ionicPopupMock, 'user':null});
    //      }));


   it('checking controller state', function() {
        var thisUsername = 'test@gmail.com';
        username.sendKeys(thisUsername);
        password.sendKeys('password123');
        owner.click();

        loginButton.click().then(function(){
            return browser.driver.wait(function() {
              return browser.driver.getCurrentUrl().then(function(url) {
                return /owner/.test(url);
              });
            }, 10000);

        });
        expect(controller.username).toEqual("parker@gmail.com");
    })


});
