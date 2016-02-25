/**
 * Created by kennylu on 2/18/16.
 */
angular.module('starter')

  .controller('LoginScreenCtrl', function($scope, $http, $state, $ionicPopup, $ionicViewSwitcher, serverLocation, SessionService, $ionicLoading) {


    $scope.user = {};

    $scope.show = function() {
      $ionicLoading.show({
        template: 'Loading...'
      });


    };

    $scope.hide = function(){
      $ionicLoading.hide();
    };



    var loginFailure = function() {
      $ionicPopup.alert({
        title: 'User or Password Entered Incorrectly'
      })
    };

    var timeoutNotice = function() {
      $ionicPopup.alert({
        title: 'Problem Connecting to the Server.'
      })
    };


    $scope.checkUser = function() {
      if(!$scope.user.username || !$scope.user.password) {
        loginFailure();
      } else {

        $scope.show();

        $http.get(serverLocation + '/users/' + $scope.user.username)
          .then(function(response) {

            if($scope.user.password !== response.data.password) {
              $scope.hide();
              loginFailure();
            } else {
              $scope.hide();

              SessionService.setUserAuthenticated(response.data.username);
              SessionService.setUserId(response.data._id);

              $ionicViewSwitcher.nextDirection('forward');
              $state.go("app.mydaytrader")
            }
          }, function(err) {
            console.log("User Not Found");

            if(err.status == 0) {
              $scope.hide();
              timeoutNotice();
            }
          })
      }
    }
  });
