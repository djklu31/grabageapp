/**
 * Created by kennylu on 2/20/16.
 */
angular.module('starter')

  .controller('EditItemListCtrl', function($scope, $state, $http, serverLocation, SessionService) {

    $scope.items = {};
    $scope.itemsExist = false;
    var userId = SessionService.getUserId();

    $http.get(serverLocation + '/users/items/' + userId)
      .then(function(response){
        $scope.items = response.data;

        if($scope.items.length == 0) {

          $scope.noDataMsg = "You have no items.  Add some of your \"junk\" now and you may come up with a treasure." + "<br>" + "-Confucious"
        } else {
          $scope.itemsExist = true;

        }
      })

    $scope.goAddItems = function() {
      $state.go("app.additem");
    }
  })
