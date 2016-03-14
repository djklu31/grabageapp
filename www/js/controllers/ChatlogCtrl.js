/**
 * Created by kennylu on 3/9/16.
 */
angular.module('starter')

.controller('ChatlogCtrl', function($scope, $http, SessionService, serverLocation, $stateParams) {

    var messageId = $stateParams.id;
    $scope.otherUser = $stateParams.otheruser;
    $scope.message = {};

    $http.put(serverLocation + '/messages/status/seen/' + messageId)
      .then(function(response) {
        console.log('Status changed.');
      })

    $http.get(serverLocation + '/messages/chatlog/' + messageId)
      .then(function(response) {

        console.log(response.data);

        $scope.chatlog = response.data[0].messages[0].chatlogs;

        console.log($scope.chatlog);

      })

    $scope.sendMessage = function() {

      var datetime = new Date();

      var data = {
        message: $scope.message.message,
        datetime: datetime,
        ownersmessage: true

      }

      $http.put(serverLocation + '/messages/chatlog/addto/' + messageId, data)
        .then(function(response) {

        })

    }




  });
