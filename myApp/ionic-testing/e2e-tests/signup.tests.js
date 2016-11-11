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

    it('should fail with insecure password', function() {
        name.sendKeys("Testing Test");
        email.sendKeys('smallPassTest@gmail.com');
        password.sendKeys('fail');
        parker.click();
        signUpButton.click().then(function() {
            expect(element(by.id('invalidSignUp'))
                .getText()).toEqual('Your password must contain a'
                + ' number and be longer than 10 characters, please try again');
        });
    })

    it('should fail without a usertype selected', function() {
        name.sendKeys("Testing Test");
        email.sendKeys('badTest@gmail.com');
        password.sendKeys('failme123');
        signUpButton.click().then(function() {
            expect(element(by.id('invalidSignUp'))
                .getText()).toEqual('Please select parker or owner');
        });
    })

    it('signup with email already in database', function() {
        name.sendKeys("Test Four");
        email.sendKeys('test@gmail.com');
        password.sendKeys('password123');
        owner.click();
        signUpButton.click().then(function() {
            expect(element(by.id('invalid')).getText()).toEqual('');
        });
    });
});

