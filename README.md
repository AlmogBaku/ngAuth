Angular Authorization layer
=============================
This module allows you to add authorization layer to your angular project, and to filter pages for "anonymous" and "authenticated" users.


## Installation ##

** You can assist the example on `AuthExample.js` of using `ngAuth` with `ng-facebook` module **

1. Download using one of the following options:
   1. npm: `npm install ngauth`
   1. bower: `bower install ngAuth`
   1. git
1. Add the module to your dependencies and include its scripts
1. Create your own authentication service by implementing the `AuthBase` abstract:
    ```javascript
    angular.module('myApp', ['ngAuthBase'])
        .factory('Auth', ['$facebook', 'AuthBaseUI', '$rootScope',
            function($facebook, AuthBase, $rootScope) {
                var Auth = angular.extend(AuthBase,  {});
    
                return Auth;
            }])
        .run(['Auth', function(Auth) {}])
    ;
    ```
    *** use `AuthBase` dependency for regular `ng-route`, and `AuthBaseUI` for `router-ui` ***
2. Implement the following methods:
    2.1. `setIsLoggedIn()` should check if the user is logged-in:
        `true` - logged-in user
        `false` - anonymous user
        `null` - information not available yet(waiting to response)

## Usage ##

### Defining routes ###
1. add `anonymous: true` to every route which allowed only for anonymous users
1. add `authenticated: true` to every route which allowed only for anonymous users

Example:
```js
$stateProvider
    .state('login', {
        url: '/login',
        controller: 'loginCtrl',
        anonymous: true,
        templateUrl: 'src/app/views/login.html'
    })
;
```

### Authentication status change handler ###

You can attach handler for every time the authentication status is changed and ready, by listening to `Auth.status`:

Example:
```js
$rootScope.$on("Auth.status", function(event, status) {
    if(status) {
        console.log("Logged In!");
    } else {
        console.log("Logged out!")
    }
});
```

### Add login/logout methods to your auth service ###
It's recommended to add your login/logout method on your auth service.
