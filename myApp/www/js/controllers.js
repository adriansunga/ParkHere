
angular.module('starter.controllers', [])

//this is example code yay!

.controller("ExampleController", function($scope) {
 
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
 
})
//LogIn Controller
.controller('LoginCtrl', function($scope, $ionicPopup, $state) {
    $scope.data = {};
     console.log("in login controller");
    $scope.login = function() {

      var username = ""+ $scope.data.username;
      var password = ""+ $scope.data.password;
      var userType = document.querySelector('input[name = "loginType"]:checked');
      console.log(username);
      console.log(password);
      var div = document.getElementById('invalid');
      if(userType == null){
          div.innerHTML = 'Please select parker or owner';
          return;
      }
      userType = userType.value;
      console.log(userType);
      
      if(password.length == 0 ||  username.length == 0){
          div.innerHTML = 'Please insert all fields';
          return;
      }
      div.innerHTML = '';
      Parse.User.logIn(username, password,{
        success: function(user) {
          if(user.userType != userType){
            div.innerHTML = 'You have not signed up with this user type';
            if(userType == 'parker'){
              $state.go("parker.search");
            }else if(userType == 'owner'){
              $state.go("owner.home")
            }
          }

        },
        error: function(user, error) {
          div.innerHTML = 'Login failed, please try again';
        }

      });
      
      
    }

    $scope.signUpClicked = function() {
      console.log("sign up clicked");
      $state.go("signUp");
    }

})
.service('user', function() {
  var user = this;
  user = {};
  user.username = '';
  user.email = '';
  user.password = '';  
  user.userType = '';
  return user;
})
//SignUp Controller
.controller('signUpCtrl', function($scope, $ionicPopup, $state, user) {
  $scope.data = {};
  $scope.signUp = function(){

    var username = ""+ $scope.data.username;
    var email = "" +  $scope.data.email;
    var password = ""+ $scope.data.password;
    var userType = document.querySelector('input[name = "signUpType"]:checked');
    console.log(email);
    console.log(password);
    if(userType == null){
      var div = document.getElementById('invalid');
        div.innerHTML = 'Please select parker or owner';
        return;
    }
    userType = userType.value;
    console.log(userType);
    var div = document.getElementById('invalid');
    if(password == "undefined" ||  username == "undefined" || email == "undefined" ){
        //invalid login
        div.innerHTML = 'Please insert all fields';
        return;
    }
    console.log("here-1");
    //fix this reg ex!!!!
    if(password.length < 10 || password.search(/\d/) == -1 ){
          //invalid login
          div.innerHTML = 'Your password must contain a number and be longer than 10 characters, please try again';
          return;
    }
    div.innerHTML = '';
    var parseUser = new Parse.User();
    //we use the email as the username to sign them in
    parseUser.set("username", email);
    user.username = username;
    parseUser.set("name", username);
    user.email = email;
    parseUser.set("password", password);
    user.password = password;
    //owner or parker
    parseUser.set("userType", userType);
    user.userType = userType;
    //send over to parse
    console.log("here2");
    parseUser.signUp(null, {
      success: function(user) {
        if(userType == "owner"){
            $state.go("owner.home");
          }else{
            $state.go("parker.search");
          }
      },
      error: function(user, error) {
        // Show the error message somewhere and let the user try again.
        console.log(error.message);
        if(error.message == "invalid session token"){
          parseUser.logOut();
          div.innerHTML = "Somethined went wrong, please try again";
        }
        if(error.message == "UserEmailTaken"){
            div.innerHTML = user.email +' already exists please try another email';
          }else{
            div.innerHTML = "Somethined went wrong, please try again";
          }
      }
    });
  }

})


