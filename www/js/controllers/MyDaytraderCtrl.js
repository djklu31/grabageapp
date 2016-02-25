/**
 * Created by kennylu on 2/18/16.
 */
angular.module('starter')

.controller('MyDaytraderCtrl', function($scope, $http, $state, serverLocation, SessionService, $ionicLoading) {

    $scope.userData = {};
    $scope.itemsExist = false;
    var id = SessionService.getUserId();


    $scope.$on('$ionicView.enter', function() {
      //$http.get(serverLocation + '/users/' + SessionService.getUserAuthenticated())
      //  .then(function(response) {
      //    $scope.userData = response.data.items;
      //
      //    console.log($scope.userData.length);
      //
      //    if($scope.userData.length == 0) {
      //
      //      $scope.noDataMsg = "You have no items.  Add some of your \"junk\" now and you may come up with a treasure." + "<br>" + "-Confucious"
      //    } else {
      //      $scope.itemsExist = true;
      //
      //    }
      //  });
      fetchNotifications();

      $scope.noNotes = false;

      $scope.show = function() {
        $ionicLoading.show({
          template: 'Loading...'
        });


      };

      $scope.hide = function(){
        $ionicLoading.hide();
      };

      $scope.show();


      $http.get(serverLocation + '/items/user/' + id)
        .then(function(response) {
          $scope.userData = response.data;

          //console.log($scope.userData);

          $scope.hide();

          if($scope.userData.length == 0) {

            $scope.noDataMsg = "You have no items.  Add some of your \"junk\" now and you may come up with a treasure." + "<br>" + "-Confucious"
          } else {
            $scope.itemsExist = true;

          }
        })
    },(function(err) {
      $scope.hide();
      console.log(err);
    }));


    $scope.doRefresh = function() {
      $http.get(serverLocation + '/items/user/' + id)
        .then(function(response) {
          $scope.userData = response.data;

          if($scope.userData.length == 0) {

            $scope.noDataMsg = "You have no items.  Add some of your \"junk\" now and you may come up with a treasure." + "<br>" + "-Confucious"
          } else {
            $scope.itemsExist = true;

          }
        })
        .finally(function() {
          // Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
        });
    };

    $scope.goAddItems = function() {
      $state.go("app.additem");
    }

    var fetchNotifications = function() {

      $http.get(serverLocation + '/users/id/' + id)
        .then(function(response) {



          $scope.notifications = response.data.notifications;

          if($scope.notifications.length === 0){
            $scope.noNotes = true;
          }



          angular.forEach($scope.notifications, function(data, key) {

            console.log(data)

            if(data.type === "Declined") {
              console.log("Declined");

              var message = data.username + " declined your offer for " + data.itemname;

              $scope.notifications[key].message = message;

              $scope.notifications[key].icon = 'icon ion-backspace-outline'






            } else if (data.type === "Accepted") {

              var message = data.username + " has made you an offer for " + data.itemname;

              $scope.notifications[key].message = message;

              $scope.notifications[key].icon = 'icon ion-ribbon-a'


            }

          })

          console.log($scope.notifications)

        })

    }

    $scope.removeNotification = function(id) {
      console.log(id)
      $http.put(serverLocation + '/users/notifications/delete/' + id)
    }

  });
