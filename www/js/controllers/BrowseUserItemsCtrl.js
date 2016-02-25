/**
 * Created by kennylu on 2/24/16.
 */
angular.module('starter')

.controller('BrowseUserItemsCtrl', function($scope, $http, $stateParams, serverLocation, $ionicPopup, $state, SessionService) {

    console.log($stateParams);

    var ownerId = $stateParams.userid;
    var requestId = $stateParams.requestid;
    var itemName = $stateParams.itemname;
    var userName = SessionService.getUserAuthenticated();

    $scope.checkedStatus = [];
    $scope.checkedArray = [];

    var acceptSuccess = function() {
      $ionicPopup.alert({
        title: 'Offer Sent.'
      })
    };

    var acceptProblem = function() {
      $ionicPopup.alert({
        title: 'There was a problem with your accept request'
      })
    };

    var declineSuccess = function() {
      $ionicPopup.alert({
        title: 'Offer Declined'
      })
    };

    var declineProblem = function() {
      $ionicPopup.alert({
        title: 'There was a problem with your decline request.'
      })
    };

    $scope.check = function(index, id) {
      if($scope.checkedStatus[index] === true) {
        $scope.checkedStatus[index] = false;

        var i = $scope.checkedArray.indexOf(id);
        $scope.checkedArray.splice(i, 1);

      } else {
        $scope.checkedStatus[index] = true;
        $scope.checkedArray.push(id);
      }

    }

    $scope.declineOffer = function() {
      $http.put(serverLocation + '/items/interest/requeststatus/' + requestId, {status: "Declined"})
        .then(function(response) {

          var data = {
            type: 'Declined',
            requestid: requestId,
            itemname: itemName,
            username: userName
          }

          $http.put(serverLocation + '/users/notifications/' + ownerId, data)
            .then(function(response) {

            })

          declineSuccess();
          $state.go("app.mydaytrader");
        }, function(err) {
          declineProblem();
        })
    }

    $scope.acceptOffer = function() {

      var data = {
        items: $scope.checkedArray
      }

      console.log("Selected items:" + $scope.checkedArray);

      $http.put(serverLocation + '/items/interest/accept/' + requestId, data)
        .then(function(response) {

          $http.put(serverLocation + '/items/interest/requeststatus/' + requestId, {status: "Accepted"})
            .then(function(response) {

              var data = {
                type: 'Accepted',
                requestid: requestId,
                itemname: itemName,
                username: userName
              }

              $http.put(serverLocation + '/users/notifications/' + ownerId, data)
                .then(function(response) {

                  acceptSuccess();
                  $state.go("app.mydaytrader");

                })


            }, function(err) {
              console.log("Error changing request status");
              acceptProblem();
            })

        }, function(err) {
          acceptProblem();
        })

    }


    $http.get(serverLocation + '/items/user/' + ownerId)
      .then(function(response) {
        $scope.itemData = response.data;
        console.log($scope.itemData);
      });

    $http.put(serverLocation + '/items/interest/statusupdate/' + requestId)
      .then(function(response) {
        console.log("Status Updated");
      }, function(err) {
        console.log("Problem updated status");
      })



  });
