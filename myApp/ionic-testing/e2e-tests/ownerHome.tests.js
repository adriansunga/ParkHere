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
        var EC = protractor.ExpectedConditions;

        browser.driver.wait(function () {
            browser.wait(EC.visibilityOf(element.all(by.repeator('.itemName'))), 10000);
            return;
        });
    });

    it('should automatically show owner spaces already populated', function() {
      var itemName1 = element.all(by.css('.itemName')).first();
      expect(itemName1.getText()).toEqual("Cole World");
      var itemName2 = element.all(by.css('.itemName')).first();
      expect(itemName2.getText()).toEqual("Test Parking Space");
       
    })

});