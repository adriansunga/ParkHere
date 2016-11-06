describe('OwnerHomepage', function(){  
    var thisUsername;
    beforeEach(function() {
        browser.get('/#/login');
        username = element(by.model('data.username'));
        password = element(by.model('data.password'));
        parker = element(by.id('login-radio1'));
        owner = element(by.id('login-radio3'));
        loginButton = element(by.id('login-button1'));
        thisUsername = 'test@gmail.com'
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
        /*element(by.id(ownerMenu-list-item2)).click().then(function(){
            return browser.driver.wait(function() {
              return browser.driver.getCurrentUrl().then(function(url) {
                return /add/.test(url);
              });
            }, 10000);
            
        });*/
        
        browser.get('/#/owner/addSpace');
        var EC = protractor.ExpectedConditions;

        browser.driver.wait(function () {
            browser.wait(EC.visibilityOf(element(by.id('ownerAddSpace-form4'))), 10000);
            return elem;
        });
        //go to owner add space
    });

    it('check owner add space', function() {
        element(by.model('data.spaceName')).sendKeys('Test Space 1');
        element(by.model('data.price')).sendKeys('20');
        element(by.model('data.location.formatted_address')).sendKeys('3030 Shrine pl Los Angeles CA');
        element.all(by.tagName('typeOption')).first().click();


       
    })

});