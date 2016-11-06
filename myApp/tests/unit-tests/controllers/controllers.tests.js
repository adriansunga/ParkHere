describe('Controllers', function(){

    // tests start here

    describe('login', function() {
      var stateMock, controller, ionicPopupMock, userMock, scope;
      controller = null;
      scope = null;
      console.log("HI PRINTING");
      //beforeEach(function() {module('starter.controllers')});
      //

      beforeEach(module('starter.controllers'));

      beforeEach(inject(function($rootScope, $controller) {
          //console.log("scope value: " + scope);

          scope = $rootScope.$new();
          stateMock = jasmine.createSpyObj('$state spy', ['go']);
          ionicPopupMock = jasmine.createSpyObj('$ionicPopup spy', ['alert']);
          //userMock = jasmine.createSpyObj('$user spy', []);
          // console.log("to controller");
          // console.log("$controller value: " + $controller);
          controller = $controller('LoginCtrl', {$scope: scope, '$state': stateMock, '$ionicPopup': ionicPopupMock, 'user':null});
          // console.log("controller: " + controller);

          // controller.username = "parker@gmail.com";
          // controller.password = "parkerparker5";
          // controller.userType = "parker";
          // controller.login();
      }));
      it('should fail. controller is not null?', function() {
        expect(controller).not.toBeNull();

      });
      it('should have initialized username as undefined', function(){
        console.log("scope.data.username: <" + scope.data.username +">");
        expect(scope.data.username).toBeUndefined();
      });
      // it('has correctly set the username', function() {
      //   controller.username = "parker@gmail.com";
      //   controller.password = "parkerparker5";
      //   controller.userType = "parker";
      //   controller.login();
      //   expect(scope.data.username).toEqual("parker@gmail.com");
      // });
      // it('if parker log in successful, should change state to parkerSearch', function() {
      //   expect(stateMock.go).toHaveBeenCalledWith("parkerSearch");
      // });
    });
});

/*describe('Friends Unit Tests', function(){
    var Friends;
    beforeEach(module('starter.services'));

    beforeEach(inject(function (_Friends_) {
        Friends = _Friends_;
    }));

    it('can get an instance of my factory', inject(function(Friends) {
        expect(Friends).toBeDefined();
    }));

    it('has 5 chats', inject(function(Friends) {
        expect(Friends.all().length).toEqual(5);
    }));

    it('has Max as friend with id 1', inject(function(Friends) {
        var oneFriend = {
            id: 1,
            name: 'Max Lynx',
            notes: 'Odd obsession with everything',
            face: 'https://avatars3.githubusercontent.com/u/11214?v=3&amp;s=460'
        };

        expect(Friends.get(1).name).toEqual(oneFriend.name);
    }));
});*/
