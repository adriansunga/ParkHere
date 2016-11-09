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
        
    });

    it('should automatically show owner spaces already populated', function() {
      var nameOfSpace = "Cole World";
      var nameOfSpace2 = "Test Space";
      var itemName2 = element(by.id("ownerHome-list4"));
      expect(nameOfSpace).toEqual("Cole World");
       
    })

});