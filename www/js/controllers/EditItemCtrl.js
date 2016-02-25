/**
 * Created by kennylu on 2/20/16.
 */
angular.module('starter')

  .controller('EditItemCtrl', function($scope, $http, $state, serverLocation, $ionicPopup, SessionService, $stateParams, $ionicHistory) {

    var itemId = $stateParams.id;
    var username = SessionService.getUserAuthenticated();


    var itemInfo = {}
    $scope.item = {}


    $http.get(serverLocation + '/items/' + itemId)
      .then(function(response) {
        itemInfo = response.data[0];

        $scope.item.itemName = itemInfo.itemname;
        $scope.item.itemBrand = itemInfo.brand;
        $scope.item.itemType =itemInfo.type;
        $scope.item.itemCondition = itemInfo.condition;
        $scope.item.itemDescription = itemInfo.description;
      })

    var actionSuccess = function(action) {

      if (action === "edit") {
        var popup = $ionicPopup.alert({
          title: 'Item Edited Successfully.'
        })
      } else {
        var popup = $ionicPopup.alert({
          title: 'Item Deleted Successfully.'
        })
      }


      popup.then(function(res) {
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go("app.mydaytrader");
      })
    };

    var actionFailure = function(error) {
      $ionicPopup.alert({
        title: 'Something Went Wrong: '
      })
    };



    $scope.editItem = function() {
      var data = {
        itemname: $scope.item.itemName,
        brand: $scope.item.itemBrand,
        type: $scope.item.itemType,
        condition: $scope.item.itemCondition,
        description: $scope.item.itemDescription
      }

      $http.put(serverLocation + '/items/edit/' + itemId, data)
        .then(function(response) {
          actionSuccess("edit");
        }, function(error) {
          actionFailure(error);
        })
    }

    $scope.deleteItem = function() {
      $http.delete(serverLocation + '/items/' + itemId)
        .then(function(response) {
          actionSuccess("delete");
        }, function(error) {
          actionFailure(error);
        })
    }
  });
