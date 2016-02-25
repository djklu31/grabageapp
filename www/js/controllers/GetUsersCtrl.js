/**
 * Created by kennylu on 2/4/16.
 */

angular.module('starter')

  .controller('GetUsersController', function($scope, $http, serverLocation) {


    var getUsers = function() {
      $http.get(serverLocation + '/users')
        .then(function(response) {
          $scope.userInfo = response.data;

          //console.log(JSON.stringify($scope.userInfo));
        })
    }

    $scope.deleteUser = function(id) {
      $http.delete(serverLocation + '/users/' + id)
        .then(function(response) {
          console.log(id);
          getUsers();
        })
    }

    getUsers();

  });
