/**
 * GoDisco - Social Nightlife LTD property
 * Authored by  Tal Gleichger & Almog Baku
 *              tal@gleichger.com
 *              http://www.gleichger.com/
 *              almog.baku@gmail.com
 *              http://www.almogbaku.com/
 *
 * 3/12/2014 16:25
 */
angular.module('ngAuthBase',[])
    .provider('AuthBaseUI', function() {
        var config = {
            loginPath:      '/login',
            securedPath:    '/secured'
        };
        this.getLoginPath = function() {
            return config.loginPath;
        };
        this.getSecuredPath = function() {
            return config.securedPath;
        };
        this.setLoginPath = function(newPath) {
            config.loginPath = newPath;
            return this;
        };
        this.setSecuredPath = function(newPath) {
            config.securedPath = newPath;
            return this;
        };
        this.setIsLoggedIn = function(fn) {
            this.isLoggedIn = fn;
            return this;
        };
        this.setReady = function(promise) {
            this.ready = promise;
            return this;
        };

        this.$get = ["$rootScope", "$state", "$urlRouter", '$location',
            function($rootScope, $state, $urlRouter, $location) {
                var AuthBase=this; //Allow access to configuration

                /**
                 * Prevent any load before authentication is ready
                 */
                $rootScope.$on('$locationChangeStart', function (event) {
                    if(AuthBase.isLoggedIn() == null) {
                        event.preventDefault();
                        return;
                    }
                });


                /**
                 * Check the login
                 * Check the user access for permission to the page, if denied redirect
                 * @param event
                 * @param next
                 */
                AuthBase.loginCheck = function(event, next) {
                    var isLoggedIn = AuthBase.isLoggedIn();

                    if(next.authenticated && !isLoggedIn) {
                        $location.path(AuthBase.getLoginPath());
                    } else if(next.anonymous && isLoggedIn) {
                        $location.path(AuthBase.getSecuredPath());
                    }
                };

                /**
                 * On authentication status change reload the current page
                 */
                $rootScope.$on("Auth.status", function() {
                    AuthBase.ready.promise.then(function() {
                        if(!angular.isDefined($state.current.name) || $state.current.name.length == 0)
                            $urlRouter.sync();
                        else
                            $state.go($state.current.name, null, { reload: true });
                    });
                });

                /**
                 * On route reload mostly
                 */
                $rootScope.$on('$stateChangeSuccess', function (event, next) {
                    AuthBase.loginCheck(event, next);
                });

                return AuthBase;
            }];
    });
