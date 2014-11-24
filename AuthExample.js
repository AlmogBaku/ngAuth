angular.module('myApp', ['ngAuthBase'])
    .factory('Auth', ['$facebook', 'AuthBaseUI', '$rootScope',
        function($facebook, AuthBase, $rootScope) {
            var Auth = angular.extend(AuthBase,  {});

            /** Status change event **/
            $rootScope.$on("Auth.status", function(event, status) {
                if(status) {
                    console.log("Logged In!");
                } else {
                    console.log("Logged out!")
                }
            });

            Auth.setIsLoggedIn(function() {
                var status = $facebook.isConnected();
                if(status==null) $facebook.getLoginStatus();
                return status;
            });


            $rootScope.$on("API.authChanged", function() {
                Auth.statusChanged($facebook.isConnected());
            });

            return Auth;
        }])
    .run(['Auth', function(Auth) {}])
;