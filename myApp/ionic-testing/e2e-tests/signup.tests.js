describe('Clicking on the signup button ', function(){  
    var name, email, password, parker, owner, signUpButton;
    
    beforeEach(function() {
        browser.get('/#/signup');
        name = element(by.model('data.username'));
        email = element(by.model('data.email'));
        password = element(by.model('data.password'));
        parker = element(by.id('signup-radio4'));
        owner = element(by.id('signup-radio5'));
        signUpButton = element(by.id('signup-button3'));
    });

    it('owner successful sign up', function() {
        name.sendKeys("Owner Test");
        email.sendKeys('anotherOwner5@gmail.com');
        password.sendKeys('password123');
        owner.click();
        signUpButton.click().then(function(){
            return browser.driver.wait(function() {
              return browser.driver.getCurrentUrl().then(function(url) {
                return /owner/.test(url);
              });
            }, 10000);
        });
        expect(browser.getLocationAbsUrl()).toMatch('/owner/home');
    })

    it('parker successful sign up', function() {
        name.sendKeys("Parker Test");
        email.sendKeys('anotherParker5@gmail.com');
        password.sendKeys('password123');
        parker.click();
        signUpButton.click().then(function(){
            return browser.driver.wait(function() {
              return browser.driver.getCurrentUrl().then(function(url) {
                return /parker/.test(url);
              });
            }, 10000);
        });
        expect(browser.getLocationAbsUrl()).toMatch('/parker/parkerSearch');
    })
});