.controller('parkerMenuCtrl', function($scope, $ionicPopup, $state, $ionicLoading, $ionicHistory) {
  $scope.search = function() {
    console.log("search clicked");
    $state.go("parker.search");
  }
  $scope.payment = function() {
      console.log("payment clicked");
      $state.go("parker.paypal");
    }
  $scope.showLogout = function() {
    console.log("in show logout");
   var confirmPopup = $ionicPopup.confirm({
     title: 'Logout',
     template: 'Are you sure you want to Logout?'
   });

   confirmPopup.then(function(res) {
     if(res) {
       console.log('You are sure');
       //logout
        $ionicLoading.hide();
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
        $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
        var currentUser = Parse.User.current(); 
        cuurentUser.logOut();
        Parse.User.logOut();
        $state.go('login');
     } else {
       console.log('You are not sure');
     }
   });
 };
})

.controller('parkerSearchCtrl', function($scope, $ionicPopup, $state, ionicTimePicker, ionicDatePicker) {

  // $scope.goSearchResults = function(){
  //   $state.go("parker.searchResults");
  // }

  var timeSlots = 0;

    var startDate;
    var startTime;
    var endDate;
    var endTime;
  $scope.openTimePicker = function(){
    //date picker
    //variables we need to send to the back end

    var allTimeSlots = [];

    var startDateObj = {
      callback: function (val) {  //Mandatory
        
        startDate = new Date(val);
        console.log('Return value from the datepicker popup is : ' + val, new Date(val));
        ionicTimePicker.openTimePicker(setFirstTime);
      },

      from: new Date(),
      inputDate: new Date(),   
      mondayFirst: true,       
      setLabel: 'Set Start Date' 
    };

    ionicDatePicker.openDatePicker(startDateObj);
    

    //time picker
    
    console.log("Open timepicker");
      var setFirstTime = {
      callback: function (val) {      //Mandatory
        if (typeof (val) === 'undefined') {
          console.log('Time not selected');
        } else {
          /*console.log('Selected epoch is : ', val, 'and the time is ',
           selectedTime.getUTCHours(), 'H :', selectedTime.getUTCMinutes(), 'M');*/
          startTime = new Date(val * 1000);
          var endDateObj = {
          callback: function (val) {  //Mandatory
            
            endDate = new Date(val);
            console.log('Return value from the datepicker popup is : ' + val, new Date(val));
            ionicTimePicker.openTimePicker(setSecondTime);
          },

      from: startDate,
      inputDate: startDate,   
      mondayFirst: true,          
      setLabel: 'Set End Date' 
    };
          ionicDatePicker.openDatePicker(endDateObj);
        }
      },
      inputTime: ((new Date()).getHours() * 60 * 60),   
      format: 24,         
      step: 60,           
      setLabel: 'Set Start Time'    
    };
    var setSecondTime = {
      callback: function (val) {      //Mandatory
        if (typeof (val) === 'undefined') {
          console.log('Time not selected');
        } else {
          endTime = new Date(val * 1000);
          if(startTime.getUTCMinutes() < 10){
            var numMinutes = '0' + startTime.getUTCMinutes();
          }else{
            var numMinutes = startTime.getUTCMinutes();
          }
          if(endTime.getUTCMinutes() < 10){
            var endNumMinutes = '0' + endTime.getUTCMinutes();
          }else{
            var endNumMinutes = endTime.getUTCMinutes();
          }
          var addDiv = document.getElementById('spaceSearchTimeList');
          startDate.setHours(startDate.getHours() + startTime.getHours());
          endDate.setHours(endDate.getHours() + endTime.getHours());
          console.log(startDate + " end " + endDate);
          if(endDate <= startDate){
            //popup modal
            var alertPopup = $ionicPopup.alert({
               title: "Your end date and time must be after your start",
               //template: 'It might taste good'
             });
            return;
          }
          timeSlots = timeSlots + 1;
          //should check if times overlap here
          var startDateStr = (startDate.getMonth() + 1) + '/' + startDate.getDate() + '/' +  startDate.getFullYear();
          var endDateStr = (endDate.getMonth() + 1) + '/' + endDate.getDate() + '/' +  endDate.getFullYear();
          addDiv.innerHTML += '<ion-item class="item-thumbnail-left"> <h4>Timeslot: '+ timeSlots + '</h4> <p>Start: ' + startDateStr + " "+ startTime.getUTCHours()+':'+ numMinutes+ '</p> <p>End: ' + endDateStr + " "+ endTime.getUTCHours()+':'+ endNumMinutes+ '</p></ion-item>';
          var dict = {'startDate':startDate, 'startTime':startTime.getUTCHours(), 'endDate': endDate, 'endTime':endTime.getUTCHours()};
          allTimeSlots.push(dict);
          console.log(allTimeSlots);
        }
      },
      inputTime: ((new Date()).getHours() * 60 * 60),   
      format: 24,         
      step: 60,           
      setLabel: 'Set End Time'    
    };

    
  }


  $scope.findParkingSpaces = function(){
    var address = document.getElementById('searchTextBox').value;
    var geocoder = new google.maps.Geocoder();
    var latitude;
    var longitude;

    //log all values here
    console.log("start date = " + (startDate.getMonth() + 1) + '/' + startDate.getDate() + '/' +  startDate.getFullYear());
    console.log("start time = " +startTime.getUTCHours());
    console.log('end date = ' + (endDate.getMonth() + 1) + '/' + endDate.getDate() + '/' +  endDate.getFullYear());
    console.log("end time = " +endTime.getUTCHours());
    console.log("address = " + address);
    
    var div = document.getElementById('invalid')

    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        latitude = results[0].geometry.location.lat();
        longitude = results[0].geometry.location.lng();
        console.log("lat = " + latitude);
        console.log("longitude = " + longitude);
      } else {
        console.log("geo error " +status);
        div.innerHTML = 'Something went wrong, please try again';
      }
    });

    // QUERY BELOW ALMOST WORKS. PLZ FIX DONT REIMPLEMENT.

    // var myGeoPoint = new Parse.GeoPoint({latitude: latitude, longitude: longitude});
    // var PlaceObject = Parse.Object.extend("PlaceObject");
    // var query = new Parse.Query(PlaceObject);
    // query.near("location", myGeoPoint);
    // query.withinMiles(30);
    // // successful object list
    // var placesObjects;
    // query.find({
    // success: function(placesObjects) {
    // }
    // });
    // console.log("place objects: " + placesObjects);

  }

})


