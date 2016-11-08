describe('ParkerSearch', function(){  
    var thisUsername;
    beforeEach(function() {
        browser.get('/#/login');
        username = element(by.model('data.username'));
        password = element(by.model('data.password'));
        parker = element(by.id('login-radio1'));
        owner = element(by.id('login-radio3'));
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

    it('search should produce the correct space', function() {
        expect(2).toEqual(2);
        //insert address
        element(by.id('searchTextBox')).sendKeys('255 N D St, San Bernardino, CA 92401, USA');
        //the car is of type compact
        element.all(by.model('data2.searchType')).get(2).click();
        browser.pause();
        //insert times (nov 8, times 1 to 2) here, then input c to continue test
        //should redirect to parking space results
        element(by.id('parkingSearch-button')).click().then(function(){
            return browser.driver.wait(function() {
              return browser.driver.getCurrentUrl().then(function(url) {
                return /parkingSearchResults/.test(url);
              });
            }, 10000);
        });
        var address = element.all(by.repeator('parkingSpace in parkingSpaces')).first().element.get(by.model(parkingSpace.get("address")));
        expect(address.getText()).toEqual("American Heritage University of Southern California, 255 N D St, San Bernardino, CA 92401, USA");
       
    })
    it('search should search within 3 miles', function() {
        
        //insert address
        element(by.id('searchTextBox')).sendKeys('69 E Central Ave, San Bernardino, CA  92408');
        //the car is of type compact
        element.all(by.model('data2.searchType')).get(2).click();
        browser.pause();
        //insert times (nov 8, times 1 to 2) here, then input c to continue test
        //should redirect to parking space results
        element(by.id('parkingSearch-button')).click().then(function(){
            return browser.driver.wait(function() {
              return browser.driver.getCurrentUrl().then(function(url) {
                return /parkingSearchResults/.test(url);
              });
            }, 10000);
        });
        var address = element.all(by.repeator('parkingSpace in parkingSpaces')).first().element.get(by.model(parkingSpace.get("address")));
        expect(address.getText()).toEqual("American Heritage University of Southern California, 255 N D St, San Bernardino, CA 92401, USA");
       
    })
    it('search failure should produce a warning', function() {
        //insert address
        element(by.id('searchTextBox')).sendKeys('1111 North Pole');
        //the car is of type compact
        element.all(by.model('data2.searchType')).get(0).click();
        browser.pause();
        //insert times (nov 8, times 1 to 2) here, then input c to continue test
        //should redirect to parking space results
        element(by.id('parkingSearch-button')).click().then(function(){
            return browser.driver.wait(function() {
              return browser.driver.getCurrentUrl().then(function(url) {
                return /parkingSearchResults/.test(url);
              });
            }, 10000);
        });
        expect(element(by.id(noResults)).toEqual("No reuslts matched your search");
       
    })

});