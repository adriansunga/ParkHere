describe('OwnerDelete', function(){
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

    it('successful delete (no parkers)', function() {
    expect(2).toEqual(2);
      var canDelete = element.all(by.repeator('item in times')).last();
      canDelete.element(byid('deleteButton')).click();
      var popup = element(by.css('.popup-container.popup-showing.active'));
      expect(popup.isDisplayed()).toBeTruthy();
    //  var ptor = protractor.getInstance();
      var alertDialog = browser.switchTo().alert();
      alertDialog.accept()
      var numItems = element.all(by.repeator('item in times')).count();
      expect(numItems).toEqual(1);

    })

    it('cannot delete because of reservations', function() {
      var canDelete = element.all(by.repeator('item in times')).first();
      canDelete.element(byid('deleteButton')).click();
      var popup = element(by.css('.popup-container.popup-showing.active'));
      expect(popup.isDisplayed()).toBeTruthy();

    })

});
