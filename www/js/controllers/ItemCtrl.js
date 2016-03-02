/**
 * Created by kennylu on 2/22/16.
 */
angular.module('starter')

.controller('ItemCtrl', function($scope, $http, $stateParams, serverLocation, SessionService, $ionicPopup, $state) {

    var userId = SessionService.getUserId();
    var userName = SessionService.getUserAuthenticated();

    $scope.itemname = $stateParams.itemname;
    $scope.brand = $stateParams.brand;
    $scope.itemId = $stateParams.id;
    $scope.alreadyInterested = false;
    $scope.myItem = false;

    var interestSuccess = function() {
      $ionicPopup.alert({
        title: 'The owner has been notified of your interest'
      }).then(function(res) {
        $state.go("app.mydaytrader");
      })
    };

    var timeoutNotice = function() {
      $ionicPopup.alert({
        title: 'There was a problem with your request.'
      })
    };


    $http.get(serverLocation + '/items/' + $stateParams.id)
      .then(function(response) {
        $scope.myItem = false;
        $scope.alreadyInterested = false;

        $scope.itemData = response.data[0];

        console.log($scope.itemData)

        $scope.interestLength = $scope.itemData.incomingtraderequests.length;

        if($scope.itemData.ownerId === userId) {
          $scope.myItem = true;

        }

        angular.forEach(response.data[0].incomingtraderequests, function(traderequest, key) {
          //console.log(traderequest.otheruser)
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

      //console.log(userId);

      var data = {
        otheruser: userId,
        status: "Pending"
      };

      $http.put(serverLocation + '/items/interest/' + $scope.itemId, data)
        .then(function(response) {

          if(response.status === 200) {

            $http.get(serverLocation + '/items/' + $stateParams.id)
              .then(function(response) {

                console.log("RESPONSE: " + response)

                var requestId = response.data[0].incomingtraderequests[response.data[0].incomingtraderequests.length-1]._id;
                var ownerId = response.data[0].ownerId;

                var data3 = {
                  itemname: $scope.itemData.itemname,
                  beenseen: false,
                  status: 'Pending',
                  interesteduser: userName,
                  requestid: response.data[0].incomingtraderequests[response.data[0].incomingtraderequests.length-1]._id,
                  itemid: $scope.itemId,
                  interesteduserid: userId
                }

                $http.put(serverLocation + '/users/interests/' + ownerId, data3)
                  .then(function(response) {

                    $http.get(serverLocation + '/users/interests/' + ownerId)
                      .then(function(response) {

                        var lastAddedInterestId = response.data[0].interests[response.data[0].interests.length-1]._id;

                        //console.log("INTERESTSLASTADDDEDJAM: " + lastAddedInterestId);

                        var data2 = {
                          type: 'Liked',
                          itemname: $scope.itemData.itemname,
                          username: userName,
                          requestid: requestId,
                          itemid: $scope.itemId,
                          interestid: lastAddedInterestId,
                          userid: userId
                        };


                        $http.put(serverLocation + '/users/notifications/' + ownerId, data2)
                          .then(function(response) {

                            interestSuccess();
                            console.log(response)

                          })

                      })

                  })
              });

            $scope.alreadyInterested = true;
          } else {
            timeoutNotice();
          }
        })
    }

  });
