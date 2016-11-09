describe('ParkerSearch', function(){  
    var thisUsername;
    beforeEach(function() {
        browser.get('/#/login');
        username = element(by.model('data.username'));
        password = element(by.model('data.password'));
        parker = element(by.id('login-radio1'));
        owner = element(by.id('login-radio3'));
        loginButton = element(by.id('login-button1'));
        thisUsername = 'anotherParker2@gmail.com';
        username.sendKeys(thisUsername);
        password.sendKeys('password123');
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
        //insert address
        element(by.id('searchTextBox')).sendKeys('255 N D St, San Bernardino, CA 92401, USA');
        element(by.id('setTimeButton')).click();
        element.all(by.repeater("button in buttons")).get(0).click();
        element.all(by.repeater("button in buttons")).get(0).click();
        element.all(by.repeater("button in buttons")).get(0).click();
        element(by.css('.col-25')).element(by.css('.button')).click();
        element.all(by.repeater("button in buttons")).get(0).click();
        //should redirect to parking space results
        element(by.id('parkingSearch-button')).click().then(function(){
            return browser.driver.wait(function() {
              return browser.driver.getCurrentUrl().then(function(url) {
                return /parkingSearchResults/.test(url);
              });
            }, 10000);
        });
        var rep = 'parkingSpace in parkingSpaces';
        var address = element.all(by.repeater(rep)).get(0);
        var addressString = address.getText();
        expect(addressString).toContain("American Heritage University of Southern California, 255 N D St, San Bernardino, CA 92401, USA");
       
    }) 
   it('search should search within 3 miles', function() {
        element(by.id('searchTextBox')).sendKeys('69 E Central Ave, San Bernardino, CA  92408');
        element(by.id('setTimeButton')).click();
        element.all(by.repeater("button in buttons")).get(0).click();
        element.all(by.repeater("button in buttons")).get(0).click();
        element.all(by.repeater("button in buttons")).get(0).click();
        element(by.css('.col-25')).element(by.css('.button')).click();
        element.all(by.repeater("button in buttons")).get(0).click();
        //should redirect to parking space results
        element(by.id('parkingSearch-button')).click().then(function(){
            return browser.driver.wait(function() {
              return browser.driver.getCurrentUrl().then(function(url) {
                return /parkingSearchResults/.test(url);
              });
            }, 10000);
        });
        var rep = 'parkingSpace in parkingSpaces';
        var address = element.all(by.repeater(rep)).get(0);
        var addressString = address.getText();
        expect(addressString).toContain("American Heritage University of Southern California, 255 N D St, San Bernardino, CA 92401, USA");
       
    })
    it('search failure should produce a warning', function() {
    
        //insert address
        element(by.id('searchTextBox')).sendKeys('1111 North Pole');
        element(by.id('setTimeButton')).click();
        element.all(by.repeater("button in buttons")).get(0).click();
        element.all(by.repeater("button in buttons")).get(0).click();
        element.all(by.repeater("button in buttons")).get(0).click();
        element(by.css('.col-25')).element(by.css('.button')).click();
        element.all(by.repeater("button in buttons")).get(0).click();
        
        element(by.id('parkingSearch-button')).click().then(function(){
            return browser.driver.wait(function() {
              return browser.driver.getCurrentUrl().then(function(url) {
                return /parkingSearchResults/.test(url);
              });
            }, 10000);
        });
        var noResults = element(by.id("noResults")).getText();
        expect(noResults).toEqual("No results matched your search");
       
    })

});