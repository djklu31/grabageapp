/**
 * Created by kennylu on 2/22/16.
 */
angular.module('starter')

.controller('ItemCtrl', function($scope, $http, $stateParams, serverLocation, SessionService, $ionicPopup) {

    var userId = SessionService.getUserId();

    $scope.itemname = $stateParams.itemname;
    $scope.brand = $stateParams.brand;
    var itemId = $stateParams.id;
    $scope.alreadyInterested = false;

    var interestSuccess = function() {
      $ionicPopup.alert({
        title: 'The owner has been notified of your interest'
      })
    };

    var timeoutNotice = function() {
      $ionicPopup.alert({
        title: 'There was a problem with your request.'
      })
    };


    $http.get(serverLocation + '/items/' + $stateParams.id)
      .then(function(response) {
        $scope.itemData = response.data[0];

        angular.forEach(response.data[0].incomingtraderequests, function(traderequest, key) {
          console.log(traderequest.otheruser)
          if(userId == traderequest.otheruser) {
            $scope.alreadyInterested = true;
          }
        });

        console.log($scope.alreadyInterested);

        $http.get(serverLocation + '/users/id/' + response.data[0].ownerId)
          .then(function(response) {
            $scope.userData = response.data;
          })
      });

    $scope.interested = function() {

      console.log(userId);

      var data = {
        otheruser: userId,
        status: "Pending"
      };

      $http.put(serverLocation + '/items/interest/' + itemId, data)
        .then(function(response) {
          if(response.status === 200) {
            interestSuccess();
            $scope.alreadyInterested = true;
          } else {
            timeoutNotice();
          }
        })
    }

  });
