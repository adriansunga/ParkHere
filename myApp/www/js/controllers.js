angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  /*$scope.login = function() {
    $scope.modal.show();
  };*/

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
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
      $state.go("parker.search");
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

.controller('parkerMenuCtrl', function($scope, $ionicPopup, $state) {
})

.controller('parkerSearchCtrl', function($scope, $ionicPopup, $state) {
})




