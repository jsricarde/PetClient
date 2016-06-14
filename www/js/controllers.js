angular.module('petClient.controllers', [])

.value('user', {
  id: '',
  username: '',
  firstName: '',
  lastName: '',
  email: ''
})

/*
 * This is the loginController function for manage the enter to the app
 */
.controller('LoginController', ['user', '$state', '$scope', '$ionicModal', '$timeout', '$location', '$ionicPopup', 'userFactory', function(user, $state, $scope, $ionicModal, $timeout, $location, $ionicPopup, userFactory) {

  // Form data for the login modal
  $scope.loginData = {
    username: "",
    password: ""
  };
  // Open the register view
  $scope.goRegister = function(path) {
    $location.path(path);
  };
  //set the controller for alert response
  $scope.showAlert = function(error) {
    var title;
    var content;
    if (error) {
      title = 'Error in the app';
      content = error.err.message;
    } else {
      title = 'Login successfull',
        content = 'The user to add the successfull'
    }
    $ionicPopup.alert({
      title: title,
      content: content
    }).then(function(res) {});
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log($scope.loginData);
    userFactory.login($scope.loginData).success(function(data) {
      console.log(data.user);
      user.username = data.user.username;
      user.email = data.user.email;
      user.firstName = data.user.first_name;
      user.lastName = data.user.last_name;
      user.id = data.user._id;
      $scope.showAlert();
      $scope.loginData = {};
      $state.go('app.pets');
    }).error(function(error) {
      console.log(error);
      $scope.showAlert(error);
    });
  };
}])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $location) {

})

/*
 * This is the AccountController function for manage pet detail template view
 */
.controller('AccountController', ['user', '$state', '$scope', 'petFactory', '$stateParams', '$ionicPopup', 'socket', 'localStorageService', function(user, $state, $scope, petFactory, $stateParams, $ionicPopup, socket, localStorageService) {
  console.log(user);
  //set the popup controller 
}])
/*
 * This is the RoomController function for manage room template view
 */
.controller('RoomController', ['msgs', 'socket', 'serviceFactory', 'petFactory', 'user', '$scope', '$state', 'localStorageService', 'moment', '$ionicScrollDelegate', function(msgs, socket, serviceFactory, petFactory, user, $scope, $state, localStorageService, moment, $ionicScrollDelegate) {
  var self = this;
  $scope.current_room = localStorageService.get('room');
  $scope.message;
  // var msgs = petFactory.getMsgsById($scope.current_room);
  console.log("this is a msgs");
  console.log(msgs);
  $scope.messages = msgs;
  $scope.time = function(timestamp) {
    return moment(timestamp).fromNow();
  };

  var current_user = user.username;

  $scope.isNotCurrentUser = function(user_scope) {
    if (current_user != user_scope) {
      return 'not-current-user';
    }
    return 'current-user';
  };

  //get all online messages
  socket.on('message created', function(data) {
    //Push to new message to our $scope.messages
    $scope.messages.push(data);
    $ionicScrollDelegate.scrollBottom();
    //Empty the textarea
    $scope.message = "";
  });
  //function for send message
  $scope.sendTextMessage = function() {
    var msg = {
      'room': $scope.current_room,
      'user': current_user,
      'text': $scope.message,
      'time': moment()
    };
    $scope.messages.push(msg);
    $ionicScrollDelegate.scrollBottom();
    $scope.message = '';
    console.log(msg)
    socket.emit('send:message', msg);
  };

}])

/*
 * This is the PetDetailController function for manage pet detail template view
 */
.controller('PetDetailController', ['msgs', 'user', '$state', '$scope', 'petFactory', '$stateParams', '$ionicPopup', 'socket', 'localStorageService', 'pet', function(msgs, user, $state, $scope, petFactory, $stateParams, $ionicPopup, socket, localStorageService, pet) {
  console.log(msgs);
  //set the popup controller
  $scope.showAlert = function(status) {
    $ionicPopup.alert({
      title: 'Update successfull',
      content: 'The pet to update the ' + status + ' pet list'
    }).then(function(res) {});
  };
  $scope.petData = {};
  if (user.id === pet.id_user_rescue) {
    $scope.user = user;
    $scope.petData.id = pet._id;
    $scope.petData.status = pet.status;
    console.log(pet);
    //function to update data 
    $scope.doUpdateStatus = function() {
      petFactory.updatePet($scope.petData).success(function(data) {
        console.log(data);
        $scope.showAlert($scope.petData.status);
      }).error(function(error) {
        console.log("error");
        console.log(error);
      });
    }
  }
  $scope.pet = pet;
  console.log(pet);
  var room_name = pet._id;
  $scope.doEnterRoom = function() {
    localStorageService.set('room', room_name);
    //room_name = "coding";
    var room = {
      'room_name': room_name
    };
    socket.emit('join:room', room);
    console.log(room);

    $state.go('app.room');
  };
}])

