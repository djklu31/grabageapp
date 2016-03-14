/**
 * Created by kennylu on 2/22/16.
 */
angular.module('starter')

.controller('ItemCtrl', function($scope, $http, $stateParams, serverLocation, SessionService, $ionicPopup, $state, $ionicModal) {

    var userId = SessionService.getUserId();
    var userName = SessionService.getUserAuthenticated();
    $scope.message = {};

    $scope.itemname = $stateParams.itemname;
    $scope.brand = $stateParams.brand;
    $scope.itemId = $stateParams.id;
    $scope.alreadyInterested = false;
    $scope.myItem = false;
    $scope.interestLength = 0;

    var messageSuccess = function() {
      $ionicPopup.alert({
        title: 'Your message has been sent'
      }).then(function(res) {
        $scope.closeModal();
        $scope.message.message = '';
      })
    };


    var interestSuccess = function() {
      $ionicPopup.alert({
        title: 'The owner has been notified of your interest'
      }).then(function(res) {
        $state.go("app.mydaytrader");
      })
    };

    var timeoutNotice = function() {
      $ionicPopup.alert({
        title: 'There was a problem with your request.'
      })
    };

    $http.get(serverLocation + '/users/interests/' + userId)
      .then(function(response) {

        angular.forEach(response.data[0].interests, function(interest, key) {
          if(interest.itemid === $scope.itemId) {
            $scope.interestLength++;
          }
        })
      });


    $http.get(serverLocation + '/items/' + $stateParams.id)
      .then(function(response) {
        $scope.myItem = false;
        $scope.alreadyInterested = false;

        $scope.itemData = response.data[0];

        console.log($scope.itemData)

        if($scope.itemData.ownerId === userId) {
          $scope.myItem = true;

        }

        angular.forEach(response.data[0].incomingtraderequests, function(traderequest, key) {
          //console.log(traderequest.otheruser)
          if(userId == traderequest.otheruser) {
            $scope.alreadyInterested = true;
          }
        });

        console.log($scope.alreadyInterested);

        $http.get(serverLocation + '/users/id/' + response.data[0].ownerId)
          .then(function(response) {
            $scope.userData = response.data;

            $scope.ownerName = $scope.userData.username
          })
      });

    $scope.interested = function() {

      //console.log(userId);

      var data = {
        otheruser: userId,
        status: "Pending"
      };

      $http.put(serverLocation + '/items/interest/' + $scope.itemId, data)
        .then(function(response) {

          if(response.status === 200) {

            $http.get(serverLocation + '/items/' + $stateParams.id)
              .then(function(response) {

                console.log("RESPONSE: " + response)

                var requestId = response.data[0].incomingtraderequests[response.data[0].incomingtraderequests.length-1]._id;
                var ownerId = response.data[0].ownerId;

                var data3 = {
                  itemname: $scope.itemData.itemname,
                  beenseen: false,
                  status: 'Pending',
                  interesteduser: userName,
                  requestid: response.data[0].incomingtraderequests[response.data[0].incomingtraderequests.length-1]._id,
                  itemid: $scope.itemId,
                  interesteduserid: userId
                }

                $http.put(serverLocation + '/users/interests/' + ownerId, data3)
                  .then(function(response) {

                    $http.get(serverLocation + '/users/interests/' + ownerId)
                      .then(function(response) {

                        var lastAddedInterestId = response.data[0].interests[response.data[0].interests.length-1]._id;

                        //console.log("INTERESTSLASTADDDEDJAM: " + lastAddedInterestId);

                        var data2 = {
                          type: 'Liked',
                          itemname: $scope.itemData.itemname,
                          username: userName,
                          requestid: requestId,
                          itemid: $scope.itemId,
                          interestid: lastAddedInterestId,
                          userid: userId
                        };


                        $http.put(serverLocation + '/users/notifications/' + ownerId, data2)
                          .then(function(response) {

                            interestSuccess();
                            console.log(response)

                          })

                      })

                  })
              });

            $scope.alreadyInterested = true;
          } else {
            timeoutNotice();
          }
        })
    }

    //*******************************************************************************************************************
    //modal section for messages
    $ionicModal.fromTemplateUrl('templates/sendMessage.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });


    $scope.openMessageBox = function() {

      $scope.subject = "Question regarding item: " + $scope.itemname + " by " + $scope.brand + ".";

      $scope.openModal();
    }

    $scope.sendMessage = function() {

      var datetime = new Date();

      $http.get(serverLocation + '/messages/' + $scope.itemData.ownerId)
        .then(function(response) {

          var messages = response.data[0].messages;
          var chatLogExistsMessageId;

          if(messages.length === 0) {

            var data = {
              message: $scope.message.message,
              subject: $scope.subject,
              datetime: datetime,
              ownersmessage: false,
              username: userName,
              otheruserid: userId,
              otherusername: userName,
              userid: $scope.itemData.ownerId
            };

            $http.put(serverLocation + '/messages/chatlog/new', data)
              .then(function(response) {

                $http.put(serverLocation + '/users/notifications/' + $scope.itemData.ownerId, data)
                  .then(function(response) {
                        messageSuccess();
                  })

              })

          } else {
            for (var i = 0; i < messages.length; i++) {
              if(messages[i].otheruserid === userId && messages[i].subject === $scope.subject) {
                chatLogExistsMessageId = messages[i]._id;
                break;
              }
            }

            if(chatLogExistsMessageId) {
              console.log(chatLogExistsMessageId);

              var data = {
                datetime: datetime,
                message: $scope.message.message,
                ownersmessage: false
              }

              $http.put(serverLocation + '/messages/chatlog/addto/' + chatLogExistsMessageId, data)
                .then(function(response) {

                  var data = {
                    type: "New Message",
                    username: userName,
                    messageid: chatLogExistsMessageId,
                    itemname: $scope.itemname
                  }

                  $http.put(serverLocation + '/users/notifications/' + $scope.itemData.ownerId, data)
                    .then(function(response) {
                      $http.put(serverLocation + '/messages/status/notseen/' + chatLogExistsMessageId)
                        .then(function(response) {
                          messageSuccess();
                        })
                    })

                })



            } else {

              var data = {
                message: $scope.message.message,
                subject: $scope.subject,
                datetime: datetime,
                ownersmessage: false,
                username: userName,
                otheruserid: userId,
                otherusername: userName,
                userid: $scope.itemData.ownerId
              }

              $http.put(serverLocation + '/messages/chatlog/new', data)
                .then(function(response) {

                  var data = {
                    type: "New Message",
                    username: userName,
                    messageid: chatLogExistsMessageId,
                    itemname: $scope.itemname
                  }

                  $http.put(serverLocation + '/users/notifications/' + $scope.itemData.ownerId, data)
                    .then(function(response) {

                      $http.put(serverLocation + '/messages/status/notseen/' + chatLogExistsMessageId)
                        .then(function(response) {
                          messageSuccess();
                        })

                    })


                })
            }
          }
        })
    }

    $scope.cancelMessage = function() {
      $scope.closeModal();
    }

  });
