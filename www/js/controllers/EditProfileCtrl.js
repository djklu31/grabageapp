/**
 * Created by kennylu on 2/18/16.
 */
angular.module('starter')

  .controller('EditProfileCtrl', function($scope, $http, $ionicPopup, $cordovaGeolocation, $state, serverLocation, SessionService) {

    var username = SessionService.getUserAuthenticated();

    $scope.gpsLoad = "ion-ios-location";

    $scope.user = {};

    $http.get(serverLocation + '/users/' + SessionService.getUserAuthenticated())
      .then(function(response) {
        $scope.userData = response.data;

        $scope.user.username = $scope.userData.username;
        $scope.user.password = $scope.userData.password;
        $scope.user.location = $scope.userData.location;
        $scope.user.email = $scope.userData.email;
        $scope.user.phonenumber = $scope.userData.phonenumber;

    })



    var userSuccess = function() {
      var alertPopup = $ionicPopup.alert({
        title: 'Edited Profile Successfully'
      })

      alertPopup.then(function(res) {

        SessionService.setUserAuthenticated($scope.user.username);
        $state.go('app.mydaytrader');

      });
    };

    var userFailure = function() {
      var alertPopup = $ionicPopup.alert({
        title: 'Something Went Wrong'
      })

      alertPopup.then(function(res) {
        $state.go('app.editprofile');

      });
    };

    $scope.editUser = function() {

      var data = {
        username: $scope.user.username,
        password: $scope.user.password,
        email: $scope.user.email,
        phonenumber: $scope.user.phonenumber,
        location: $scope.user.location
      };

      $http.put(serverLocation + '/users/' + username , data)
        .then(function(response) {
          userSuccess();



        },function(error) {
          userFailure();
        })

    };

    $scope.getGPS = function() {

      var lat = "";
      var long = "";

      $scope.gpsLoad = "ion-load-a";

      var posOptions = {timeout: 10000, enableHighAccuracy: false};
      $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
          lat  = position.coords.latitude;
          long = position.coords.longitude;
        })
        .then(function() {
          var mapsAPIURL = 'http://maps.google.com/maps/api/geocode/json?latlng=' + lat + ',' + long+ '&sensor=false';

          $http.get(mapsAPIURL)
            .then(function(response) {

              var city = "";
              var state = "";
              console.log(JSON.stringify(response));

              angular.forEach(response.data.results, function(result) {
                if(result.types[0] === 'locality') {
                  city = result.address_components[0].long_name;
                }else if(result.types[0] === 'administrative_area_level_1') {
                  state = result.address_components[0].short_name;
                }
              });

              $scope.user.location = city + ', ' + state;

              $scope.gpsLoad = "ion-ios-location"
            })

        })


    };

  })
