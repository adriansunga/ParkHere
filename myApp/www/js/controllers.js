angular.module('starter.controllers', [])


//LogIn Controller
.controller('LoginCtrl', function($scope, $ionicPopup, $state, user) {
  Parse.initialize("com.team3.parkhere", "medvidobitches");

    $scope.data = {};
    console.log("in login controller");

    var currUser = Parse.User.current();
    if (currUser != null) {
        var userType = currUser.get("userType");
        if (userType == 'parker') {
            $state.go('parker.search');
        } else {
            $state.go('owner.home');
        }
    }

    $scope.login = function() {

        var username = "" + $scope.data.username;
        var password = "" + $scope.data.password;
        var userType = document.querySelector('input[name = "loginType"]:checked');
        console.log(username);
        console.log(password);
        var div = document.getElementById('invalid');
        if (userType == null) {
            div.innerHTML = 'Please select parker or owner';
            return;
        }
        userType = userType.value;
        console.log(userType);

        if (password.length == 0 || username.length == 0) {
            div.innerHTML = 'Please insert all fields';
            return;
        }
        div.innerHTML = '';
        user.email = username;
        user.userType = userType;
        console.log("user object in login " + user.email);
        Parse.User.logIn(username, password, {
            success: function(user1) {
                user.username = user1.get("name");
                user.phoneNumber = "" + user1.get("phoneNumber");
                user.uniqueID = user1.id;
                user.rating = user1.get("averageRating");
                if (user1.get("userType") != userType) {
                    div.innerHTML = 'You have not signed up with this user type';
                } else {
                    if (userType == 'parker') {
                        $state.go("parker.search");
                    } else if (userType == 'owner') {
                        $state.go("owner.home")
                    }
                }
            },
            error: function(user1, error) {
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
    user.phoneNumber = '';
    user.rating = '';
    user.uniqueID = '';
    return user;
})

//SignUp Controller
.controller('signUpCtrl', function($scope, $ionicPopup, $state, user) {
    $scope.data = {};
    $scope.signUp = function() {

        var username = "" + $scope.data.username;
        var email = "" + $scope.data.email;
        var password = "" + $scope.data.password;
        var userType = document.querySelector('input[name = "signUpType"]:checked');
        console.log(email);
        console.log(password);
        if (userType == null) {
            var div = document.getElementById('invalid');
            div.innerHTML = 'Please select parker or owner';
            return;
        }
        userType = userType.value;
        console.log(userType);
        var div = document.getElementById('invalid');
        if (password == "undefined" || username == "undefined" || email == "undefined") {
            //invalid login
            div.innerHTML = 'Please insert all fields';
            return;
        }
        console.log("here-1");
        //fix this reg ex!!!!
        if (password.length < 10 || password.search(/\d/) == -1) {
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
            success: function(user1) {
                user.uniqueID = user1.id;
                if (userType == "owner") {
                    $state.go("owner.home");
                } else {
                    $state.go("parker.search");
                }
            },
            error: function(user, error) {
                // Show the error message somewhere and let the user try again.
                console.log(error.message);
                if (error.message == "invalid session token") {
                    parseUser.logOut();
                    div.innerHTML = "Somethined went wrong, please try again";
                }
                if (error.message == "UserEmailTaken") {
                    div.innerHTML = user.email + ' already exists please try another email';
                } else {
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
    $scope.upcomingSpaces = function() {
        console.log("in upcoming spaces");
        $state.go("parker.upcomingSpaces");
    }
    $scope.showLogout = function() {
        console.log("in show logout");
        var confirmPopup = $ionicPopup.confirm({
            title: 'Logout',
            template: 'Are you sure you want to Logout?'
        });

        confirmPopup.then(function(res) {
            if (res) {
                console.log('You are sure');
                //logout
                $ionicLoading.hide();
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
                $ionicHistory.nextViewOptions({
                    disableBack: true,
                    historyRoot: true
                });
                Parse.User.logOut();
                $state.go('login');
            } else {
                console.log('You are not sure');
            }
        });
    };
})

.service('parkerSearch', function() {
    var parkerSearch = this;
    parkerSearch.parkingSpaceList = [];
    parkerSearch.geoPoint = new Parse.GeoPoint();
    parkerSearch.startDate = new Date();
    parkerSearch.startTime = new Date();
    parkerSearch.endDate = new Date();
    parkerSearch.endTime = new Date();
    parkerSearch.parkingSpaceType = '';
    return parkerSearch;
})

.controller('parkerSearchCtrl', function($scope, $cordovaGeolocation, $ionicPopup, $state, ionicTimePicker, ionicDatePicker, parkerSearch, user) {
    var currLat = null;
    var currLong = null;
    $scope.search = "Change address"
    var address = "";
    var options = {
        timeout: 100000,
        enableHighAccuracy: false
    };
    $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
        currLat = position.coords.latitude;
        currLong = position.coords.longitude;
        var confirmPopup = $ionicPopup.confirm({
            title: 'Current Location',
            template: 'Can ParkHere use your current location?'
        });
        confirmPopup.then(function(res) {
            if (res) {
                address = currLat + " " + currLong;
                $scope.search = address;
                document.getElementById('searchTextBox').value = address;
            }else{

            }
            });
        console.log(currLat);
    }, function(error) {
        console.log("Could not get location");
    });


    $scope.countryCode = 'US';

    $scope.onAddressSelection = function(location) {
        address = location.formatted_address;
    };

    var timeSlots = 0;

    var startDate;
    var startTime;
    var endDate;
    var endTime;

    $scope.openTimePicker = function() {
        //date picker
        //variables we need to send to the back end

        var allTimeSlots = [];

        var startDateObj = {
            callback: function(val) { //Mandatory

                startDate = new Date(val);
                parkerSearch.startDate = startDate;
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
            callback: function(val) { //Mandatory
                if (typeof(val) === 'undefined') {
                    console.log('Time not selected');
                } else {
                    /*console.log('Selected epoch is : ', val, 'and the time is ',
                     selectedTime.getUTCHours(), 'H :', selectedTime.getUTCMinutes(), 'M');*/
                    startTime = new Date(val * 1000);
                    parkerSearch.startTime = startTime;
                    var endDateObj = {
                        callback: function(val) { //Mandatory

                            endDate = new Date(val);
                            parkerSearch.endDate = endDate;
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
            callback: function(val) { //Mandatory
                if (typeof(val) === 'undefined') {
                    console.log('Time not selected');
                } else {
                    endTime = new Date(val * 1000);
                    parkerSearch.endTime = endTime;
                    if (startTime.getUTCMinutes() < 10) {
                        var numMinutes = '0' + startTime.getUTCMinutes();
                    } else {
                        var numMinutes = startTime.getUTCMinutes();
                    }
                    if (endTime.getUTCMinutes() < 10) {
                        var endNumMinutes = '0' + endTime.getUTCMinutes();
                    } else {
                        var endNumMinutes = endTime.getUTCMinutes();
                    }
                    var addDiv = document.getElementById('spaceSearchTimeList');
                    startDate.setHours(startDate.getHours() + startTime.getHours());
                    endDate.setHours(endDate.getHours() + endTime.getHours());
                    console.log(startDate + " end " + endDate);
                    if (endDate <= startDate) {
                        //popup modal
                        var alertPopup = $ionicPopup.alert({
                            title: "Your end date and time must be after your start",
                            //template: 'It might taste good'
                        });
                        return;
                    }
                    timeSlots = timeSlots + 1;
                    //should check if times overlap here
                    var startDateStr = (startDate.getMonth() + 1) + '/' + startDate.getDate() + '/' + startDate.getFullYear();
                    var endDateStr = (endDate.getMonth() + 1) + '/' + endDate.getDate() + '/' + endDate.getFullYear();
                    addDiv.innerHTML += '<ion-item class="item-thumbnail-left"> <h4>Timeslot: ' + timeSlots + '</h4> <p>Start: ' + startDateStr + " " + startTime.getUTCHours() + ':' + numMinutes + '</p> <p>End: ' + endDateStr + " " + endTime.getUTCHours() + ':' + endNumMinutes + '</p></ion-item>';
                    var dict = {
                        'startDate': startDate,
                        'startTime': startTime.getUTCHours(),
                        'endDate': endDate,
                        'endTime': endTime.getUTCHours()
                    };
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
    $scope.data2 = {};
    $scope.findParkingSpaces = function() {
        var address = document.getElementById('searchTextBox').value;
        var parkingSpaceType = $scope.data2.searchType;
        parkerSearch.parkingSpaceType = parkingSpaceType;
        var geocoder = new google.maps.Geocoder();
        var latitude;
        var longitude;
        if(parkingSpaceType == null || startDate == null || startTime == null || endDate == null
            || address == null || endTime == null){
            document.getElementById("invalid").innerHTML = "Please insert all fields";
            return;
        }
        //log all values here
        console.log("start date = " + (startDate.getMonth() + 1) + '/' + startDate.getDate() + '/' + startDate.getFullYear());
        console.log("start time = " + startTime.getUTCHours());
        console.log("end date = " + (endDate.getMonth() + 1) + '/' + endDate.getDate() + '/' + endDate.getFullYear());
        console.log("end time = " + endTime.getUTCHours());
        console.log("address = " + address);
        console.log("parking space type = " + parkingSpaceType);

        var div = document.getElementById('invalid')

        geocoder.geocode({
            'address': address
        }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                latitude = results[0].geometry.location.lat();
                longitude = results[0].geometry.location.lng();
                console.log("lat = " + latitude);
                console.log("longitude = " + longitude);

                var myGeoPoint = new Parse.GeoPoint({
                    latitude: latitude,
                    longitude: longitude
                });
                parkerSearch.geoPoint = myGeoPoint;
                console.log("geoPoint: " + myGeoPoint);
                var parkingSpace = Parse.Object.extend("ParkingSpace");
                var query = new Parse.Query(parkingSpace);

                query.withinMiles("location", myGeoPoint, 3);

                console.log("do i get here? right before query.find");
                query.find({
                    success: function(results) {
                        console.log("Total: " + results.length);
                        // console.log("parking space objects: " + JSON.stringify(results));
                        parkerSearch.parkingSpaceList = results;
                        $state.go("parker.parkingSearchResults");
                    },
                    error: function(error) {
                        alert("Error when getting objects!");
                    }
                });
            } else {
                console.log("geo error " + status);
                div.innerHTML = 'Something went wrong, please try again';
            }
        });

    }
})

.service('parkerSearchResults', function() {
    var parkerSearchResults = this;
    parkerSearchResults.viableSpaces = [];
    parkerSearchResults.selectedSpace = new Parse.Object.extend("ParkingSpace");
    return parkerSearchResults;
})

.controller('parkingSearchResultsCtrl', function($scope, $ionicPopup, $state, parkerSearch, parkerSearchResults) {
    console.log("in parking search results!");

    // TODO: modify code to use query results rather than preset id values
    // maybe by making each item a query object
    console.log("parking space objects: " + JSON.stringify(parkerSearch.parkingSpaceList[0]));
    console.log("geoPoint: " + parkerSearch.geoPoint);
    console.log("parkerSearch.parkingSpaceType = " + parkerSearch.parkingSpaceType);

    console.log("start date = " + (parkerSearch.startDate.getMonth() + 1) + '/' + parkerSearch.startDate.getDate() + '/' + parkerSearch.startDate.getFullYear());
    console.log("start time = " + parkerSearch.startTime.getUTCHours());
    console.log("end date = " + (parkerSearch.endDate.getMonth() + 1) + '/' + parkerSearch.endDate.getDate() + '/' + parkerSearch.endDate.getFullYear());
    console.log("end time = " + parkerSearch.endTime.getUTCHours());

    var viableSpaces = [];


    for (var i = 0; i < parkerSearch.parkingSpaceList.length; i++) {

            
        var date = parkerSearch.parkingSpaceList[i].get("Date");         //check if parking space type matches
             //check if parking space is in time range
            
        if (((parkerSearch.parkingSpaceList[i].get("type") == parkerSearch.parkingSpaceType) ||
                (parkerSearch.parkingSpaceType == "All")) &&       ((date.getMonth() + 1) >= (parkerSearch.startDate.getMonth() + 1)) &&       (date.getDate() >= parkerSearch.startDate.getDate()) &&       (date.getFullYear() >= parkerSearch.startDate.getFullYear()) &&       ((date.getMonth() + 1) <= (parkerSearch.endDate.getMonth() + 1)) &&       (date.getDate() <= parkerSearch.endDate.getDate()) &&       (date.getFullYear() <= parkerSearch.endDate.getFullYear()))     {

                  
            if (((date.getMonth() + 1) == (parkerSearch.startDate.getMonth() + 1)) &&       (date.getDate() == parkerSearch.startDate.getDate()) &&       (date.getFullYear() == parkerSearch.startDate.getFullYear()) &&       (parkerSearch.parkingSpaceList[i].get("Hour") < parkerSearch.startTime.getUTCHours()))       {        
                continue;      
            }      
            if (((date.getMonth() + 1) == (parkerSearch.endDate.getMonth() + 1)) &&       (date.getDate() == parkerSearch.endDate.getDate()) &&       (date.getFullYear() == parkerSearch.endDate.getFullYear()) &&       (parkerSearch.parkingSpaceList[i].get("Hour") > parkerSearch.endTime.getUTCHours()))       {        
                continue;      
            }      
            viableSpaces.push(parkerSearch.parkingSpaceList[i]);    
        }  
    }

    console.log("viable spaces filled, size : " + viableSpaces.length);
    parkerSearchResults.viableSpaces = viableSpaces;
    if(viableSpaces.length == 0){
        document.getElementById("noResults").innerHTML = "No results matched your search";
    }
    $scope.parkingSpaces = [];
    var addToList = true;


    for (var i = 0; i < viableSpaces.length; i++) {
        addToList = true;
        for (var j = 0; j < $scope.parkingSpaces.length; j++) {
            if ((viableSpaces[i].get("ownerEmail") == $scope.parkingSpaces[j].get("ownerEmail")) &&
                (viableSpaces[i].get("address") == $scope.parkingSpaces[j].get("address"))) {
                addToList = false;
            }
        }
        if (addToList) {
            var distance = parkerSearch.geoPoint.milesTo(viableSpaces[i].get("location"));
            viableSpaces[i].set("distance", distance);
            $scope.parkingSpaces.push(viableSpaces[i]);
        }
    }


    $scope.itemClicked = function(parkingSpace) {
        console.log("This item was clicked: " + parkingSpace + "!");
        parkerSearchResults.selectedSpace = parkingSpace;
        $state.go("parker.reservation");
    }
})

.controller('ownerPageProfileCtrl', function($scope, $ionicPopup, $state, user) {
    console.log(user);
    if (user.phoneNumber == null || user.phoneNumber === 'undefined') {
        console.log("bad phone number")
        user.phoneNumber = "";
    }

    $scope.user = {};
    $scope.user.name = user.username;
    $scope.user.email = user.email;
    $scope.user.phoneNumber = user.phoneNumber;
    console.log("here");

    console.log($scope.user);
    $scope.ownerData = {};
    if (user.averageRating == null) {
        user.averageRating = 0;
    }
    $scope.ratingsObject = {
        iconOn: 'ion-ios-star',
        iconOff: 'ion-ios-star-outline',
        iconOnColor: 'rgb(251, 212, 1)',
        iconOffColor: 'rgb(224, 224, 224)',
        rating: user.averageRating,
        minRating: 0,
        readOnly: true,
        callback: function(rating) {
            $scope.ratingsCallback(rating);
        }
    };

    $scope.ratingsCallback = function(rating) {
        console.log('Selected rating is : ', rating);
    };

    $scope.updateOwner = function() {
        if ($scope.ownerData.username != null) {
            user.username = $scope.ownerData.name;
        }
        if ($scope.ownerData.phoneNumber != null) {
            user.phoneNumber = $scope.ownerData.phoneNumber
        }
        var parseUser = new Parse.User();
        parseUser.id = user.uniqueID;
        parseUser.set("name", user.username);
        parseUser.set("phoneNumber", user.phoneNumber);
        parseUser.save(null, {
            success: function(user) {
                console.log("in update owner success");

                document.getElementById('invalid').innerHTML = "Profile updated";
            },
            error: function(user, error) {
                document.getElementById('invalid').innerHTML = "Something went wrong please try again";
            }
        });

    };

})

.service('reservationInfo', function() {
    var reservationInfo = this;
    reservationInfo.price = '';
    return reservationInfo;
})

.controller('reservationCtrl', function($scope, $ionicPopup, $state, parkerSearchResults, user, reservationInfo) {

    $scope.selectedSpace = parkerSearchResults.selectedSpace;

    availableTimes = [];

    for (var i = 0; i < parkerSearchResults.viableSpaces.length; i++) {
        if ((parkerSearchResults.viableSpaces[i].get("ownerEmail") == parkerSearchResults.selectedSpace.get("ownerEmail")) &&
            (parkerSearchResults.viableSpaces[i].get("address") == parkerSearchResults.selectedSpace.get("address"))) {
            var date = parkerSearchResults.viableSpaces[i].get("Date")
            var prettyDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
            parkerSearchResults.viableSpaces[i].set("PrettyDate", prettyDate);
            availableTimes.push(parkerSearchResults.viableSpaces[i]);
        }
    }

    availableTimes.sort(function(a, b) {
        var aDate = a.get("Date");
        var bDate = b.get("Date");
        if (((aDate.getMonth() + 1) == (bDate.getMonth() + 1)) &&       (aDate.getDate() == bDate.getDate()) &&       (aDate.getFullYear() == bDate.getFullYear())) {
            console.log("hi");
            return a.get("Hour") - b.get("Hour");
        }
        return aDate - bDate;
    });

    $scope.availableTimes = availableTimes;

    console.log("in reservation page!");
    $scope.seeOwnerPage = function() {
        $state.go("parker.spotOwnerInformation");
    }

    $scope.reservationButtonClick = function() {

        var checkedTimes = [];
        var setReservation = true;

        for (var i = 0; i < $scope.availableTimes.length; i++) {
            if ($scope.availableTimes[i].checked == true) {
                if ($scope.availableTimes[i].get("reserved") == true) {
                    setReservation = false;
                }
                checkedTimes.push(i);

            }
        }

        if (checkedTimes.length == 0) {
            var alertPopup = $ionicPopup.alert({
                title: "Please select the times you would like to reserve below",
            });
        }


        console.log(user.email);
        if (setReservation) {
            var error = false;
            for (var i = 0; i < checkedTimes.length; i++) {
                console.log('setting reserved');
                $scope.availableTimes[checkedTimes[i]].set('reserved', true);
                $scope.availableTimes[checkedTimes[i]].set('parker', user.username);

                // Save
                $scope.availableTimes[checkedTimes[i]].save(null, {
                    success: function(point) {},
                    error: function(point, error) {
                        alert(error);
                        error = true;
                    }
                });

            }
            if (!error && checkedTimes.length != 0) {
                var price = parkerSearchResults.selectedSpace.get("price");
                reservationInfo.price = price * checkedTimes.length;
                console.log('price is ' + reservationInfo.price);
                $state.go("parker.pay");
                /*var alertPopup = $ionicPopup.alert({
                  title: "Your spaces have been reserved!",
                });*/
            } else if (checkedTimes.length != 0) {
            var alertPopup = $ionicPopup.alert({
                title: "You cannot reserve a parking space that is already reserved ",
            });
        }
    }
}
})

.controller('upcomingSpacesCtrl', function($scope, $ionicPopup, $state, user) {
    console.log("inside upcoming with user: " + user.email + " password: " + user.password);
    $scope.listCanSwipe = true;
    var parkingSpace = Parse.Object.extend("ParkingSpace");
    var query = new Parse.Query(parkingSpace);
    query.equalTo("parker", user.email);
    console.log("username: " + user.email);
    query.ascending("Date");
    query.find({
        success: function(results) {
            $scope.spaces = results;
        }
  });
  $scope.delete = function(space) {
    console.log("This item was deleted: " + space.get("address") +  "!");
    var today = new Date();
    var difference = space.get("Date") - today;
    console.log("now date: " + today);
    console.log("subtracted date: " + space.get("Date"));
    var days = Math.abs(space.get("Date").valueOf() - today.valueOf()) / 36e5/24;
    console.log("date difference: " + days );

    if (days <2) {
      var alertPopup = $ionicPopup.alert({
        title: 'Cannot unregister from this space.',
        template: 'You can\'t unregister from a spot that you reserved for less than 2 days from now.',
      });
    }
    var confirmPopup = $ionicPopup.confirm({
       title: 'Unreserve',
       template: 'Are you sure you want to remove this parking space?'
     });
     confirmPopup.then(function(res) {
       if(res) {
         space.set("parker", "");
         space.save();
         var alertPopup = $ionicPopup.alert({
           title: 'Your account will be refunded.',
         });
         alertPopup.then(function() {
           $scope.spaces.splice($scope.spaces.indexOf(space), 1);
         });
       }
     });
  }
})

.controller('spotOwnerInformationCtrl', function($scope, $ionicPopup, $state, parkerSearchResults) {
    console.log("in spot control page!");

    var email = parkerSearchResults.selectedSpace.get("ownerEmail");
    console.log("owner email = " + email);
    var users = Parse.Object.extend("User");
    var query = new Parse.Query(users);
    query.equalTo("username", email);
    query.find({
        success: function(results) {
            console.log("results: (should just be one) " + results);
            $scope.owner = results[0];
        }
    })
})

//getting payment token for owner
.controller('ownerPayCtrl', function($scope, $ionicPopup, $state, StripeCharge, $ionicNavBarDelegate, $http) {
    // add the following headers for authentication
    $ionicNavBarDelegate.showBackButton(false);
    $http.defaults.headers.common['X-Mashape-Key'] = NOODLIO_PAY_API_KEY;
    $http.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
    $http.defaults.headers.common['Accept'] = 'application/json';

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
                function(response) {

                    // --> success
                    console.log(response)

                    if (response.hasOwnProperty('id')) {
                        var token = response.id;
                        $scope.ResponseData['token'] = token;
                        proceedCharge(token);
                    } else {
                        $scope.ResponseData['token'] = 'You did not input all fields properly, please try again';
                        $scope.ResponseData['loading'] = false;
                    };

                }
            )
            .error(
                function(response) {
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
                function(response) {

                    // --> success
                    console.log(response);
                    $scope.ResponseData['loading'] = false;

                    if (response.hasOwnProperty('id')) {
                        var paymentId = response.id;
                        $scope.ResponseData['paymentId'] = paymentId;
                    } else {
                        $scope.ResponseData['paymentId'] = 'Error, see console';
                    };

                }
            )
            .error(
                function(response) {
                    console.log(response)
                    $scope.ResponseData['paymentId'] = 'Error, see console';
                    $scope.ResponseData['loading'] = false;
                }
            );
    };

})


//where we set up the payment... should be for parker
.controller('parkerPayCtrl', function($scope, $ionicPopup, $state, StripeCharge, reservationInfo) {
    var total = reservationInfo.price;

    $scope.ProductMeta = {
        title: "Awesome product",
        description: "Yes it really is",
        priceUSD: total,
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
            function(stripeToken) {
                // -->
                proceedCharge(stripeToken);
            },
            function(error) {
                console.log(error)

                $scope.status['loading'] = false;
                if (error != "ERROR_CANCEL") {
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
                function(StripeInvoiceData) {

                    if (StripeInvoiceData.hasOwnProperty('id')) {
                        $scope.status['message'] = "Success! Check your Stripe Account";
                    } else {
                        $scope.status['message'] = "Error, check your console";
                    };
                    $scope.status['loading'] = false;
                    console.log(StripeInvoiceData)
                },
                function(error) {
                    console.log(error);

                    $scope.status['loading'] = false;
                    $scope.status['message'] = "Oops... something went wrong";
                }
            );

        }; // ./ proceedCharge

    };
})

//owner controller
.controller('ownerMenuCtrl', function($scope, $ionicNavBarDelegate, $ionicPopup, $state, $ionicLoading, $ionicHistory) {
    $ionicNavBarDelegate.showBackButton(false);
    //rating



    //logout
    $scope.showLogout = function() {
        console.log("in show logout");
        var confirmPopup = $ionicPopup.confirm({
            title: 'Logout',
            template: 'Are you sure you want to Logout?'
        });

        confirmPopup.then(function(res) {
            if (res) {
                console.log('You are sure');
                //logout
                $ionicLoading.hide();
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
                $ionicHistory.nextViewOptions({
                    disableBack: true,
                    historyRoot: true
                });
                $state.go('login');
            } else {
                console.log('You are not sure');
            }
        });
    };
})

.controller('UploadController', function($scope) {
    var imageUpload = new ImageUpload();
    $scope.file = {};
    $scope.upload = function() {
        imageUpload.push($scope.file, function(data) {
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
    parkingSpace.parkerName = '';
    parkingSpace.parkerContactInfo = '';
    parkingSpace.url = '';
    parkingSpace.address = '';
    parkingSpace.notes = '';
    parkingSpace.uniqueID = '';
    parkingSpace.ownerEmail = '';
    parkingSpace.type = '';
    return parkingSpace;
})

.controller('ownerHomeCtrl', function($scope, $ionicNavBarDelegate, $ionicPopup, $state, parkingSpace, user) {
    $ionicNavBarDelegate.showBackButton(false);



    var ownerEmail = user.email;
    $scope.items = [];
    var usedSpaces = new Set();
    //need to get all parking spaces
    //get all parking spaces where email == ownerEmail and endDate >= today
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    //if(Parse == null){
    //FOR TESTING
  //  Parse.initialize("com.team3.parkhere");
    //Parse.serverURL = 'http://138.68.43.212:1337/parse';
    //}
    var parkingSpaceParse = Parse.Object.extend("ParkingSpace");
    var pSpaceQuery = new Parse.Query(parkingSpaceParse);
    //spaces owned by this person
    pSpaceQuery.equalTo("ownerEmail", ownerEmail);
    pSpaceQuery.greaterThanOrEqualTo("Date", today);
    pSpaceQuery.ascending("Date");
    pSpaceQuery.find({
        success: function(results) {
            //results give me the object ids
            console.log("owner home " + results);
            for (var i = 0; i < results.length; i++) {
                var objID = results[i].id;
                //don't need to relook if already has key
                var query = new Parse.Query(parkingSpaceParse);
                query.get(objID, {
                    success: function(parkingSpace) {
                        if (usedSpaces.has(parkingSpace.get('name'))) {
                            return;
                        }
                        console.log(parkingSpace);
                        usedSpaces.add(parkingSpace.get('name'));
                        console.log("in get obj " + parkingSpace.id);
                        var dict = {
                            "id": i,
                            "name": parkingSpace.get('name'),
                            "price": parkingSpace.get("price"),
                            "image": parkingSpace.get('picture')._url,
                            "uniqueID": parkingSpace.id,
                            "email": user.email

                        }
                        console.log("dict " + dict);
                        $scope.$apply(function() {
                            $scope.items.push(dict);
                        });
                        console.log("scope items " + $scope.items);
                        console.log($scope.items);
                    },
                    error: function(object, error) {}
                });
            }
        }
    });

    $scope.onItemDelete = function(item) {
        //need to check if we can delete it
        console.log(item);
        console.log("^item");
        console.log(parkingSpace);
        var query = new Parse.Query(parkingSpaceParse);
        query.equalTo("name", item.name);
        query.equalTo("ownerEmail", item.email);
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        query.greaterThanOrEqualTo("Date", today);
        query.equalTo("reserved", true);
        query.find({
            success: function(results) {
                if (results.length > 0) {
                    var alertPopup = $ionicPopup.alert({
                        title: "You cannot delete as parkers have reserved this space",
                    });
                } else {
                    confirmDelete()
                }
            }
        });

        function confirmDelete() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete ' + item.name,
                template: 'Are you sure you want to delete ' + item.name + '?'
            });

            confirmPopup.then(function(res) {
                if (res) {
                    console.log(item.name + " " + item.email);
                    var allTimesQuery = new Parse.Query(parkingSpaceParse);
                    allTimesQuery.equalTo("name", item.name);
                    allTimesQuery.equalTo("ownerEmail", item.email);
                    var today = new Date();
                    today.setHours(0, 0, 0, 0);
                    allTimesQuery.greaterThanOrEqualTo("Date", today);
                    allTimesQuery.find({
                        success: function(results) {
                            console.log("found some spaces");
                            console.log(results);

                            for (var i = 0; i < results.length; i++) {
                                results[i].destroy({
                                    success: function(myObject) {},
                                    error: function(myObject, error) {
                                        console.log("delete error: " + error);
                                    }
                                });
                            }
                        },
                        error: function(object, error) {
                            console.log("find error: " + error);
                        }
                    });
                    $scope.items.splice($scope.items.indexOf(item), 1);

                } else {
                    console.log('You are not sure delete ' + item.name);
                }
            });
        }


    };
    $scope.edit = function(item) {
        console.log("edit item returned", item);
        parkingSpace.title = item.name;
        parkingSpace.price = item.price;
        parkingSpace.uniqueID = item.uniqueID;
        parkingSpace.ownerEmail = ownerEmail;
        console.log("in edit function", parkingSpace.title);
        $state.go("owner.spaceInfo");
    };

})

.controller('ownerSpaceInfoCtrl', function($scope, $ionicPopup, $state, $stateParams, parkingSpace, user, $sce) {
    $scope.parkingSpace = parkingSpace;
    $scope.space = {};
    console.log("in owner space id " + parkingSpace.uniqueID);
    var parkingSpaceParse = Parse.Object.extend("ParkingSpace");
    var pSpaceQuery = new Parse.Query(parkingSpaceParse);
    console.log(parkingSpace.uniqueID);
    pSpaceQuery.get(parkingSpace.uniqueID, {
        success: function(qSpace) {
            console.log(qSpace);
            parkingSpace.notes = qSpace.get("notes");
            parkingSpace.url = qSpace.get('picture')._url
            parkingSpace.type = qSpace.get("type");
            console.log("parking space pic in obj" + parkingSpace.url);
            parkingSpace.address = qSpace.get("address");
            /*var geoPoint = qSpace.get("location");
          var latlng = {lat: geoPoint.latitude, lng: geoPoint.longitude};
          var geocoder = new google.maps.Geocoder();
          geocoder.geocode({'location': latlng}, function(results, status) {
          if (status === 'OK') {
            if (results[1]) {
              //console.log(results[1]);
              parkingSpace.address = results[1].formatted_address;
            } else {
              console.log('No results found');
            }
          } else {
            console.log('Geocoder failed due to: ' + status);
          }
        });*/
        },
        error: function(object, error) {
            console.log("find error: " + error);
        }
    });
    $scope.updatePrice = function() {
        console.log("in update price");
        var allTimesQuery = new Parse.Query(parkingSpaceParse);
        allTimesQuery.equalTo("name", parkingSpace.title);
        allTimesQuery.equalTo("ownerEmail", parkingSpace.ownerEmail);
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        allTimesQuery.greaterThanOrEqualTo("Date", today);
        allTimesQuery.equalTo("reserved", false);
        allTimesQuery.find({
            success: function(results) {

                for (var i = 0; i < results.length; i++) {
                    console.log(results[i]);
                    results[i].set("price", $scope.space.price);
                    results[i].save();
                }
                parkingSpace.price = $scope.space.price;
                $scope.parkingSpace = parkingSpace;
                document.getElementById("invalid").innerHTML = "Price updated for unreserved spaces";
            },
            error: function(error) {
                document.getElementById("invalid").innerHTML = "Something went wrong, please try again";
            }
        });

    }

    $scope.getTimeSpaces = function() {
        var allTimesQuery = new Parse.Query(parkingSpaceParse);
        allTimesQuery.equalTo("name", parkingSpace.title);
        allTimesQuery.equalTo("ownerEmail", parkingSpace.ownerEmail);
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        allTimesQuery.greaterThanOrEqualTo("Date", today);
        //need a map: Date: string array[0-24]
        //in array, if parker has reserved hour, put in parker name, if there is an hour but no one reserved, 0
        var dateToList = {};
        var sortedDates = [];
        allTimesQuery.find({
            success: function(results) {
                // Do something with the returned Parse.Object values
                console.log(results.length);
                for (var i = 0; i < results.length; i++) {
                    var currDate = results[i].get("Date");
                    console.log(currDate);
                    if (!dateToList[currDate]) {
                        dateToList[currDate] = [];
                        for (var j = 0; j <= 24; j++) {
                            dateToList[currDate][j] = null;
                        }
                    }
                    var hour = results[i].get("Hour");
                    var parker = results[i].get("parker");
                    if (results[i].get("reserved") == false || parker == null || parker == "" || parker === "undefined") {
                        parker = '0';
                    }
                    dateToList[currDate][hour] = parker;
                }
                console.log(dateToList);
                for (var key in dateToList) {
                    sortedDates.push(key);
                }
                console.log(sortedDates);
                sortedDates.sort();
                var htmlString = "";
                for (var i = 0; i < sortedDates.length; i++) {
                    htmlString += "<h5> Hours for " + sortedDates[i].toString().split(":")[0].slice(0, -3) + ":</h5>"
                    var dateList = dateToList[sortedDates[i]];
                    for (var j = 0; j < dateList.length; j++) {
                        if (dateList[j] == '0') {
                            htmlString += "<p>" + j + ":00: not reserved</p>";
                        } else if (dateList[j] != null) {
                            htmlString += "<p>" + j + ":00: " + dateList[j] + "</p>";
                        }
                    }
                }
                console.log(htmlString);
                document.getElementById("timeSlots").innerHTML = htmlString;
            },
            error: function(error) {
                console.log("Error: " + error.code + " " + error.message);
            }
        });

    }

})

.controller('ownerAddSpaceCtrl', function($scope, $ionicNavBarDelegate, $ionicPopup, $state, ionicTimePicker, ionicDatePicker, user) {
    //controller is not being added
    $ionicNavBarDelegate.showBackButton(false);
    $scope.data = {};
    //array to hold all timeslots, each timeslot will be a dictionary of startTime: , startDate: etc.
    var allTimeSlots = [];
    var picFile;
    console.log("user", user.email);

    var address = "";

    $scope.countryCode = 'US';
    $scope.onAddressSelection = function(location) {
        address = location.formatted_address;
        console.log(address);
    };

    $scope.addSpace = function() {
            var parkingSpaceParse = Parse.Object.extend("ParkingSpace");
            var parkingSpaceName = $scope.data.spaceName;
            var price = $scope.data.price;
            var notes = $scope.data.notes;
            var type = $scope.data.type;
            var latitude = 0;
            var longitude = 0;
            picFile = document.getElementById('fileUpload').files[0];
            console.log(picFile);
            console.log("type: " + type);
            console.log(address);
            var div = document.getElementById('addSpaceInvalid');
            if (type === 'undefined' || parkingSpaceName === 'undefined' || price === 'undefined' || address === 'undefined' || picFile === 'undefined') {
                //invalid login
                div.innerHTML = 'Please insert all required fields';
                return;
            }
            console.log(address);
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                'address': address
            }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    console.log(results[0]);
                    latitude = results[0].geometry.location.lat();
                    longitude = results[0].geometry.location.lng();
                    address = results[0].formatted_address;
                    console.log("lat " + latitude + " longitude " + longitude + "address " + address);
                    uploadToParse();
                } else {
                    console.log("geo error " + status);
                    div.innerHTML = 'Something went wrong, please try again';
                    return;
                }
            });
            //defined this function because this was calling before the lat and long was set from google
            function uploadToParse() {
                //save in date database by hour
                var parseFile = new Parse.File("image", picFile);
                parseFile.save().then(function() {
                    // The file has been saved to Parse.
                }, function(error) {
                    div.innerHTML = 'File upload did not work. Please try again';
                    return;
                });
                //make function comparing full years
                function sameDate(date1, date2) {
                    if (timeDict["startDate"].getDate() == timeDict["endDate"].getDate() &&
                        timeDict["startDate"].getMonth() == timeDict["endDate"].getMonth() &&
                        timeDict["startDate"].getFullYear() == timeDict["endDate"].getFullYear()) {
                        return true;
                    }
                    return false;
                }
                for (var i = 0; i < allTimeSlots.length; i++) {
                    var timeDict = allTimeSlots[i];
                    console.log(timeDict);
                    //start and end on same day

                    if (sameDate(timeDict["startDate"], timeDict["endDate"])) {
                        //hours from startTime to end time
                        for (var time = timeDict["startTime"]; time <= timeDict["endTime"]; time++) {
                            console.log("saving date");
                            console.log(timeDict["startDate"]);
                            saveSpace(timeDict["startDate"], time, parseFile);
                        }
                    } else { //not on the same day
                        for (var d = timeDict["startDate"]; d <= timeDict["endDate"]; d.setDate(d.getDate() + 1)) {
                            //if start date
                            if (sameDate(d, timeDict["startDate"])) {
                                //only do the ours from start time
                                for (var time = timeDict["startTime"]; time <= 24; time++) {
                                    console.log("saving date");
                                    console.log(timeDict["startDate"]);
                                    saveSpace(timeDict["startDate"], time, parseFile);
                                }
                            } else if (sameDate(d, timeDict["endDate"])) { //end date
                                for (var time = 0; time <= timeDict["endTime"]; time++) {
                                    console.log("saving date");
                                    console.log(timeDict["endDate"]);
                                    saveSpace(timeDict["endDate"], time, parseFile);
                                }
                            } else { //not start date
                                for (var time = 0; time <= 24; time++) {
                                    console.log("saving date");
                                    console.log(d);
                                    saveSpace(d, time, parseFile);
                                }
                            }
                        }
                    }

                }
            }

            function saveSpace(dateToSave, time, parseFile) {
                console.log("in saveSpace");
                console.log(dateToSave);
                var spaceToSave = new parkingSpaceParse();
                spaceToSave.set("Date", new Date(dateToSave));
                console.log(dateToSave);
                spaceToSave.set("ownerEmail", user.email);
                spaceToSave.set("name", parkingSpaceName);
                var point = new Parse.GeoPoint({
                    latitude: latitude,
                    longitude: longitude
                });
                spaceToSave.set("location", point);
                spaceToSave.set("picture", parseFile);
                spaceToSave.set("price", price);
                spaceToSave.set("type", type);
                spaceToSave.set("notes", notes);
                spaceToSave.set("Hour", time);
                spaceToSave.set("address", address);
                spaceToSave.set("parker", "");
                spaceToSave.set("reserved", false);
                spaceToSave.save(null, {
                    success: function(spaceToSave) {
                        div.innerHTML = "Space added!";
                        $state.go('owner.home');
                    },
                    error: function(spaceToSave, error) {
                        div.innerHTML = "Failed to upload space. Please try again";
                    }
                });
            }


            //for each dic in allTimes,
            //for each time frame in each dict
            //parse ish
            var point = new Parse.GeoPoint({
                latitude: latitude,
                longitude: longitude
            });

        }
        //image uploader
    var imageUploader = new ImageUploader();
    $scope.file = {};
    /*$scope.upload = function() {
      imageUploader.push($scope.file, function(data){
        console.log('File uploaded Successfully', $scope.file, data);
        $scope.uploadUri = data.url;
        $scope.$digest();
        picFile = $scope.file;
      });
    };*/
    var timeSlots = 0;
    $scope.openTimePicker = function() {
        //date picker
        //variables we need to send to the back end
        var startDate;
        var startTime;
        var endDate;
        var endTime;
        var startDateObj = {
            callback: function(val) { //Mandatory

                startDate = new Date(val);
                startDate.setHours(0, 0, 0, 0);
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
            callback: function(val) { //Mandatory
                if (typeof(val) === 'undefined') {
                    console.log('Time not selected');
                } else {
                    /*console.log('Selected epoch is : ', val, 'and the time is ',
                     selectedTime.getUTCHours(), 'H :', selectedTime.getUTCMinutes(), 'M');*/
                    startTime = new Date(val * 1000);
                    var endDateObj = {
                        callback: function(val) { //Mandatory

                            endDate = new Date(val);
                            endDate.setHours(0, 0, 0, 0);
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
            callback: function(val) { //Mandatory
                if (typeof(val) === 'undefined') {
                    console.log('Time not selected');
                } else {
                    endTime = new Date(val * 1000);
                    /*if(startTime.getUTCMinutes() < 10){
                      var numMinutes = '0' + startTime.getUTCMinutes();
                    }else{
                      var numMinutes = startTime.getUTCMinutes();
                    }
                    if(endTime.getUTCMinutes() < 10){
                      var endNumMinutes = '0' + endTime.getUTCMinutes();
                    }else{
                      var endNumMinutes = endTime.getUTCMinutes();
                    }*/
                    var addDiv = document.getElementById('addSpaceList');
                    /*startDate.setHours(startDate.getHours() + startTime.getHours());
                    endDate.setHours(endDate.getHours() + endTime.getHours());*/
                    console.log(startDate + " end " + endDate);
                    if (endDate.getTime() == startDate.getTime() && endTime.getUTCHours() <= startTime.getUTCHours()) {
                        //popup modal
                        var alertPopup = $ionicPopup.alert({
                            title: "Your end date and time must be after your start",
                            //template: 'It might taste good'
                        });
                        return;
                    }
                    timeSlots = timeSlots + 1;
                    //should check if times overlap here
                    var startDateStr = (startDate.getMonth() + 1) + '/' + startDate.getDate() + '/' + startDate.getFullYear();
                    var endDateStr = (endDate.getMonth() + 1) + '/' + endDate.getDate() + '/' + endDate.getFullYear();
                    addDiv.innerHTML += '<ion-item class="item-thumbnail-left"> <h4>Timeslot: ' + timeSlots + '</h4> <p>Start: ' + startDateStr + " " + startTime.getUTCHours() + ':00 </p> <p>End: ' + endDateStr + " " + endTime.getUTCHours() + ':00 </p></ion-item>';
                    var dict = {
                        'startDate': startDate,
                        'startTime': startTime.getUTCHours(),
                        'endDate': endDate,
                        'endTime': endTime.getUTCHours()
                    };
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


//map controller
.controller('MapCtrl', function($scope, $state, $cordovaGeolocation, parkerSearch) {
    var options = {
        timeout: 10000,
        enableHighAccuracy: true
    };

    $cordovaGeolocation.getCurrentPosition(options).then(function(position) {

        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
        google.maps.event.addListenerOnce($scope.map, 'idle', function() {
            var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
            var marker = new google.maps.Marker({
                map: $scope.map,
                animation: google.maps.Animation.DROP,
                icon: image,
                position: latLng
            });
            //get all the parking spaces within three miles of current location
            var myGeoPoint = new Parse.GeoPoint({
                latitude: latitude,
                longitude: longitude
            });
            console.log(myGeoPoint);
            var parkingSpace = Parse.Object.extend("ParkingSpace");
            var query = new Parse.Query(parkingSpace);
            query.withinMiles("location", myGeoPoint, 3);
            console.log("do i get here? right before query.find");
            query.find({
                success: function(results) {
                    console.log("Total: " + results.length);
                    var usedNames = new Set();
                    // console.log("parking space objects: " + JSON.stringify(results));
                    for (var i = 0; i < results.length; i++) {
                        if (usedNames.has(results[i].get("name"))) {
                            continue;
                        }
                        usedNames.add(results[i].get("name"));
                        var newLat = results[i].get("location")._latitude;
                        console.log(results[i].get("location")._latitude);
                        var newLng = results[i].get("location")._longitude;
                        var newLatLng = new google.maps.LatLng(newLat, newLng);
                        console.log(newLatLng);
                        console.log(results[i]);
                        var newMarker = new google.maps.Marker({
                            map: $scope.map,
                            animation: google.maps.Animation.DROP,
                            position: newLatLng
                        });

                    }
                },
                error: function(error) {
                    alert("Error when getting objects!");
                }
            });

            var infoWindow = new google.maps.InfoWindow({
                content: "Current Location"
            });

            google.maps.event.addListener(marker, 'click', function() {
                infoWindow.open($scope.map, marker);
            });

        });

    }, function(error) {
        console.log("Could not get location");
    });






})