/*
 * This is the PetsController function for manage pets template view
 */
.controller('PetsController', ['user', '$state', '$scope', 'petFactory', 'pets', function(user, $state, $scope, petFactory, pets) {
  $scope.pets = pets;
  console.log(user);
  $scope.doGoPostPet = function() {
    $state.go('app.post_pet');
  }
}])

/*
 * This is the PetsController function for manage pets template view
 */
.controller('MyPetsController', ['user', '$state', '$scope', 'petFactory', 'pets', function(user, $state, $scope, petFactory, pets) {
    $scope.pets = pets;
    $scope.doGoPostPet = function() {
      $state.go('app.post_pet');
    }
    console.log(user);
  }])
  /*
   * This is the RegisterController function for manage register template view
   */
  .controller('RegisterController', ['$scope', 'userFactory', '$cordovaGeolocation', '$http', '$ionicPopup', 'ionicDatePicker', function($scope, userFactory, $cordovaGeolocation, $http, $ionicPopup, ionicDatePicker) {
    //set data model
    $scope.registerData = {
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      latitude: "",
      longitude: "",
      age: "",
      gender: "",
      type: "",
      status: "",
      country: "",
      city: "",
      password: "",
      description: ""
    };
    //set the popup controller
    $scope.showAlert = function(error) {
      var title;
      var content;
      if (error) {
        title = 'Error in the app';
        content = error.err.message;
      } else {
        title = 'Add successfull',
          content = 'The user to add the successfull'
      }
      $ionicPopup.alert({
        title: title,
        content: content
      }).then(function(res) {});
    };
    //set the current position controller
    $scope.openCurrentPos = function() {
        var posOptions = {
          timeout: 10000,
          enableHighAccuracy: false
        };
        $cordovaGeolocation
          .getCurrentPosition(posOptions)
          .then(function(position) {
            $scope.registerData.latitude = position.coords.latitude
            $scope.registerData.longitude = position.coords.longitude
            var urlMaps = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + $scope.registerData.latitude + "," + $scope.registerData.longitude + "&key=AIzaSyDQ4CY9gVjkVccIIXQIx4Ew00WCIq7juU4&result_type=locality";
            $http.get(urlMaps).then(function(response) {
              var arrRes = response.data.results[0].address_components
              $scope.registerData.label_position = "setted";
              arrRes.map(function(obj) {
                var type = obj.types[0];
                if (type === "locality") {
                  $scope.registerData.city = obj.long_name;
                }
                if (type === "country") {
                  $scope.registerData.country = obj.long_name;
                }
              });
            });
          }, function(err) {
            // error
          });
      }
      //set date picker controller

    var objDatePicker = {
      callback: function(val) { //Mandatory
        $scope.registerData.age_label = new Date(val).toDateString();
        console.log('Return value from the datepicker popup is : ' + val, new Date(val));
        $scope.registerData.age = val;
      },
      from: new Date(2012, 1, 1), //Optional
      to: new Date(2016, 10, 30), //Optional
      inputDate: new Date(), //Optional
      mondayFirst: true, //Optional
      dateFormat: 'dd MMMM yyyy',
      disableWeekdays: [0], //Optional
      closeOnSelect: false, //Optional
      templateType: 'popup' //Optional
    };
    //set the function for open or shows the datepicker
    $scope.openDatePicker = function() {
      ionicDatePicker.openDatePicker(objDatePicker);
    };
    //function to insert data 
    $scope.doInsertUser = function() {
      userFactory.instertUser($scope.registerData).success(function(data) {
        console.log(data);
        $scope.showAlert();
        $scope.registerData = {};
        //$state.go('tab.dash');
      }).error(function(error) {
        console.log(error);
        $scope.showAlert(error);
      });
    }

  }])

/*
 * This is the PetEditController function for manage post_pet edit template view
 */
