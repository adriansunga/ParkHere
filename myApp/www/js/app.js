// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var example = angular.module('starter', ['ionic', 'ionic-timepicker','ionic-ratings', 'ionic-datepicker', 'starter.controllers'])
example.run(function($ionicPlatform) {
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

    Parse.initialize("parkHere");
    Parse.serverURL = 'http://138.68.43.212:1337/parse';

  });
})



example.controller("ExampleController", function($scope) {
 
    $scope.savePerson = function(firstname, lastname) {
        var PeopleObject = Parse.Object.extend("PeopleObject");
        var person = new PeopleObject();
        person.set("firstname", firstname);
        person.set("lastname", lastname);
        person.save(null, {});
    };

    $scope.getPeople = function(params) {
    var PeopleObject = Parse.Object.extend("PeopleObject");
    var query = new Parse.Query(PeopleObject);
    if(params !== undefined) {
        if(params.lastname !== undefined) {
            query.equalTo("lastname", params.lastname);
        }
        if(params.firstname !== undefined) {
            query.equalTo("firstname", params.lastname);
        }
    }
    query.find({
        success: function(results) {
            alert("Successfully retrieved " + results.length + " people!");
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                console.log(object.id + ' - ' + object.get("firstname") + " " + object.get("lastname"));
            }
        },
        error: function(error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
};
 
});

example.config(function($stateProvider, $urlRouterProvider) {

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
    views: {
      'side-menu21': {
        templateUrl: 'templates/ownerHome.html',
        controller: 'ownerHomeCtrl'
      }
    }
    
  })
  .state('owner.addSpace', {
    url: '/addSpace',
    views: {
      'side-menu21': {
        templateUrl: 'templates/ownerAddSpace.html',
        controller: 'ownerAddSpaceCtrl'
      }
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

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});

angular.module('time', ['ionic', 'ionic-timepicker'])
