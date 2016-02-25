/**
 * Created by kennylu on 2/24/16.
 */
angular.module('starter')

.controller('BrowseUsersCtrl', function($scope, $http, SessionService, serverLocation, $stateParams, $q) {
    $scope.itemId = $stateParams.id;
    var promises = [];
    $scope.usersArray = [];
    var requests = [];
    $scope.oldInterests = [];
    $scope.newInterests = [];
    $scope.noNewInterests = false;
    $scope.noOldInterests = false;

    $http.get(serverLocation + '/items/' + $scope.itemId)
      .then(function(response) {
        //console.log(response.data[0].incomingtraderequests);
        //console.log(response)
        promises = [];
        $scope.usersArray = [];
        requests = [];
        $scope.oldInterests = [];
        $scope.newInterests = [];

        $scope.itemName = response.data[0].itemname;

        console.log($scope.itemName)
        //console.log(response.data[0].incomingtraderequests);

        angular.forEach(response.data[0].incomingtraderequests, function(tradeRequest) {
          //console.log(tradeRequest._id)
          requests.push(tradeRequest);

          var promise = $http.get(serverLocation + '/users/id/' + tradeRequest.otheruser)

          promises.push(promise);
        })


        $q.all(promises)
          .then(function(response) {
            console.log(response);

            angular.forEach(response, function(user, key) {
              user.data.requestId = requests[key]._id;
              user.data.beenseen = requests[key].beenseen;
              //console.log(user.data.requestId)
              //console.log(user.data.beenseen)



              if(user.data.beenseen === true) {
                $scope.oldInterests.push(user.data);
              } else {
                $scope.newInterests.push(user.data);
                //console.log($scope.newInterests)
              }
            })


            if($scope.oldInterests.length === 0){
              $scope.noOldInterests = true;
            }
            if($scope.newInterests.length === 0) {
              $scope.noNewInterests = true;

            }
          })


      })
  })
