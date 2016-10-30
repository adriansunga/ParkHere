// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js


//noodlio pay ish

var NOODLIO_PAY_API_URL         = "https://noodlio-pay.p.mashape.com";
var NOODLIO_PAY_API_KEY         = "hkou9g9rVgmshTeafr21FodTUdsip1Gsko3jsn8G4LLowC6ReO";
var STRIPE_ACCOUNT_ID           = "acct_197dO3BnddH3DZLG";
var TEST_MODE = true; //false for production mode
var NOODLIO_PAY_CHECKOUT_KEY    = {test: "pk_test_QGTo45DJY5kKmsX21RB3Lwvn", live: "pk_live_ZjOCjtf1KBlSHSyjKDDmOGGE"};

angular.module('starter', ['ionic', 'ui.router','ionic-timepicker','ionic-ratings', 'ionic-datepicker','stripe.checkout',  'starter.controllers',  'starter.services'])
.run(function($ionicPlatform) {

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    Parse.initialize("com.team3.parkhere");
    Parse.serverURL = 'http://138.68.43.212:1337/parse';
    var currentUser = Parse.User.current();
    

  });
})

.config(function($stateProvider, $urlRouterProvider, StripeCheckoutProvider) {
  switch (TEST_MODE) {
    case true:
      //
      StripeCheckoutProvider.defaults({key: NOODLIO_PAY_CHECKOUT_KEY['test']});
      break
    default:
      //
      StripeCheckoutProvider.defaults({key: NOODLIO_PAY_CHECKOUT_KEY['live']});
      break
  };
  
  $stateProvider
    .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })
  .state('signUp', {
    url: '/signup',
    templateUrl: 'templates/signUp.html',
    controller: 'signUpCtrl'
  })
  .state('parker', {
    url: '/parker',
    templateUrl: 'templates/parkerMenu.html',
    controller: 'parkerMenuCtrl'
  })
  .state('parker.search', {
    url: '/parkerSearch',
    views: {
      'side-menu21': {
        templateUrl: 'templates/parkingSearch.html',
        controller: 'parkerSearchCtrl'
      }
    },
    
  })
   .state('parker.paypal', {
    url: '/paypal',
    views: {
      'side-menu21': {
        templateUrl: 'templates/paypal.html',
        controller: 'paypalCtrl'
      }
    },
    
  })
  .state('owner', {
    url: '/owner',
    templateUrl: 'templates/ownerMenu.html',
    controller: 'ownerMenuCtrl'
  })
  .state('owner.home', {
    url: '/home',
    cache: false,
    views: {
      'side-menu21': {
        templateUrl: 'templates/ownerHome.html',
        controller: 'ownerHomeCtrl'
      }
    }
    
  })
  .state('owner.addSpace', {
    url: '/addSpace',
    cache: false,
    views: {
      'side-menu21': {
        templateUrl: 'templates/ownerAddSpace.html',
        controller: 'ownerAddSpaceCtrl'
      }
    }
    
  })
    .state('owner.spaceInfo', {
    url: '/spaceInfo',
    cache: false,
    views: {
      'side-menu21': {
        templateUrl: 'templates/ownerSpaceInfo.html',
        controller: 'ownerSpaceInfoCtrl'
      }
    }
  })
  .state('owner.payment', {
    url: '/payment',
    views: {
      'side-menu21': {
        templateUrl: 'templates/payment.html',
        controller: 'ownerPayCtrl'
      }
    },
    resolve: {
      // checkout.js isn't fetched until this is resolved.
      stripe: StripeCheckoutProvider.load
    }
    
  })
   .state('parker.pay', {
    url: '/pay',
    views: {
      'side-menu21': {
        templateUrl: 'templates/parkerPay.html',
        controller: 'parkerPayCtrl'
      }
    },
    resolve: {
      // checkout.js isn't fetched until this is resolved.
      stripe: StripeCheckoutProvider.load
    }
    
  })

  .state('owner.profile', {
    url: '/profile',
    views: {
      'side-menu21': {
        templateUrl: 'templates/ownerProfile.html'
        //controller: 'ownerAddSpaceCtrl'
      }
    },
    
  })

$urlRouterProvider.otherwise('/login');
  
});



angular.module('starter.services', [])

.factory('StripeCharge', function($q, $http, StripeCheckout) {
  var self = this;
  
  // add the following headers for authentication
  $http.defaults.headers.common['X-Mashape-Key']  = NOODLIO_PAY_API_KEY;
  $http.defaults.headers.common['Content-Type']   = 'application/x-www-form-urlencoded';
  $http.defaults.headers.common['Accept']         = 'application/json';

  /**
   * Connects with the backend (server-side) to charge the customer
   *
   * # Note on the determination of the price
   * In this example we base the $stripeAmount on the object ProductMeta which has been
   * retrieved on the client-side. For safety reasons however, it is recommended to
   * retrieve the price from the back-end (thus the server-side). In this way the client
   * cannot write his own application and choose a price that he/she prefers
   */
  self.chargeUser = function(stripeToken, ProductMeta) {
    var qCharge = $q.defer();

    var chargeUrl = NOODLIO_PAY_API_URL + "/charge/token";
    
    var param = {
      source: stripeToken,
      amount: Math.floor(ProductMeta.priceUSD*100), // amount in cents
      currency: "usd",
      description: "Your custom description here",
      stripe_account: STRIPE_ACCOUNT_ID,
      test: TEST_MODE,
    };
    
    $http.post(NOODLIO_PAY_API_URL + "/charge/token", param)
    .success(
      function(StripeInvoiceData){
        qCharge.resolve(StripeInvoiceData);
        // you can store the StripeInvoiceData for your own administration
      }
    )
    .error(
      function(error){
        console.log(error)
        qCharge.reject(error);
      }
    );
    return qCharge.promise;
  };


  /**
   * Get a stripe token through the checkout handler
   */
  self.getStripeToken = function(ProductMeta) {
    var qToken = $q.defer();

    var handlerOptions = {
        name: ProductMeta.title,
        description: ProductMeta.description,
        amount: Math.floor(ProductMeta.priceUSD*100),
        image: "img/perry.png",
    };

    var handler = StripeCheckout.configure({
        name: ProductMeta.title,
        token: function(token, args) {
          //console.log(token.id)
        }
    })

    handler.open(handlerOptions).then(
      function(result) {
        var stripeToken = result[0].id;
        if(stripeToken != undefined && stripeToken != null && stripeToken != "") {
            //console.log("handler success - defined")
            qToken.resolve(stripeToken);
        } else {
            //console.log("handler success - undefined")
            qToken.reject("ERROR_STRIPETOKEN_UNDEFINED");
        }
      }, function(error) {
        if(error == undefined) {
            qToken.reject("ERROR_CANCEL");
        } else {
            qToken.reject(error);
        }
      } // ./ error
    ); // ./ handler
    return qToken.promise;
  };


  return self;
});





