// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova', 'ui.mask'])

.run(function($ionicPlatform, SessionService) {
  $ionicPlatform.ready(function() {

    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)

      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    //SessionService.setUserAuthenticated('djklu31');
    //SessionService.setUserId('56d6b70c2e2ce1731491269d');

  });

    //SessionService.setUserAuthenticated('djklu31');
    //SessionService.setUserId('56d6b70c2e2ce1731491269d');


})

.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'templates/loginScreen.html',
        controller: 'LoginScreenCtrl',
        cache: false,
      })
      .state('createusermenu', {
        url: '/createusermenu',
        abstract: true,
        templateUrl: 'templates/createUserMenu.html',
        controller: 'CreateUserMenu',
        cache: false,
      })

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'MainController',
        cache: false,

      })
      .state('app.messagetabs', {
        url: '/messagetabs',
        abstract: true,
        views: {
          'menuContent':{
            templateUrl: 'templates/messageTabs.html'
          }
        }
      })
      .state('createusermenu.adduser', {
        url: '/adduser',
        views: {
          'menuContent':{
            templateUrl: 'templates/addUser.html',
            controller: 'AddUserController',
          }
        },
        cache: false,
      })
      .state('app.outgoingoffers', {
        url: '/outgoingoffers',
        views: {
          'menuContent':{
            templateUrl: 'templates/outgoingOffers.html',
            controller: 'OutgoingOffersCtrl',
          }
        },
        cache: false,
      })
      .state('app.additem', {
        url: '/additem',
        views: {
          'menuContent':{
            templateUrl: 'templates/addItem.html',
            controller: 'AddItemCtrl',
          }
        },
        cache: false,
      })
      .state('app.browseusers', {
        url: '/browseusers/:id?:itemname',
        views: {
          'menuContent':{
            templateUrl: 'templates/browseUsers.html',
            controller: 'BrowseUsersCtrl',
          }
        },
        cache: false,
      })
      .state('app.browseuseritems', {
        url: '/browseuseritems/:userid?:itemname?:requestid?:itemid?:interestid?:beenseen',
        views: {
          'menuContent':{
            templateUrl: 'templates/browseUserItems.html',
            controller: 'BrowseUserItemsCtrl',
          }
        },
        cache: false,
      })
      .state('app.seeoffer', {
        url: '/seeoffer/:requestid?:itemname?:itemid?:offereduserid?:offerid?:beenseen',
        views: {
          'menuContent':{
            templateUrl: 'templates/seeOffer.html',
            controller: 'SeeOfferCtrl',
          }
        },
        cache: false,
      })
      .state('app.seeofferlist', {
        url: '/seeofferlist',
        views: {
          'menuContent':{
            templateUrl: 'templates/seeOfferList.html',
            controller: 'SeeOfferListCtrl',
          }
        },
        cache: false,
      })
      .state('app.edititemlist', {
        url: '/edititemlist',
        views: {
          'menuContent':{
            templateUrl: 'templates/editItemList.html',
            controller: 'EditItemListCtrl',
          }
        },
        cache: false,
      })
      .state('app.edititem', {
        url: '/edititem/:id',
        views: {
          'menuContent':{
            templateUrl: 'templates/editItem.html',
            controller: 'EditItemCtrl',
          }
        },
        cache: false,
      })
      //.state('app.sendmessage', {
      //  url: '/sendmessage/:receiptid:itemid',
      //  views: {
      //    'menuContent':{
      //      templateUrl: 'templates/sendMessage.html',
      //      controller: 'SendMessageCtrl'
      //    }
      //  }
      //})
      .state('app.item', {
        url: '/item/:id?:itemname?:brand',
        views: {
          'menuContent':{
            templateUrl: 'templates/item.html',
            controller: 'ItemCtrl',
          }
        },
        cache: false,
      })
      .state('app.messages', {
        url: '/messages',
        views: {
          'menuContent':{
            templateUrl: 'templates/messages.html',
            controller: 'MessagesCtrl',
            //resolve: { authenticate: authenticate }
          }
        },
        cache: false,
      })
      .state('app.chatlog', {
        url: '/chatlog/:id?:otheruser',
        views: {
          'menuContent':{
            templateUrl: 'templates/chatlog.html',
            controller: 'ChatlogCtrl',
            //resolve: { authenticate: authenticate }
          }
        },
        cache: false,
      })
      .state('app.manageitems', {
        url: '/manageitems',
        views: {
          'menuContent':{
            templateUrl: 'templates/manageItems.html',
            controller: 'ManageItemsCtrl',
            //resolve: { authenticate: authenticate }
          }
        },
        cache: false,
      })
      .state('app.editprofile', {
        url: '/editprofile',
        views: {
          'menuContent':{
            templateUrl: 'templates/editProfile.html',
            controller: 'EditProfileCtrl',
            //resolve: { authenticate: authenticate }
          }
        },
        cache: false,
      })

      .state('app.getusers', {
        url: '/getusers',
        views: {
          'menuContent' :{
            templateUrl: 'templates/getUsers.html',
            controller: 'GetUsersController',
          }
        },
        cache: false,
      })

      .state('app.messages.transactions', {
        url: '/transactions',
        views: {
          'transactions' :{
            templateUrl: 'templates/transactions.html',
            controller: 'TransactionsCtrl',
          }
        },
        cache: false,
      })

      .state('app.mydaytrader', {
        url: '/mydaytrader',
        views: {
          'menuContent':{
            templateUrl: 'templates/myDaytrader.html',
            controller: 'MyDaytraderCtrl',
            //resolve: { authenticate: authenticate }
          }
        },
        cache: false
      })
      .state('logout', {
        url: '/logout',
        controller: 'LogoutCtrl',
        cache: false,
        //resolve: { authenticate: authenticate }
      })


    $urlRouterProvider.otherwise('/login');

    function authenticate($q, SessionService, $state, $timeout) {

      if (SessionService.getUserAuthenticated()) {
        return $q.when()
      } else {
        $timeout(function() {
          $state.go('login')
        });
        return $q.reject
      }
    }

  });
