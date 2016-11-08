describe('clicking on options from the parker menu', function() {


  describe('not logged in for parker menu', function() {
    beforeEach(function() {
        browser.get('/#/login');
        username = element(by.model('data.username'));
        password = element(by.model('data.password'));
        parker = element(by.id('login-radio1'));
        loginButton = element(by.id('login-button1'));
        thisUsername = 'parker@gmail.com'
        username.sendKeys(thisUsername);
        password.sendKeys('parkerparker5');
        parker.click();

        loginButton.click().then(function(){
            return browser.driver.wait(function() {
              return browser.driver.getCurrentUrl().then(function(url) {
                return /parker/.test(url);
              });
            }, 10000);
        });
    });

    it('parker menu Upcoming Spaces --> upcoming spaces page', function() {
      var EC = protractor.ExpectedConditions;
      var menuToggleButton = element(by.css('ion-side-menus [nav-bar="active"] [menu-toggle="left"]'));
      menuToggleButton.click();
      var upcomingSpacesLink = element(by.id('parkerMenu-list-item3'));
      var isUpcomingSpacesLinkClickable = EC.elementToBeClickable(upcomingSpacesLink);
      browser.wait(isUpcomingSpacesLinkClickable, 5000); //wait for the element to become clickable
      upcomingSpacesLink.click().then(function(){
          return browser.driver.wait(function() {
            return browser.driver.getCurrentUrl().then(function(url) {
              return /parker/.test(url);
            });
          }, 10000);
        });
        expect(browser.getLocationAbsUrl()).toMatch('/parker/upcomingSpaces');
    })
  });

  describe('already logged in from parker menu', function() {
    beforeEach(function() {
        browser.get('/#/login');
    });

    it('parker menu Map View --> mapView page', function() {
      var EC = protractor.ExpectedConditions;
      var menuToggleButton = element(by.css('ion-side-menus [nav-bar="active"] [menu-toggle="left"]'));
      menuToggleButton.click();
      var mapViewLink = element(by.id('parkerMenu-list-item2'));
      var isMapViewLinkClickable = EC.elementToBeClickable(mapViewLink);
      browser.wait(isMapViewLinkClickable, 5000); //wait for the element to become clickable
      mapViewLink.click().then(function(){
          return browser.driver.wait(function() {
            return browser.driver.getCurrentUrl().then(function(url) {
              return /parker/.test(url);
            });
          }, 10000);
        });
        expect(browser.getLocationAbsUrl()).toMatch('/parker/parkerMap');
    })

    it('parker menu Search --> search page', function() {
      var EC = protractor.ExpectedConditions;
      var menuToggleButton = element(by.css('ion-side-menus [nav-bar="active"] [menu-toggle="left"]'));
      menuToggleButton.click();
      var settingsLink = element(by.id('parkerMenu-list-item1'));
      var isSettingsLinkClickable = EC.elementToBeClickable(settingsLink);
      browser.wait(isSettingsLinkClickable, 5000); //wait for the element to become clickable
      settingsLink.click().then(function(){
          return browser.driver.wait(function() {
            return browser.driver.getCurrentUrl().then(function(url) {
              return /parker/.test(url);
            });
          }, 10000);
        });

        expect(browser.getLocationAbsUrl()).toMatch('/parker/parkerSearch');
    })

    it('should log out of parker', function() {
      var EC = protractor.ExpectedConditions;
      var menuToggleButton = element(by.css('ion-side-menus [nav-bar="active"] [menu-toggle="left"]'));
      menuToggleButton.click();
      var logOutLink = element(by.id('parkerMenu-list-item4'));
      var isLogOutLinkClickable = EC.elementToBeClickable(logOutLink);
      browser.wait(isLogOutLinkClickable, 5000); //wait for the element to become clickable
      logOutLink.click();
      var popup = element(by.css('.popup-container.popup-showing.active'));
      expect(popup.isDisplayed()).toBeTruthy();
      popup.element(by.css('.button.ng-binding.button-positive')).click();
      expect(browser.getLocationAbsUrl()).toMatch('/login');
    })

    it('should not log out of parker if cancelled', function() {
      var EC = protractor.ExpectedConditions;
      var menuToggleButton = element(by.css('ion-side-menus [nav-bar="active"] [menu-toggle="left"]'));
      menuToggleButton.click();
      var logOutLink = element(by.id('parkerMenu-list-item4'));
      var isLogOutLinkClickable = EC.elementToBeClickable(logOutLink);
      browser.wait(isLogOutLinkClickable, 5000); //wait for the element to become clickable
      logOutLink.click();
      var popup = element(by.css('.popup-container.popup-showing.active'));
      expect(popup.isDisplayed()).toBeTruthy();
      popup.element(by.css('.button.ng-binding.button-default')).click();
      expect(browser.getLocationAbsUrl()).toMatch('/parker/parkerSearch');
    })

  });
});
