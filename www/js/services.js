'use strict';
angular.module('petClient.services', ['ngResource'])
  //.constant("baseURL", "http://localhost:3000/")
  .constant("baseURL", "http://petserver.mybluemix.net/")
  .service('petFactory', ['$resource', 'baseURL', '$http', function ($resource, baseURL, $http) {
    this.instertPet = function (data) {
      console.log(data);
      return $http.post(baseURL + 'pets/insert', data);
    };

    this.updatePet = function (data) {
      console.log(data);
      return $http.put(baseURL + 'pets/' + data.id, data);
    };

    this.getPets = function () {
      return $http.get(baseURL + "pets/").then(function successCallback(response) {
        return (response.data);
      });
    };

    this.getPetById = function (id) {
      return $http.get(baseURL + "pets/" + id).then(function successCallback(response) {
        return (response.data);
      });
    }

    this.getPetsByUser = function (user) {
      console.log(user.id);
      console.log("by id");
      return $http.get(baseURL + "pets/userId/" + user.id).then(function successCallback(response) {
        return (response.data);
      });
    }

    this.getPetsByNotUser = function (user) {
      console.log(user.id);
      console.log("by not id");
      return $http.get(baseURL + "pets/userNotId/" + user.id).then(function successCallback(response) {
        return (response.data);
      });
    }

    this.getMsgsById = function (id) {
      console.log(id);
      console.log("by not id");
      return $http.get(baseURL + "pets/msgs/" + id).then(function successCallback(response) {
        return (response.data);
      });
    }
  }])
  .service('serviceFactory', ['socketFactory', function (socketFactory) {
    this.SocketService = function () {
      //var myIoSocket = io.connect('http://localhost:3000');
      var myIoSocket = io.connect('http://petserver.mybluemix.net/');
      var socket = socketFactory({
        ioSocket: myIoSocket
      });
      return socket;
    }
  }])

  .service('eventFactory', ['$resource', 'baseURL', '$http', function ($resource, baseURL, $http) {
    this.instertEvent = function (data) {
      console.log(data);
      return $http.post(baseURL + 'events/insert', data);
      //return $resource(baseURL + "dishes/:id", null, { 'update': { method: 'PUT' } });
    };
    this.getEvents = function () {
      $http.get(baseURL + "events/").then(function (response) {
        return response;
      });
    }
  }])
  .service('userFactory', ['$resource', 'baseURL', '$http', function ($resource, baseURL, $http) {
    
     this.updateUser = function (data) {
      console.log(data);
      return $http.put(baseURL + 'users/' + data.id, data);
    };

    this.instertUser = function (data) {
      console.log(data);
      return $http.post(baseURL + 'users/register', data);
    };
    this.getUsers = function () {
      $http.get(baseURL + "users/").then(function (response) {
        return response;
      });
    }
    this.login = function (data) {
      console.log(data);
      return $http.post(baseURL + 'users/login', data);
    }
    this.getUserById = function (id) {
      return $http.get(baseURL + "users/" + id).then(function successCallback(response) {
        return (response.data);
      });
    }
  }])
  .factory('socket', function (socketFactory) {
    //Create socket and connect to http://chat.socket.io 
    var myIoSocket = io.connect('http://petserver.mybluemix.net/');

    var mySocket = socketFactory({
      ioSocket: myIoSocket
    });

    return mySocket;
  })