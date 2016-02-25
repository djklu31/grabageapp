/**
 * Created by kennylu on 2/18/16.
 */
angular.module('starter')

.controller('CreateUserMenu', function($scope, $state, $ionicViewSwitcher) {
    $scope.goBack = function() {
      $ionicViewSwitcher.nextDirection('back');
      $state.go("login");
    }
  });
