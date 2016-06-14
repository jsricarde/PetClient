// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('petClient', ['ionic', 'LocalStorageModule', 'btford.socket-io', 'angularMoment', 'ionic-datepicker', 'ionic-timepicker', 'ngCordova', 'petClient.controllers', 'petClient.services', 'ionic-color-picker'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
      url: '/app',
      templateUrl: 'templates/sidebar.html',
      controller: 'AppCtrl'
    })

    .state('login', {
      url: "/login",
      templateUrl: "templates/login.html",
      controller: 'LoginController'
    })

    .state('app.account', {
      url: '/account',
      views: {
        'mainContent': {
          templateUrl: 'templates/account.html',
          controller: 'AccountController'
        }
      }
    })

    .state('register', {
      url: "/register",
      templateUrl: 'templates/register.html',
      controller: 'RegisterController'
    })

    .state('app.post_event', {
        url: '/post_event',
        views: {
          'mainContent': {
            templateUrl: 'templates/post_event.html',
            controller: 'EventController'
          }
        }
      })
      
      .state('app.pets', {
        cache: false,
        url: '/pets',
        views: {
          'mainContent': {
            templateUrl: 'templates/pets.html',
            controller: 'PetsController',
            resolve: {
              pets: ['petFactory', 'user', function(petFactory, user) {
                return petFactory.getPetsByNotUser(user);
              }]
            }
          }
        }
      })

    .state('app.mypets', {
      cache: false,
      url: '/mypets',
      views: {
        'mainContent': {
          templateUrl: 'templates/mypets.html',
          controller: 'MyPetsController',
          resolve: {
            pets: ['petFactory', 'user', function(petFactory, user) {
              return petFactory.getPetsByUser(user);
            }]
          }
        }
      }
    })

    .state('app.pet_detail', {
      url: '/pets/:id',
      views: {
        'mainContent': {
          templateUrl: 'templates/pet_detail.html',
          controller: 'PetDetailController',
          resolve: {
            pet: ['$stateParams', 'petFactory', function($stateParams, petFactory) {
              return petFactory.getPetById($stateParams.id);
            }],
            msgs: ['$stateParams', 'petFactory', function($stateParams, petFactory) {
              return petFactory.getMsgsById($stateParams.id);
            }]
          }
        }
      }
    })

    .state('app.pet_edit', {
      url: '/pets/edit/:id',
      views: {
        'mainContent': {
          templateUrl: 'templates/post_pet.html',
          controller: 'PetEditController',
          resolve: {
            pet: ['$stateParams', 'petFactory', function($stateParams, petFactory) {
              return petFactory.getPetById($stateParams.id);
            }]
          }
        }
      }
    })

    .state('app.room', {
        cache: false,
        url: '/room',
        views: {
          'mainContent': {
            templateUrl: 'templates/room.html',
            controller: 'RoomController',
            resolve: {
              msgs: ['localStorageService', 'petFactory', function(localStorageService, petFactory) {
                return petFactory.getMsgsById(localStorageService.get('room'));
              }]
            }
          }
        }
      })

      .state('app.post_pet', {
        url: '/post_pet',
        views: {
          'mainContent': {
            templateUrl: 'templates/post_pet.html',
            controller: 'PetController'
          }
        }
      })

      .state('app.home', {
        url: '/home',
        views: {
          'mainContent': {
            templateUrl: 'templates/home.html'
          }
        }
      })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
  })

  .directive('formValidateAfter', formValidateAfter);

function formValidateAfter() {
  var directive = {
    restrict: 'A',
    require: 'ngModel',
    link: link
  };

  return directive;

  function link(scope, element, attrs, ctrl) {
    var validateClass = 'form-validate';
    ctrl.validate = false;
    element.bind('focus', function(evt) {
      if (ctrl.validate && ctrl.$invalid) // if we focus and the field was invalid, keep the validation
      {
        element.addClass(validateClass);
        scope.$apply(function() {
          ctrl.validate = true;
        });
      } else {
        element.removeClass(validateClass);
        scope.$apply(function() {
          ctrl.validate = false;
        });
      }

    }).bind('blur', function(evt) {
      element.addClass(validateClass);
      scope.$apply(function() {
        ctrl.validate = true;
      });
    });
  }
}