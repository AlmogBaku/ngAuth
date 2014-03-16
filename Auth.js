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

            AuthBase.setLoginPath('/different');

            AuthBase.setSecuredPath('/homepage');
            AuthBase.setIsLoggedIn(function(){
                var status = $facebook.isConnected();
                if(status==null) $facebook.getLoginStatus();

                return status;
            });
        });

        return AuthBase;
    }])
;