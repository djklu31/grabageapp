/**
 * Created by kennylu on 2/24/16.
 */
angular.module('starter')

.controller('BrowseUserItemsCtrl', function($scope, $http, $stateParams, serverLocation, $ionicPopup, $state, SessionService, $state) {

    console.log($stateParams);

    var ownerId = $stateParams.userid;
    var requestId = $stateParams.requestid;
    var itemName = $stateParams.itemname;
    var userName = SessionService.getUserAuthenticated();
    var itemId = $stateParams.itemid;
    var userId = SessionService.getUserId();
    var interestId = $stateParams.interestid;
    var beenSeen = $stateParams.beenseen;

    console.log("ID: " + itemId)

    $scope.checkedStatus = [];
    $scope.checkedArray = [];

    var acceptSuccess = function() {
      $ionicPopup.alert({
        title: 'Offer Sent.'
      }).then(function(res) {
        $state.go("app.mydaytrader");
      })
    };

    var acceptProblem = function() {
      $ionicPopup.alert({
        title: 'There was a problem with your accept request'
      })
    };

    var declineSuccess = function() {
      $ionicPopup.alert({
        title: 'Interest was Declined'
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
      $http.put(serverLocation + '/items/interest/requeststatus/' + requestId, {status: 'Interest Declined'})
        .then(function(response) {

          var data = {
            type: 'Interest Declined',
            requestid: requestId,
            itemname: itemName,
            username: userName,
            interestid: interestId,
            itemid: itemId,
            userid: userId
          }

          $http.put(serverLocation + '/users/notifications/' + ownerId, data)
            .then(function(response) {

            });

          //update status to say 'declined' for the user's interest array
          $http.put(serverLocation + '/users/interest/updatestatus/' + interestId, {status: 'Interest Declined'})
            .then(function(response) {

            });

          declineSuccess();
          $state.go("app.mydaytrader");
        }, function(err) {
          declineProblem();
        })
    }

    $scope.makeOffer = function() {

      var data = {
        items: $scope.checkedArray,
      }

      console.log("Selected items:" + $scope.checkedArray);

      $http.put(serverLocation + '/items/interest/accept/' + requestId, data)
        .then(function(response) {


          $http.put(serverLocation + '/items/interest/requeststatus/' + requestId, {status: "Offer Made"})
            .then(function(response) {

              //update status to say 'offer made' for the user's interest array
              $http.put(serverLocation + '/users/interest/updatestatus/' + interestId, {status: 'Offer Made'})
                .then(function(response) {

                });

              var data = {
                ownername: userName,
                itemid: itemId,
                ownerid: ownerId,
                itemname: itemName,
                requestid: requestId,
                proposedlength: $scope.checkedArray.length,
                offereduserid: userId,
                offerstatus: 'Pending'
              };

              $http.put(serverLocation + '/users/offers/' + ownerId, data)
                .then(function(response) {


                  $http.get(serverLocation + '/users/offers/' + ownerId)
                    .then(function(response) {

                      console.log(response.data);
                      var lastOfferId = response.data[0].offers[response.data[0].offers.length-1]._id;

                      console.log('last id:' + lastOfferId);

                      var data = {
                        type: 'Offer Made',
                        requestid: requestId,
                        itemid: itemId,
                        itemname: itemName,
                        username: userName,
                        userid: userId,
                        offerid: lastOfferId
                      };

                      $http.put(serverLocation + '/users/notifications/' + ownerId, data)
                        .then(function(response) {
                          $http.get(serverLocation + '/users/offers/' + ownerId)
                            .then(function(response) {

                              acceptSuccess();
                              //$state.go("app.mydaytrader");


                            })

                        });

                    })
                })



            }, function(err) {
              console.log("Error changing request status");
              acceptProblem();
            })

        }, function(err) {
          acceptProblem();
        })



    }


    $http.get(serverLocation + '/users/items/' + ownerId)
      .then(function(response) {
        $scope.itemData = response.data;
        console.log($scope.itemData);
      });




    if(beenSeen === 'false') {

      $http.put(serverLocation + '/users/interest/interestseen/' + interestId)
        .then(function(response) {
          console.log("Status Updated");
        }, function(err) {
          console.log("Problem updated status");
        })

    }

  });
