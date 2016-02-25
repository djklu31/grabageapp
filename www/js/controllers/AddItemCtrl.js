angular.module('starter')

.controller('AddItemCtrl', function($scope, $http, $state, serverLocation, $ionicPopup, SessionService, $ionicHistory) {
    $scope.item = {};
    var username = SessionService.getUserAuthenticated();
    var id = SessionService.getUserId();


    var addedSuccess = function() {
      var popup = $ionicPopup.alert({
        title: 'Item Added Successfully.'
      });

      popup.then(function(res) {

        $scope.item.itemName = '';
        $scope.item.itemBrand = '';
        $scope.item.itemType = '';
        $scope.item.itemCondition = '';
        $scope.item.itemDescription = '';


        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go("app.mydaytrader");
      })
    };

    var addedFailure = function(error) {
      $ionicPopup.alert({
        title: 'Something Went Wrong'
      })
    };



    $scope.addItem = function() {
      var data = {
        itemname: $scope.item.itemName,
        brand: $scope.item.itemBrand,
        type: $scope.item.itemType,
        condition: $scope.item.itemCondition,
        description: $scope.item.itemDescription,
        ownerId: id
      };

      $http.post(serverLocation + '/items/', data)
        .then(function() {
          addedSuccess();
        }, function(error) {
          addedFailure(error);
        });

      //$http.put(serverLocation + '/items/' + username, data)
      //  .then(function() {
      //    addedSuccess();
      //  }, function(error) {
      //    addedFailure(error);
      //  })
    }

  });
