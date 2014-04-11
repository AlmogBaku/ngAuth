/**
 * GoDisco - Social NightLife LTD Property
 * Authored by Tal Gleichger
 *              tal@gleichger.com
 *              http://www.gleichger.com/
 *
 * 3/12/2014 16:25
 */
app
    .factory('Auth', ['$facebook', 'AuthBase', '$rootScope','$q', 'API', '$session',
        function($facebook, AuthBase, $rootScope, $q,API,$session) {

            var Auth = angular.extend(AuthBase,  {});

            Auth.setSecuredPath('/like');
            /**********************************************
             * Facebook implementation
             *********************************************/


            /**
             * Request read permissions
             */
            function requestReadPermissions() {
                return $facebook.login();
            }


            Auth.login = function() {
                var deferred = $q.defer();
                requestReadPermissions().then(function(responseRead) {
                    if(responseRead.failed) {
                        deferred.reject({failed: responseRead.failed});
                        return deferred.promise;
                    }
                    deferred.resolve({"read": responseRead});
                }).catch(function(error) {
                        deferred.reject({"read": error});
                    });
                return deferred.promise;
            };


            /**
             * Facebook logout
             */
            Auth.logout = function() {
                $facebook.logout();
            };

            /** Login**/
            $rootScope.$on("Auth.status", function(event, status) {
                if(status) {
                    //Server check
                    Auth.ready.resolve();
                } else {
                    Auth.ready.resolve();
                }
            });


            Auth.setIsLoggedIn(function(){
                var status = $facebook.isConnected();
                if(status==null) $facebook.getLoginStatus();

                return status;
            });

            /** Facebook change status */
            $rootScope.$on("fb.auth.authResponseChange", function() {
                Auth.setReady($q.defer());
                $rootScope.$broadcast("Auth.status", $facebook.isConnected());
            });

        return Auth;
    }])
    .run(['Auth', function(Auth) {}]);
