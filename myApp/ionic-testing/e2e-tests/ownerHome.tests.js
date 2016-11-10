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
        //
        // browser.driver.wait(function () {
        //     browser.wait(EC.visibilityOf(element.all(by.repeator('.itemName'))), 10000);
        //     return;
        // });

    });

    it('owner menu profile --> profile page', function() {
      var EC = protractor.ExpectedConditions;
      var menuToggleButton = element(by.css('ion-side-menus [nav-bar="active"] [menu-toggle="left"]'));
      menuToggleButton.click();
      var settingsLink = element(by.id('ownerMenu-list-item3'));
      var isSettingsLinkClickable = EC.elementToBeClickable(settingsLink);
      browser.wait(isSettingsLinkClickable, 5000); //wait for the element to become clickable
      settingsLink.click();
      expect(browser.getLocationAbsUrl()).toMatch('/owner/profile');
    })

    it('should log out of owner', function() {
      var EC = protractor.ExpectedConditions;
      var menuToggleButton = element(by.css('ion-side-menus [nav-bar="active"] [menu-toggle="left"]'));
      menuToggleButton.click();
      var logOutLink = element(by.id('ownerMenu-list-item5'));
      var isLogOutLinkClickable = EC.elementToBeClickable(logOutLink);
      browser.wait(isLogOutLinkClickable, 5000); //wait for the element to become clickable
      logOutLink.click();
      var popup = element(by.css('.popup-container.popup-showing.active'));
      expect(popup.isDisplayed()).toBeTruthy();
      popup.element(by.css('.button.ng-binding.button-positive')).click();
      expect(browser.getLocationAbsUrl()).toMatch('/login');
    })

    it('should not log out of owner when cancelled', function() {
      var EC = protractor.ExpectedConditions;
      var menuToggleButton = element(by.css('ion-side-menus [nav-bar="active"] [menu-toggle="left"]'));
      menuToggleButton.click();
      var logOutLink = element(by.id('ownerMenu-list-item5'));
      var isLogOutLinkClickable = EC.elementToBeClickable(logOutLink);
      browser.wait(isLogOutLinkClickable, 5000); //wait for the element to become clickable
      logOutLink.click();
      var popup = element(by.css('.popup-container.popup-showing.active'));
      expect(popup.isDisplayed()).toBeTruthy();
      popup.element(by.css('.button.ng-binding.button-default')).click();
      expect(browser.getLocationAbsUrl()).toMatch('/owner/home');
    })


    it('should automatically show owner spaces already populated', function() {

      var nameOfSpace = "Cole World";
      var nameOfSpace2 = "Test Space";
      var itemName2 = element(by.id("ownerHome-list4"));
      expect(nameOfSpace).toEqual("Cole World");
       
    })
});
