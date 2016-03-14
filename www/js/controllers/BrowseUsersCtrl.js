/**
 * Created by kennylu on 2/24/16.
 */
angular.module('starter')

.controller('BrowseUsersCtrl', function($scope, $http, SessionService, serverLocation, $stateParams, $q, $ionicLoading, $state, $ionicPopup, $ionicListDelegate) {
    $scope.itemId = $stateParams.id;
    var promises = [];
    $scope.usersArray = [];
    var requests = [];
    $scope.oldInterests = [];
    $scope.newInterests = [];
    var userId = SessionService.getUserId();
    $scope.itemName = $stateParams.itemname;

    console.log($stateParams)

    $scope.show = function() {
      $ionicLoading.show({
        template: 'Loading...'
      });

    };

    var authorizeError = function() {
      $ionicPopup.alert({
        title: 'This is not your item.'
      })
    };

    $scope.hide = function(){
      $ionicLoading.hide();
    };

    //$http.get(serverLocation + '/items/' + $scope.itemId)
    //  .then(function(response) {
    //
    //    //authorize user
    //    if(response.data[0].ownerId !== SessionService.getUserId()) {
    //
    //      authorizeError();
    //
    //      $state.go('app.mydaytrader');
    //    }
    //
    //    $scope.show();
    //    //console.log(response.data[0].incomingtraderequests);
    //    //console.log(response)
    //    promises = [];
    //    $scope.usersArray = [];
    //    requests = [];
    //    $scope.oldInterests = [];
    //    $scope.newInterests = [];
    //
    //    $scope.itemName = response.data[0].itemname;
    //
    //    //console.log($scope.itemName)
    //    //console.log(response.data[0].incomingtraderequests);
    //
    //    angular.forEach(response.data[0].incomingtraderequests, function(tradeRequest) {
    //      //console.log(tradeRequest._id)
    //      requests.push(tradeRequest);
    //
    //
    //      var promise = $http.get(serverLocation + '/users/id/' + tradeRequest.otheruser)
    //
    //      promises.push(promise);
    //    });
    //
    //
    //    $q.all(promises)
    //      .then(function(response) {
    //
    //        $scope.hide();
    //
    //        //console.log(response);
    //
    //        angular.forEach(response, function(user, key) {
    //          user.data.requestId = requests[key]._id;
    //          user.data.beenseen = requests[key].beenseen;
    //          user.data.status = requests[key].status;
    //          //console.log(user.data.requestId)
    //          //console.log(user.data.beenseen)
    //
    //
    //
    //          if(user.data.beenseen === true) {
    //            $scope.oldInterests.push(user.data);
    //          } else {
    //            $scope.newInterests.push(user.data);
    //            //console.log($scope.newInterests)
    //          }
    //        })
    //
    //        console.log("OLD RESPONSE:" + JSON.stringify($scope.oldInterests));
    //
    //
    //        if($scope.oldInterests.length === 0){
    //        }
    //        if($scope.newInterests.length === 0) {
    //
    //        }
    //      })
    //
    //
    //  })

    //$scope.$on('$ionicView.enter', function() {
    //  $http.get(serverLocation + '/users/interests/' + userId)
    //    .then(function(response) {
    //      //console.log(response.data[0].interests);
    //
    //      angular.forEach(response.data[0].interests, function(interest, key) {
    //        //console.log(interest);
    //
    //        if(interest.beenseen == false && interest.itemid === $scope.itemId) {
    //          $scope.newInterests.push(interest);
    //        } else if (interest.beenseen == true && interest.itemid === $scope.itemId) {
    //          $scope.oldInterests.push(interest);
    //        }
    //      })
    //
    //      console.log("NEW INTERESTS :" + JSON.stringify($scope.newInterests))
    //      console.log("OLD INTERESTS :" + $scope.oldInterests)
    //
    //    })
    //});

    $http.get(serverLocation + '/users/interests/' + userId)
      .then(function(response) {
        //console.log(response.data[0].interests);

        angular.forEach(response.data[0].interests, function(interest, key) {
          //console.log(interest);

          if(interest.beenseen == false && interest.itemid === $scope.itemId) {
            $scope.newInterests.push(interest);
          } else if (interest.beenseen == true && interest.itemid === $scope.itemId) {
            $scope.oldInterests.push(interest);
          }
        })

        console.log("NEW INTERESTS :" + JSON.stringify($scope.newInterests))
        console.log("OLD INTERESTS :" + $scope.oldInterests)


      })

    $scope.deleteInterest = function(id, age, index) {

      $http.put(serverLocation + '/users/interest/remove/' + id)
        .then(function(response) {

          if(age === 'new') {
            $scope.newInterests.splice(index, 1);
          } else if(age === 'old') {
            $scope.oldInterests.splice(index, 1);
          }

        })

    }




  });
