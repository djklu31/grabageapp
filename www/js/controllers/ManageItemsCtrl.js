/**
 * Created by kennylu on 2/20/16.
 */
angular.module('starter')

  .controller('ManageItemsCtrl', function($scope, $state) {
    $scope.addItem = function() {
      $state.go("app.additem");
    }

    $scope.editItem = function() {
      $state.go("app.edititemlist");
    }
  });