.controller('PetEditController', ['user', '$state', '$scope', 'petFactory', 'pet', '$cordovaGeolocation', '$http', '$ionicPopup', function(user, $state, $scope, petFactory, pet, $cordovaGeolocation, $http, $ionicPopup) {
  $scope.button = "Update";
  $scope.title = "Update a pet";
  //set the color controller
  $scope.customColors = {
    "white": "#ffffff",
    "gold": "#d8a54a",
    "brown": "#994d00",
    "black": "#000000",
    "orange": "#ff8c1a",
    "gray": "#7a7a52"
  }

  $scope.petData = {
    id: pet._id,
    name: pet.name,
    country: pet.country,
    city: pet.city,
    latitude: pet.latitude,
    longitude: pet.longitude,
    color: pet.color,
    size: pet.size,
    age: pet.age,
    status: pet.status,
    description: pet.description,
    id_user_rescue: user.id
  };
  console.log(pet);

  //set the popup controller
  $scope.showAlert = function(status) {
    $ionicPopup.alert({
      title: 'Update successfull',
      content: 'The pet to update the ' + status + ' pet list'
    }).then(function(res) {});
  };
  //set the current position controller
  $scope.openCurrentPos = function() {
    var posOptions = {
      timeout: 10000,
      enableHighAccuracy: false
    };
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function(position) {
        $scope.petData.latitude = position.coords.latitude
        $scope.petData.longitude = position.coords.longitude
        var urlMaps = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + $scope.petData.latitude + "," + $scope.petData.longitude + "&key=AIzaSyDQ4CY9gVjkVccIIXQIx4Ew00WCIq7juU4&result_type=locality";
        $http.get(urlMaps).then(function(response) {
          var arrRes = response.data.results[0].address_components
          $scope.petData.label_position = "setted";
          arrRes.map(function(obj) {
            var type = obj.types[0];
            if (type === "locality") {
              $scope.petData.city = obj.long_name;
            }
            if (type === "country") {
              $scope.petData.country = obj.long_name;
            }
          });
        });
      }, function(err) {
        // error
      });
  }

  //function to update data 
  $scope.doSubmitPet = function() {
    petFactory.updatePet($scope.petData).success(function(data) {
      console.log(data);
      $scope.showAlert($scope.petData.status);
      $scope.petData = {};
      $state.go('app.mypets');
    }).error(function(error) {
      console.log("error");
      console.log(error);
    });
  }
}])

/*
 * This is the PetController function for manage post_pet template view
 */
.controller('PetController', ['user', '$scope', 'petFactory', '$cordovaGeolocation', '$http', '$ionicPopup', function(user, $scope, petFactory, $cordovaGeolocation, $http, $ionicPopup) {
  $scope.button = "Post";
  $scope.title = "Post a pet";
  //set the color controller
  $scope.customColors = {
      "white": "#ffffff",
      "gold": "#d8a54a",
      "brown": "#994d00",
      "black": "#000000",
      "orange": "#ff8c1a",
      "gray": "#7a7a52"
    }
    //set data model
  $scope.petData = {
    name: "",
    country: "",
    city: "",
    latitude: "",
    longitude: "",
    color: "",
    size: "",
    age: "",
    status: "",
    description: "",
    id_user_rescue: user.id
  };
  //set the popup controller
  $scope.showAlert = function(status) {
    $ionicPopup.alert({
      title: 'Add successfull',
      content: 'The pet to add the ' + status + ' pet list'
    }).then(function(res) {});
  };
  //set the current position controller
  $scope.openCurrentPos = function() {
      var posOptions = {
        timeout: 10000,
        enableHighAccuracy: false
      };
      $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function(position) {
          $scope.petData.latitude = position.coords.latitude
          $scope.petData.longitude = position.coords.longitude
          var urlMaps = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + $scope.petData.latitude + "," + $scope.petData.longitude + "&key=AIzaSyDQ4CY9gVjkVccIIXQIx4Ew00WCIq7juU4&result_type=locality";
          $http.get(urlMaps).then(function(response) {
            var arrRes = response.data.results[0].address_components
            $scope.petData.label_position = "setted";
            arrRes.map(function(obj) {
              var type = obj.types[0];
              if (type === "locality") {
                $scope.petData.city = obj.long_name;
              }
              if (type === "country") {
                $scope.petData.country = obj.long_name;
              }
            });
          });
        }, function(err) {
          // error
        });
    }
    //function to validate fields

  //function to insert data 
  $scope.doSubmitPet = function() {
    petFactory.instertPet($scope.petData).success(function(data) {
      console.log(data);
      $scope.showAlert($scope.petData.status);
      $scope.petData = {};
      //$state.go('tab.dash');
    }).error(function(error) {
      console.log("error");
      console.log(error);
    });
  }
}])

