'use strict';

var authService = angular.module('unleashApp.authService', ['firebase']);

  // let's create a re-usable factory that generates the $firebaseAuth instance
authService.factory('Auth', ['$window', 'FBURL', '$firebaseAuth', function($window, FBURL, $firebaseAuth) {
  var ref = new $window.Firebase(FBURL);
  return $firebaseAuth(ref);
}]);

authService.factory('userService', ['$window', 'FBURL', 'Auth', function($window, FBURL, Auth) {
  var ref = new $window.Firebase(FBURL);

  var checkIfUserExists = function(callback) {
    var queryRef = ref.child('users');

    queryRef.once('value', function(snapshot) {
      var storedUsers = snapshot.val() || {};
      var currentUser = Auth.$getAuth().uid;

      callback(currentUser in storedUsers);
    });
  };

  var isFromXteam = function(data) {
    // Check if authenticated user’s email address is from x-team.com domain
    if (data) {
      var domain = 'x-team.com';
      var email = data.google.email || '';

      return email.indexOf(domain) !== -1 ? 1 : 0;
    }
  };

  var parseEmail = function(email) {
    return email.match(/^([^@]*)@/)[1];
  };

  return {
    register: function(authData) {
      var isValidLogin = isFromXteam(authData);

      if (authData) {
        if (isValidLogin) {
          ref.child('users').child(authData.uid).set(authData);
        } else {
          console.log('Try x-team login. Not registered.');
          this.logout();
        }
      }
    },

    login: function() {
      var _this = this;

      // Login to google using a pop up
      ref.authWithOAuthPopup('google', function(err, authData) {
        if (err) {

          // If the pop up won’t fire, authenticate using a redirect
          if (err.code === 'TRANSPORT_UNAVAILABLE') {
            ref.authWithOAuthRedirect('google', function(err) {
              console.error('There was a problem logging in: ' + err);
            });

          } else {
            console.error('There was a problem logging in: ' + err);
          }
        }

        if(authData) {
          // User is logged in

          checkIfUserExists(function(doesExist) {
            if(!doesExist) {
              authData.username = parseEmail(authData.google.email);
              _this.register(authData);
            }
          });
        }
      }, {
        scope: 'email'
      });
    },

    logout: function() {
      ref.unauth();
    },

    getUsername: new Promise(function(resolve, reject) {
      if(Auth.$getAuth()) {
        var queryRef = ref.child('users');

        queryRef.once('value', function(snapshot) {
          var storedUsers = snapshot.val() || {};
          var currentUser = Auth.$getAuth().uid;

          if (Object.keys(storedUsers).length) {
            resolve(storedUsers[currentUser].username);
          } else {
            reject(Error('Object is empty'));
          }
        });
      }
    }),

    getUserUid: function(username) {
      return new Promise(function(resolve) {
        var queryRef = ref.child('users');

        queryRef.once('value', function (snapshot) {
          var storedUsers = snapshot.val() || {};

          console.log(storedUsers);

          for (var uid in storedUsers) {
            console.log(uid);
            if (storedUsers[uid].username === username) {
              resolve('UID:', uid);
            }
          }
        });
      });
    },

    listen: function() {
      ref.onAuth(function(authData) {
        if (authData) {
          // display logged in userbox
          console.log('change: logged in');
        } else {
          // display logged out userbox
          console.log('change: logged out');
        }
      });
    }
  };
}]);