//getting payment token for owner
.controller('ownerPayCtrl', function($scope, $ionicPopup, $state, StripeCharge, $http) {
 // add the following headers for authentication
  $http.defaults.headers.common['X-Mashape-Key']  = NOODLIO_PAY_API_KEY;
  $http.defaults.headers.common['Content-Type']   = 'application/x-www-form-urlencoded';
  $http.defaults.headers.common['Accept']         = 'application/json';
  
  $scope.FormData = {
    number: "",
    cvc: "",
    exp_month: "",
    exp_year: "",
    test: TEST_MODE, 
  };
  
  $scope.createToken = function() {
    
    // init for the DOM
    $scope.ResponseData = {
      loading: true
    };
    
    // create a token and validate the credit card details
    $http.post(NOODLIO_PAY_API_URL + "/tokens/create", $scope.FormData)
    .success(
      function(response){
        
        // --> success
        console.log(response)
        
        if(response.hasOwnProperty('id')) {
          var token = response.id; $scope.ResponseData['token'] = token;
          proceedCharge(token);
        } else {
          $scope.ResponseData['token'] = 'You did not input all fields properly, please try again';
          $scope.ResponseData['loading'] = false;
        };

      }
    )
    .error(
      function(response){
        console.log(response)
        $scope.ResponseData['token'] = 'You did not input all fields properly, please try again';
        $scope.ResponseData['loading'] = false;
      }
    );
  };
  
  // charge the customer with the token
  function proceedCharge(token) {
    
    var param = {
      source: token,
      amount: 100,
      currency: "usd",
      description: "Your custom description here",
      stripe_account: STRIPE_ACCOUNT_ID,
      test: TEST_MODE,
    };
    
    $http.post(NOODLIO_PAY_API_URL + "/charge/token", param)
    .success(
      function(response){
        
        // --> success
        console.log(response);
        $scope.ResponseData['loading'] = false;
        
        if(response.hasOwnProperty('id')) {
          var paymentId = response.id; $scope.ResponseData['paymentId'] = paymentId;
        } else {
          $scope.ResponseData['paymentId'] = 'Error, see console';
        };
        
      }
    )
    .error(
      function(response){
        console.log(response)
        $scope.ResponseData['paymentId'] = 'Error, see console';
        $scope.ResponseData['loading'] = false;
      }
    );
  };
  
})


