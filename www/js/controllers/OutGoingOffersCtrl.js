/**
 * Created by kennylu on 2/18/16.
 */
angular.module('starter')

  .controller('OutgoingOffersCtrl', function($scope, $http, serverLocation, SessionService, $q, $ionicLoading) {

    var userId = SessionService.getUserId();
    var promises = [];
    $scope.itemArray = [];
    $scope.itemsExist = false;

    $scope.$on('$ionicView.enter', function() {

      $scope.show = function() {
        $ionicLoading.show({
          template: 'Loading...'
        });


      };

      $scope.hide = function(){
        $ionicLoading.hide();
      };

      $scope.show();

      $http.get(serverLocation + '/users/id/' + userId)
        .then(function(response) {

          promises = [];
          $scope.itemArray = [];
          $scope.hide();

          if(response.data.likeditems != 0) {
            $scope.itemsExist = true;
          } else {
            $scope.noDataMsg = "-No outgoing offers.  Search for some items.-"
          }

          angular.forEach(response.data.likeditems, function(itemId, key) {
            var promise = $http.get(serverLocation + '/items/' + itemId);

            promises.push(promise);
          })

          $q.all(promises)
            .then(function(response) {
              //console.log(response);

              angular.forEach(response, function(item) {
                $scope.itemArray.push(item.data[0])
              })
              console.log($scope.itemArray)

            })
        },(function(err) {
          $scope.hide();
          console.log(err);
        }));


    })

    $scope.doRefresh = function() {
      $http.get(serverLocation + '/users/id/' + userId)
        .then(function(response) {

          promises = [];
          $scope.itemArray = [];
          $scope.hide();

          if(response.data.likeditems != 0) {
            $scope.itemsExist = true;
          }

          angular.forEach(response.data.likeditems, function(itemId, key) {
            var promise = $http.get(serverLocation + '/items/' + itemId);

            promises.push(promise);
          })

          $q.all(promises)
            .then(function(response) {
              //console.log(response);

              angular.forEach(response, function(item) {
                $scope.itemArray.push(item.data[0])
              });
              console.log($scope.itemArray)

            })
        },(function(err) {

          console.log(err);
        }))
        .finally(function() {
          // Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
        });
    };


  });
