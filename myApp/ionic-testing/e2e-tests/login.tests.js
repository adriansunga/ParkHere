describe('Clicking on the login button ', function(){  
    var parker, username, password;
    beforeEach(function() {
        browser.get('/#/login');
        username = element(by.model('data.username'));
        password = element(by.model('data.password'));
        parker = element(by.id('login-radio1'));
        owner = element(by.id('login-radio3'));
        loginButton = element(by.id('login-button1'));
    });

   it('should display an error for an unsuccessful login', function() {
        username.sendKeys('badtest@gmail.com');
        password.sendKeys('password123');
        owner.click();
        loginButton.click().then(function() {
            expect(browser.getLocationAbsUrl()).toMatch('/login');
            expect(element(by.id('invalid')).getText()).toEqual('Login failed, please try again');
        });
    });
   it('with OWNER should validate the credentials for a successful login and display owner home', function() {
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
       expect(browser.getLocationAbsUrl()).toMatch('/owner/home');
       
    })

     it('with PARKER should validate the credentials for a successful login and display parker search', function() {
        var thisUsername = 'parker@gmail.com';
        username.sendKeys(thisUsername);
        password.sendKeys('parkerparker5');
        var parkerVar = 'parker';
        parker.click();
        
        loginButton.click().then(function(){
            return browser.driver.wait(function() {
              return browser.driver.getCurrentUrl().then(function(url) {
                return /parker/.test(url);
              });
            }, 10000);
            
        });
       expect(browser.getLocationAbsUrl()).toMatch('/parker/parkerSearch');
       
    })

    //
    // it('should take you to sign up on "or create an acount" clicked', function() {
    //     createAccountButton.click().then(function(){
    //       return browser.driver.wait(function() {
    //         return browser.driver.getCurrentUrl().then(function(url) {
    //           console.log("url  " + url);
    //           return /owner/.test(url);
    //         });
    //       }, 10000);
    //
    //   });
    //  expect(browser.getLocationAbsUrl()).toMatch('/signUp');
    // })
});