//where we set up the payment... should be for parker 
.controller('parkerPayCtrl', function($scope, $ionicPopup, $state, StripeCharge) {
    $scope.ProductMeta = {
    title: "Awesome product",
    description: "Yes it really is",
    priceUSD: 1,
  };

  $scope.status = {
    loading: false,
    message: "",
  };

  $scope.charge = function() {

    $scope.status['loading'] = true;
    $scope.status['message'] = "Retrieving your Stripe Token...";

    // first get the Stripe token
    StripeCharge.getStripeToken($scope.ProductMeta).then(
      function(stripeToken){
        // -->
        proceedCharge(stripeToken);
      },
      function(error){
        console.log(error)

        $scope.status['loading'] = false;
        if(error != "ERROR_CANCEL") {
          $scope.status['message'] = "Oops... something went wrong";
        } else {
          $scope.status['message'] = "";
        }
      }
    ); // ./ getStripeToken

    function proceedCharge(stripeToken) {

      $scope.status['message'] = "Processing your payment...";

      // then chare the user through your custom node.js server (server-side)
      StripeCharge.chargeUser(stripeToken, $scope.ProductMeta).then(
        function(StripeInvoiceData){
          
          if(StripeInvoiceData.hasOwnProperty('id')) {
            $scope.status['message'] = "Success! Check your Stripe Account";
          } else {
            $scope.status['message'] = "Error, check your console";
          };
          $scope.status['loading'] = false;
          console.log(StripeInvoiceData)
        },
        function(error){
          console.log(error);

          $scope.status['loading'] = false;
          $scope.status['message'] = "Oops... something went wrong";
        }
      );

    }; // ./ proceedCharge

  };
})

//owner controller
.controller('ownerMenuCtrl', function($scope, $ionicPopup, $state, $ionicLoading, $ionicHistory) {
  $scope.addSpace = function(){
    $state.go("owner.addSpace");
  }
  $scope.goHome = function(){
    $state.go("owner.home");
  }
  $scope.goProfile = function(){
    $state.go("owner.profile");
  }
  $scope.payment = function() {
      $state.go("owner.payment");
    }
    //rating
  $scope.ratingsObject = {
        iconOn : 'ion-ios-star',
        iconOff : 'ion-ios-star-outline',
        iconOnColor: 'rgb(251, 212, 1)',
        iconOffColor:  'rgb(224, 224, 224)',
        rating:  5,
        minRating:1,
        readOnly: true,
        callback: function(rating) {
          $scope.ratingsCallback(rating);
        }
      };

  $scope.ratingsCallback = function(rating) {
        console.log('Selected rating is : ', rating);
    };
 

  //logout 
  $scope.showLogout = function() {
    console.log("in show logout");
   var confirmPopup = $ionicPopup.confirm({
     title: 'Logout',
     template: 'Are you sure you want to Logout?'
   });

   confirmPopup.then(function(res) {
     if(res) {
       console.log('You are sure');
       //logout
        $ionicLoading.hide();
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
        $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
        $state.go('login');
     } else {
       console.log('You are not sure');
     }
   });
 };
})

.controller('UploadController', function ($scope){
  var imageUpload = new ImageUpload();
  $scope.file = {};
  $scope.upload = function() {
    imageUpload.push($scope.file, function(data){
      console.log('File uploaded Successfully', $scope.file, data);
      $scope.uploadUri = data.url;
      $scope.$digest();
    });
  };
})