/*
 * This is the EventController function for manage post_event template view
 */
.controller('EventController', ['$scope', 'eventFactory', 'ionicDatePicker', 'ionicTimePicker', '$cordovaGeolocation', '$http', '$ionicPopup', function($scope, eventFactory, ionicDatePicker, ionicTimePicker, $cordovaGeolocation, $http, $ionicPopup) {
  //set data model
  $scope.eventData = {
    name: "",
    country: "",
    city: "",
    latitude: "",
    longitude: "",
    time_start_event: "",
    date_start_event: "",
    description: "",
    status: "",
  };
  //set date picker controller
  var objDatePicker = {
    callback: function(val) { //Mandatory
      $scope.eventData.date_start_event_label = new Date(val).toDateString();
      console.log('Return value from the datepicker popup is : ' + val, new Date(val));
      $scope.eventData.date_start_event = val;
    },
    from: new Date(2012, 1, 1), //Optional
    to: new Date(2016, 10, 30), //Optional
    inputDate: new Date(), //Optional
    mondayFirst: true, //Optional
    dateFormat: 'dd MMMM yyyy',
    disableWeekdays: [0], //Optional
    closeOnSelect: false, //Optional
    templateType: 'popup' //Optional
  };
  //set the function for open or shows the datepicker
  $scope.openDatePicker = function() {
    ionicDatePicker.openDatePicker(objDatePicker);
  };
  //set time picker controller
  var objTimePicker = {
    callback: function(val) { //Mandatory
      if (typeof(val) === 'undefined') {
        console.log('Time not selected');
      } else {
        var selectedTime = new Date(val * 1000);
        $scope.eventData.time_start_event = selectedTime;
        $scope.eventData.time_start_event_label = selectedTime.getUTCHours() + ":" + selectedTime.getUTCMinutes();
        console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), 'H :', selectedTime.getUTCMinutes(), 'M');
      }
    },
    format: 12, //Optional
    step: 15, //Optional
    setLabel: 'Set' //Optional
  };
  //set the function for open or shows the timepicker
  $scope.openTimePicker = function() {
      ionicTimePicker.openTimePicker(objTimePicker);
    }
    //set the popup controller
  $scope.showAlert = function() {
    $ionicPopup.alert({
      title: 'Add successfull',
      content: 'The event added successfull'
    }).then(function(res) {});
  };
  //set the current position controller and set current country and state
  $scope.openCurrentPos = function() {
      var posOptions = {
        timeout: 10000,
        enableHighAccuracy: false
      };
      $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function(position) {
          $scope.eventData.latitude = position.coords.latitude
          $scope.eventData.longitude = position.coords.longitude
          var urlMaps = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + $scope.eventData.latitude + "," + $scope.eventData.longitude + "&key=AIzaSyDQ4CY9gVjkVccIIXQIx4Ew00WCIq7juU4&result_type=locality";
          $http.get(urlMaps).then(function(response) {
            var arrRes = response.data.results[0].address_components
            $scope.eventData.label_position = "setted";
            arrRes.map(function(obj) {
              var type = obj.types[0];
              if (type === "locality") {
                $scope.eventData.city = obj.long_name;
              }
              if (type === "country") {
                $scope.eventData.country = obj.long_name;
              }
            });
          });
        }, function(error) {
          // error
        });
    }
    //function to instert data
  $scope.doInsertEvent = function() {
    eventFactory.instertEvent($scope.eventData).success(function(data) {
      console.log(data);
      $scope.showAlert();
      $scope.eventData = {};
    }).error(function(error) {
      console.log("error");
      console.log(error);
    });
  }

}])

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [{
    title: 'Reggae',
    id: 1
  }, {
    title: 'Chill',
    id: 2
  }, {
    title: 'Dubstep',
    id: 3
  }, {
    title: 'Indie',
    id: 4
  }, {
    title: 'Rap',
    id: 5
  }, {
    title: 'Cowbell',
    id: 6
  }];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {});