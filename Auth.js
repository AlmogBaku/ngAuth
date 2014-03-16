/**
 * GoDisco - Social NightLife LTD Property
 * Authored by Tal Gleichger
 *              tal@gleichger.com
 *              http://www.gleichger.com/
 *
 * 3/12/2014 16:25
 */
myApp
    .factory('Auth', ['$facebook', 'AuthBase', '$rootScope',
        function($facebook, AuthBase, $rootScope) {

        angular.extend(AuthBase, function() {

            // Chaning configuration's login path
            AuthBase.setLoginPath('/different-login-path');

            // Setting secure path (after logging in)
            AuthBase.setSecuredPath('/homepage');

            // Checking if the user is logged in
            AuthBase.setIsLoggedIn(function(){
                var status = $facebook.isConnected();
                if(status==null) $facebook.getLoginStatus();

                return status;
            });
        });

        return AuthBase;
    }]);