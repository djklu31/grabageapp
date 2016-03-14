/**
 * Created by kennylu on 2/18/16.
 */
angular.module('starter')

.controller('MessagesCtrl', function($scope, $http, SessionService, serverLocation) {

    //var username = SessionService.getUserAuthenticated();
    var userId = SessionService.getUserId();
    $scope.newMessages = [];
    $scope.oldMessages = [];

    $http.get(serverLocation + '/messages/' + userId)
      .then(function(response) {
        console.log(response.data[0].messages);

        $scope.messages = response.data[0].messages;

        for(var i = 0; i < $scope.messages.length; ++i) {

          //console.log($scope.messages[i].chatlogs[$scope.messages[i].chatlogs.length-1].message);

          if($scope.messages[i].chatlogs[$scope.messages[i].chatlogs.length-1] !== undefined && $scope.messages[i].beenseen === false) {
            $scope.messages[i].latestmessage = $scope.messages[i].chatlogs[$scope.messages[i].chatlogs.length-1].message;
            //$scope.newMessages[i].datetime = $scope.messages[i].chatlogs[$scope.messages[i].chatlogs.length-1].datetime;
            $scope.newMessages.push($scope.messages[i]);

          } else if($scope.messages[i].chatlogs[$scope.messages[i].chatlogs.length-1] !== undefined && $scope.messages[i].beenseen === true) {
            $scope.messages[i].latestmessage = $scope.messages[i].chatlogs[$scope.messages[i].chatlogs.length-1].message;
            //$scope.oldMessages[i].datetime = $scope.messages[i].chatlogs[$scope.messages[i].chatlogs.length-1].datetime;
            $scope.oldMessages.push($scope.messages[i]);
          }
        }
      });

    $scope.deleteMessage = function(messageid, index) {
      $http.put(serverLocation + '/messages/delete/' + messageid)
        .then(function(response) {

          $scope.messages.splice(index, 1);

        })
    }
  })