.service('parkingSpace', function() {
  var parkingSpace = this;
  parkingSpace = {};
  parkingSpace.title = '';
  parkingSpace.price = '';
  parkingSpace.uniqueID = '';  
  parkingSpace.parkerName = '';
  parkingSpace.parkerContactInfo = '';
  return parkingSpace;
})

.controller('ownerHomeCtrl', function($scope, $ionicPopup, $state, parkingSpace) {
  $scope.onItemDelete = function(item) {
    //need to check if we can delete it
    var confirmPopup = $ionicPopup.confirm({
     title: 'Delete ' + item.title,
     template: 'Are you sure you want to delete ' + item.title +'?'
   });

   confirmPopup.then(function(res) {
     if(res) {
       //delete (need to go to server)
       $scope.items.splice($scope.items.indexOf(item), 1);
     } else {
       console.log('You are not sure delete ' + item.title);
     }
   });
    
  };
  $scope.edit = function(item) {
    
    parkingSpace.title = item.title;
    parkingSpace.price = item.price;
    parkingSpace.uniqueID = item.uniqueID;
    console.log("in edit function", parkingSpace.title);
    $state.go('owner.spaceInfo');
  };
  //ask for owner items 
  $scope.items = [
    { id: 0, title: "Parking Space 1", price: 20, uniqueID: '3924pw4hi'},
    { id: 1, title: "Test Space 2", price: 30, uniqueID: '1p29u3irhwejln' },
    { id: 2,title: "Sara is Cool", price: 100, uniqueID: '29u42i3wrehlj' }];
 
})

.controller('ownerSpaceInfoCtrl', function($scope, $ionicPopup, $state, $stateParams, parkingSpace) {

  $scope.parkingSpace = parkingSpace;
  console.log("in owner space " + parkingSpace.title);
 
})

