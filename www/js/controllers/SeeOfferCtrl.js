angular.module('starter')

.controller('SeeOfferCtrl', function($scope, $http, SessionService, serverLocation, $stateParams, $q, $ionicPopup, $state) {
    console.log($stateParams);

    var userName = SessionService.getUserAuthenticated();
    var userId = SessionService.getUserId();
    var requestId = $stateParams.requestid;
    $scope.offeredItems = [];
    var promises = [];
    var ownerId = $stateParams.offereduserid;
    var itemId = $stateParams.itemid;
    var itemName = $stateParams.itemname;
    var offerSeenStatus = $stateParams.beenseen;
    var offerId = $stateParams.offerid;

    var acceptSuccess = function() {
      $ionicPopup.alert({
        title: 'Offer was Accepted'
      }).then(function(res) {
        $state.go("app.mydaytrader")
      })
    };

    var acceptProblem = function() {
      $ionicPopup.alert({
        title: 'There was a problem with your offer acceptance.'
      })
    };

    var declineSuccess = function() {
      $ionicPopup.alert({
        title: 'Offer was Declined'
      }).then(function(res) {
        $state.go("app.mydaytrader");
      })
    };

    var declineProblem = function() {
      $ionicPopup.alert({
        title: 'There was a problem with your decline request.'
      }).then(function(res) {
        $state.go("app.mydaytrader");
      })
    };

    $http.get(serverLocation + '/items/interest/itemsproposed/' + requestId)
      .then(function(response) {

        $scope.offeredItems = [];
        promises = [];

        console.log(response);

        var itemsProposed = response.data[0].incomingtraderequests[0].itemsproposed;

        console.log(itemsProposed);

        angular.forEach(itemsProposed, function(itemId, key) {
          var promise = $http.get(serverLocation + '/items/' + itemId)

          promises.push(promise);
        })

        $q.all(promises).then(function(response) {
          angular.forEach(response, function(item) {
            $scope.offeredItems.push(item.data[0]);
          })

        })

      })

    $scope.declineOffer = function() {
      $http.put(serverLocation + '/items/interest/requeststatus/' + requestId, {status: 'Offer Declined'})
        .then(function(response) {

          var data = {
            type: 'Offer Declined',
            requestid: requestId,
            itemname: itemName,
            username: userName,
            itemid: itemId,
            userid: userId
          }

          $http.put(serverLocation + '/users/notifications/' + ownerId, data)
            .then(function(response) {

            })

          $http.put(serverLocation + '/users/offers/changestatus/' + offerId, {status: 'Offer Declined'})
            .then(function(response) {

            })

          declineSuccess();
        }, function(err) {
          declineProblem();
        })
    };

    $scope.acceptOffer = function() {
      $http.put(serverLocation + '/items/interest/requeststatus/' + requestId, {status: 'Offer Accepted'})
        .then(function(response) {

          var data = {
            type: 'Offer Accepted',
            requestid: requestId,
            itemname: itemName,
            username: userName,
            itemid: itemId,
            userid: userId
          }

          $http.put(serverLocation + '/users/notifications/' + ownerId, data)
            .then(function(response) {

            })

          $http.put(serverLocation + '/users/offers/changestatus/' + offerId, {status: 'Offer Accepted'})
            .then(function(response) {

            })

          acceptSuccess();



        }, function(err) {
          acceptProblem();
        });

    };

    if(offerSeenStatus === "false") {
      $http.put(serverLocation + '/users/offers/offerseen/' + offerId)
        .then(function(response) {

        })
    }

  })
