/**
 * Created by kennylu on 2/1/16.
 */
angular.module('starter')

.controller('MainController', function($scope, $http, SessionService, serverLocation, $q) {

    var userData = {};
    $scope.item = {};
    var i = 0;
    var promises = [];

    $http.get(serverLocation + '/users/' + SessionService.getUserAuthenticated())
      .then(function(response) {

      userData = response.data;

      $scope.username = userData.username;

      $scope.messageLength = userData.messages.length;

    })

    $scope.search = function() {

      promises = [];

      $http.get(serverLocation + '/items/search/' + $scope.item.searchText)
        .then(function(response) {

          $scope.itemsData = response.data;

          angular.forEach(response.data, function(owner) {

            var promise = $http.get(serverLocation + '/users/id/' + owner.ownerId);

            promises.push(promise);

          });


          $q.all(promises).then(function(response) {

            console.log(response);

            angular.forEach(response, function(owner, key) {
              $scope.itemsData[key].username = owner.data.username;
              $scope.itemsData[key].location = owner.data.location;
            })


          });


        })


    }


  });

