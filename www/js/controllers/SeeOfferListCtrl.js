/**
 * Created by kennylu on 2/26/16.
 */
angular.module('starter')

.controller('SeeOfferListCtrl', function($scope, $http, serverLocation, SessionService, $ionicListDelegate) {

    var userId = SessionService.getUserId();
    $scope.newOffers = [];
    $scope.oldOffers = [];


    //$http.get(serverLocation + '/users/id/' + userId)
    //  .then(function(response) {
    //    console.log(response.data);
    //
    //    console.log(response.data.offers);
    //
    //    $scope.offers = response.data.offers;
    //
    //  })

    $http.get(serverLocation + '/users/offers/' + userId)
      .then(function(response) {
        $scope.offers = response.data[0].offers;

        angular.forEach(response.data[0].offers, function(offer) {
          if(offer.beenseen === false) {
            $scope.newOffers.push(offer);
          } else if(offer.beenseen === true) {
            $scope.oldOffers.push(offer);
          }
        })

        //console.log('NEW OFFERS: ' + JSON.stringify($scope.newOffers));
        //console.log('OLD OFFERS: ' + JSON.stringify($scope.oldOffers));
      })

    $scope.deleteOffer = function(id, age, index) {

      console.log('OLD OFFERS BEFORE: ' + JSON.stringify($scope.oldOffers));

      $http.put(serverLocation + '/users/offers/remove/' + id)
        .then(function(response) {

          if(age === 'new') {
            $scope.newOffers.splice(index, 1);
          } else if(age === 'old') {

            $scope.oldOffers.splice(index, 1);

            //console.log('INDEX: ' + i)
            //
            //console.log('OLD OFFERS AFTER: ' + JSON.stringify($scope.oldOffers));
          }

          $ionicListDelegate.closeOptionButtons();

        });

    }

  })
