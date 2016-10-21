
angular.module('starter.controllers', [])

//LogIn Controller
.controller('LoginCtrl', function($scope, $ionicPopup, $state) {
    $scope.data = {};
     console.log("in login controller");
    $scope.login = function() {

      var username = ""+ $scope.data.username;
      var password = ""+ $scope.data.password;
      var userType = document.querySelector('input[name = "loginType"]:checked');
      console.log(username );
      console.log(password );
      if(userType == null){
        var div = document.getElementById('invalid');
          div.innerHTML = 'Please select parker or owner';
          return;
      }
      userType = userType.value;
      console.log(userType );
      
      if(password.length == 0 ||  username.length == 0){
          //invalid login
          var div = document.getElementById('invalid');
          div.innerHTML = 'Please insert all fields';
          return;
      }
      //need to get user info to populate whatever page we do next
      //figure out how to send variables across pages
      //check if parker or owner
      if(userType == 'parker'){
        $state.go("parker.search");
      }else if(userType == 'owner'){
        $state.go("owner.home")
      }
      
    }

    $scope.signUpClicked = function() {
      console.log("sign up clicked");
      $state.go("signUp");
    }

})

//SignUp Controller
.controller('signUpCtrl', function($scope, $ionicPopup, $state) {
  $scope.data = {};
  $scope.signUp = function(){
    var username = ""+ $scope.data.username;
    var email = "" +  $scope.data.email;
    var password = ""+ $scope.data.password;
    var userType = document.querySelector('input[name = "signUpType"]:checked');
    console.log(username);
    console.log(email);
    console.log(password);
    if(userType == null){
      var div = document.getElementById('invalid');
        div.innerHTML = 'Please select parker or owner';
        return;
    }
    userType = userType.value;
    console.log(userType );
    
    if(password.length == 0 ||  username.length == 0 || email.length == 0 ){
        //invalid login
        var div = document.getElementById('invalid');
        div.innerHTML = 'Please insert all fields';
        return;
    }
    var regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    if(password.length < 10 ||  !regularExpression.test(password)){
          //invalid login
          var div = document.getElementById('invalid');
          div.innerHTML = 'Your password must contain special letter and be longer than 10 characters, please try again';
          return;
    }
  }
  //check if sign up already used
  //if it is already used for to owner or user page

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
        $state.go('login');
     } else {
       console.log('You are not sure');
     }
   });
 };
})


.controller('parkerSearchCtrl', function($scope, $ionicPopup, $state, ionicTimePicker, ionicDatePicker) {
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
    
      var setFirstTime = {
      callback: function (val) {      //Mandatory
        if (typeof (val) === 'undefined') {
          console.log('Time not selected');
        } else {
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
          var addDiv = document.getElementById('timeDiv');
          startDate.setHours(startDate.getHours() + startTime.getHours());
          endDate.setHours(endDate.getHours() + endTime.getHours());
          console.log(startDate + " end " + endDate);
          if(endDate < startDate){
            //popup modal
            var alertPopup = $ionicPopup.alert({
               title: "Your end date and time must be after your start",
               //template: 'It might taste good'
             });

             /*alertPopup.then(function(res) {
               console.log('Thank you for not eating my delicious ice cream cone');
             });*/
            return;
          }
          var startDateStr = (startDate.getMonth() + 1) + '/' + startDate.getDate() + '/' +  startDate.getFullYear();
          var endDateStr = (endDate.getMonth() + 1) + '/' + endDate.getDate() + '/' +  endDate.getFullYear();
          //add to HTML here if you want to display something
          addDiv.innerHTML += '<ion-item class="item-thumbnail-left"> <h4>Timeslot: </h4> <p>Start: ' + startDateStr + " "+ startTime.getUTCHours()+':'+ numMinutes+ '</p> <p>End: ' + endDateStr + " "+ endTime.getUTCHours()+':'+ endNumMinutes+ '</p></ion-item>';
          var button = document.getElementById("setTimeButton");
          console.log(button);
          console.log(button.value);
          button.innerHTML = 'Change time slot';
        }
      },
      inputTime: ((new Date()).getHours() * 60 * 60),   
      format: 24,         
      step: 60,           
      setLabel: 'Set End Time'    
    };
  }
})

.controller('paypalCtrl', function($scope, $ionicPopup, $state) {
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
      console.log("payment clicked");
      $state.go("parker.paypal");
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


.controller('ownerHomeCtrl', function($scope, $ionicPopup, $state) {
 
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
      console.log(price);
      console.log(address);
      if(parkingSpaceName=== 'undefined' ||  price=== 'undefined'|| address=== 'undefined' ){
          //invalid login
          console.log("here");
          var div = document.getElementById('addSpaceInvalid');
          div.innerHTML = 'Please insert all required fields';
          return;
      }
      //get image upload
      //get timeslider thing
     
  }
   //image uploader
  var imageUploader = new ImageUploader();
  $scope.file = {};
  $scope.upload = function() {
    imageUploader.push($scope.file, function(data){
      console.log('File uploaded Successfully', $scope.file, data);
      $scope.uploadUri = data.url;
      $scope.$digest();
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
          var startDateStr = (startDate.getMonth() + 1) + '/' + startDate.getDate() + '/' +  startDate.getFullYear();
          var endDateStr = (endDate.getMonth() + 1) + '/' + endDate.getDate() + '/' +  endDate.getFullYear();
          addDiv.innerHTML += '<ion-item class="item-thumbnail-left"> <h4>Timeslot: '+ timeSlots + '</h4> <p>Start: ' + startDateStr + " "+ startTime.getUTCHours()+':'+ numMinutes+ '</p> <p>End: ' + endDateStr + " "+ endTime.getUTCHours()+':'+ endNumMinutes+ '</p></ion-item>';
          var dict = {'startDate':startDate, 'startTime':startTime, 'endDate': endDate, 'endTime':endTime};
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