.controller('ownerAddSpaceCtrl', function($scope, $ionicPopup, $state, ionicTimePicker, ionicDatePicker) {
  //controller is not being added
  $scope.data = {};
  //array to hold all timeslots, each timeslot will be a dictionary of startTime: , startDate: etc.
  var allTimeSlots = [];

  $scope.addSpace = function(){
      
      var parkingSpaceName = $scope.data.spaceName;
      var price = $scope.data.price;
      var address = $scope.data.address;
      var notes = $scope.data.notes;
      var type = $scope.data.type;
      var latitude;
      var longitude;
      var picFile;
      console.log("type: " + type);
      console.log(address);
      var div = document.getElementById('addSpaceInvalid');
      if(type === 'undefined' || parkingSpaceName=== 'undefined' ||  price=== 'undefined'|| address=== 'undefined' || picFile === 'undefined'){
          //invalid login
          console.log("here");
          div.innerHTML = 'Please insert all required fields';
          return;
      }
      console.log("here");
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          console.log(results[0]);
            latitude = results[0].geometry.location.lat();
            longitude = results[0].geometry.location.lng();
            console.log("lat " + latitude+ " longitude " + longitude);
        } else {
            console.log("geo error " +status);
            div.innerHTML = 'Something went wrong, please try again';
          }
      }); 
      //save in date database by hour
      var parseFile = new Parse.File(name, file);
      parseFile.save().then(function() {
      // The file has been saved to Parse.
      }, function(error) {
      // The file either could not be read, or could not be saved to Parse.
      });
      parkingSpace.set("picture", parseFile);
      //for each dic in allTimes,
      //for each time frame in each dict
      //parse ish
      var point = new Parse.GeoPoint({latitude: latitude, longitude: longitude});
     
  }
   //image uploader
  var imageUploader = new ImageUploader();
  $scope.file = {};
  $scope.upload = function() {
    imageUploader.push($scope.file, function(data){
      console.log('File uploaded Successfully', $scope.file, data);
      $scope.uploadUri = data.url;
      $scope.$digest();
      picFile = $scope.file;
    });
  };
  var timeSlots = 0;
  $scope.openTimePicker = function(){
    //date picker
    //variables we need to send to the back end
    var startDate;
    var startTime;
    var endDate;
    var endTime;
    var startDateObj = {
      callback: function (val) {  //Mandatory
        
        startDate = new Date(val);
        console.log('Return value from the datepicker popup is : ' + val, new Date(val));
        ionicTimePicker.openTimePicker(setFirstTime);
      },

      from: new Date(),
      inputDate: new Date(),   
      mondayFirst: true,       
      setLabel: 'Set Start Date' 
    };

    ionicDatePicker.openDatePicker(startDateObj);
    

    //time picker
    
    console.log("Open timepicker");
      var setFirstTime = {
      callback: function (val) {      //Mandatory
        if (typeof (val) === 'undefined') {
          console.log('Time not selected');
        } else {
          /*console.log('Selected epoch is : ', val, 'and the time is ',
           selectedTime.getUTCHours(), 'H :', selectedTime.getUTCMinutes(), 'M');*/
          startTime = new Date(val * 1000);
          var endDateObj = {
          callback: function (val) {  //Mandatory
            
            endDate = new Date(val);
            console.log('Return value from the datepicker popup is : ' + val, new Date(val));
            ionicTimePicker.openTimePicker(setSecondTime);
          },

      from: startDate,
      inputDate: startDate,   
      mondayFirst: true,          
      setLabel: 'Set End Date' 
    };
          ionicDatePicker.openDatePicker(endDateObj);
        }
      },
      inputTime: ((new Date()).getHours() * 60 * 60),   
      format: 24,         
      step: 60,           
      setLabel: 'Set Start Time'    
    };
    var setSecondTime = {
      callback: function (val) {      //Mandatory
        if (typeof (val) === 'undefined') {
          console.log('Time not selected');
        } else {
          endTime = new Date(val * 1000);
          if(startTime.getUTCMinutes() < 10){
            var numMinutes = '0' + startTime.getUTCMinutes();
          }else{
            var numMinutes = startTime.getUTCMinutes();
          }
          if(endTime.getUTCMinutes() < 10){
            var endNumMinutes = '0' + endTime.getUTCMinutes();
          }else{
            var endNumMinutes = endTime.getUTCMinutes();
          }
          var addDiv = document.getElementById('addSpaceList');
          startDate.setHours(startDate.getHours() + startTime.getHours());
          endDate.setHours(endDate.getHours() + endTime.getHours());
          console.log(startDate + " end " + endDate);
          if(endDate <= startDate){
            //popup modal
            var alertPopup = $ionicPopup.alert({
               title: "Your end date and time must be after your start",
               //template: 'It might taste good'
             });
            return;
          }
          timeSlots = timeSlots + 1;
          //should check if times overlap here
          var startDateStr = (startDate.getMonth() + 1) + '/' + startDate.getDate() + '/' +  startDate.getFullYear();
          var endDateStr = (endDate.getMonth() + 1) + '/' + endDate.getDate() + '/' +  endDate.getFullYear();
          addDiv.innerHTML += '<ion-item class="item-thumbnail-left"> <h4>Timeslot: '+ timeSlots + '</h4> <p>Start: ' + startDateStr + " "+ startTime.getUTCHours()+':'+ numMinutes+ '</p> <p>End: ' + endDateStr + " "+ endTime.getUTCHours()+':'+ endNumMinutes+ '</p></ion-item>';
          var dict = {'startDate':startDate, 'startTime':startTime.getUTCHours(), 'endDate': endDate, 'endTime':endTime.getUTCHours()};
          allTimeSlots.push(dict);
          console.log(allTimeSlots);
        }
      },
      inputTime: ((new Date()).getHours() * 60 * 60),   
      format: 24,         
      step: 60,           
      setLabel: 'Set End Time'    
    };

    
  }





  //owner add space

})



