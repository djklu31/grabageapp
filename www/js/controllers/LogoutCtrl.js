/**
 * Created by kennylu on 2/18/16.
 */
angular.module('starter')

.controller('LogoutCtrl', function(SessionService, $location) {

      SessionService.clearSession();
      $location.path('/login');

  })
