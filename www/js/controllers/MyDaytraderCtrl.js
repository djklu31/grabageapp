/**
 * Created by kennylu on 2/18/16.
 */
angular.module('starter')

.controller('MyDaytraderCtrl', function($scope, $http, $state, serverLocation, SessionService, $ionicLoading, $ionicListDelegate) {

    $scope.userData = {};
    $scope.itemsExist = false;
    var id = SessionService.getUserId();
    var interestCount = 0;


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

      //$scope.noNotes = false;

      $scope.show = function() {
        $ionicLoading.show({
          template: 'Loading...'
        });


      };

      $scope.hide = function(){
        $ionicLoading.hide();
      };

      $scope.show();


      $http.get(serverLocation + '/users/items/' + id)
        .then(function(response) {
          $scope.userData = response.data;

          //console.log($scope.userData);

          $scope.hide();

          $http.get(serverLocation + '/users/interests/' + id)
            .then(function(response) {
              angular.forEach($scope.userData, function(item, key) {
                interestCount = 0;
                angular.forEach(response.data[0].interests, function(interest, key) {
                  if(interest.itemid === item._id) {
                    interestCount++;
                  }
                })

                item.interestLength = interestCount;

              })

              console.log($scope.userData);
            })

          if($scope.userData.length == 0) {

            $scope.noDataMsg = "<h1>Welcome " + SessionService.getUserAuthenticated() + "!<br><br>You have no items.  Add some of your \"junk\" now and you may come up with a treasure." + "<br>" + "-Confucious"
          } else {
            $scope.itemsExist = true;

          }
        })
    },(function(err) {
      $scope.hide();
      console.log(err);
    }));


    $scope.doRefresh = function() {
      $http.get(serverLocation + '/users/items/' + id)
        .then(function(response) {


          $scope.userData = response.data;

          if($scope.userData.length == 0) {

            $scope.noDataMsg = "<h1>Welcome " + SessionService.getUserAuthenticated() + "!<br>You have no items.  Add some of your \"junk\" now and you may come up with a treasure." + "<br>" + "-Confucious"
          } else {
            $scope.itemsExist = true;

            $http.get(serverLocation + '/users/interests/' + id)
              .then(function(response) {
                angular.forEach($scope.userData, function(item, key) {
                  interestCount = 0;
                  angular.forEach(response.data[0].interests, function(interest, key) {
                    if(interest.itemid === item._id) {
                      interestCount++;
                    }
                  })

                  item.interestLength = interestCount;

                })

                console.log($scope.userData);
              })

          }
        })
        .finally(function() {
          fetchNotifications();
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

          console.log($scope.notifications)

          //if(($scope.notifications && $scope.notifications.length === 0) || !$scope.notifications){
          //  $scope.noNotes = true;
          //}



          angular.forEach($scope.notifications, function(data, key) {

            console.log(data)

            if(data.type === "Interest Declined") {
              console.log("Interest Declined");

              var message = data.username + " declined your interest for their " + data.itemname;

              $scope.notifications[key].message = message;

              $scope.notifications[key].icon = 'icon ion-backspace-outline';

              $scope.notifications[key].url = 'app.mydaytrader';


            } else if (data.type === "Offer Declined") {


              var message = data.username + " declined your offer for their " + data.itemname;

              $scope.notifications[key].message = message;

              $scope.notifications[key].icon = 'icon ion-backspace';

              $scope.notifications[key].url = 'app.mydaytrader';



            } else if (data.type === "Offer Made") {

              var message = data.username + " has made you an offer for your " + data.itemname;

              $scope.notifications[key].message = message;

              $scope.notifications[key].icon = 'icon ion-ribbon-a'

              $scope.notifications[key].url = 'app.seeoffer({requestid: note.requestid, offereduserid: note.userid, itemid: note.itemid, itemname: note.itemname, offerid: note.offerid})';
            } else if (data.type === "Liked") {

              var message = data.username + " is interested in your " + data.itemname + ".";

              $scope.notifications[key].message = message;

              $scope.notifications[key].icon = 'icon ion-thumbsup';

              $scope.notifications[key].url = 'app.browseuseritems({itemid: note.itemid, userid: note.userid, itemname: note.itemname, requestid: note.requestid, interestid: note.interestid})'

            } else if (data.type === "Offer Accepted") {

              var message = data.username + " has accepted your offer for your " + data.itemname + ".";

              $scope.notifications[key].message = message;

              $scope.notifications[key].icon = 'icon ion-trophy';

              $scope.notifications[key].url = 'app.messages'

            } else if (data.type === "New Message") {

              var message = data.username + " has sent you a message regarding " + data.itemname + ".";

              $scope.notifications[key].message = message;

              $scope.notifications[key].icon = 'icon ion-ios-email';

              $scope.notifications[key].url = 'app.chatlog({id: note.messageid, otheruser: note.otherusername})'

            }

          })



        })

    }

    $scope.removeNotification = function(id, index) {
      console.log(id)
      $http.put(serverLocation + '/users/notifications/delete/' + id)
        .then(function(response) {
          $scope.notifications.splice($scope.notifications.length-1-index, 1);
        })
    }


  });
