/**
 * Created by kennylu on 2/1/16.
 */

angular.module('starter')

.factory('serverLocation', function() {
    return 'http://localhost:3000';
    //return 'http://itemsnodeserver.herokuapp.com';
  })

.service('SessionService', function() {
    var userIsAuthenticated = false;
    var setId = false;

    this.setUserAuthenticated = function(user) {
      userIsAuthenticated = user;
    };

    this.setUserId = function(id) {
      setId = id;
    };

    this.getUserId = function() {
      return setId;
    };

    this.getUserAuthenticated = function() {
      return userIsAuthenticated;
    };

    this.clearSession = function() {
      userIsAuthenticated = false;
      setId = false;
    }

  });

