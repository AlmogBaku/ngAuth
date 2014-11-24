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
    .provider('AuthBase', function() {
        var config = {
            loginPath:      '/login',
            securedPath:    '/'
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

        this.$get = ["$rootScope", "$route", "$location",
            function($rootScope, $route, $location) {
                var AuthBase=this; //Allow access to configuration
                /**
                 * On location change(mostly very first entering)
                 */
                $rootScope.$on('$locationChangeStart', function (event) {
                    //If login data not available, make sure we request for it
                    if(AuthBase.isLoggedIn()==null) {
                        event.preventDefault();
                        return;
                    }

                    var next=parseRoute().$$route;
                    AuthBase.loginCheck(event, next);
                });

                /**
                 * Check the login
                 * @param {route} next
                 * @TODO BUG: cant do event.preventDefault in phonegap!!!
                 */
                /**
                 * Check the login
                 * Check the user access for permission to the page, if denied redirect
                 * @param {event} event
                 * @param {event} next
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
                 * Broadcast status change
                 * @param {boolean|null} status
                 * @returns {AuthBase}
                 */
                AuthBase.statusChanged = function(status) {
                    $rootScope.$broadcast("Auth.status", status);
                    return this;
                };

                /**
                 * On authentication status change reload the current page
                 */
                $rootScope.$on("Auth.status", function() {
                    $route.reload();
                });

                /**
                 * On route reload mostly
                 */
                $rootScope.$on('$routeChangeStart', function (event, next) {
                    AuthBase.loginCheck(event, next);
                });

                /**
                 * Extracting the route: taken from `angular-route.js`
                 */
                function switchRouteMatcher(on, route) {
                    var keys = route.keys,
                        params = {};

                    if (!route.regexp) return null;

                    var m = route.regexp.exec(on);
                    if (!m) return null;

                    for (var i = 1, len = m.length; i < len; ++i) {
                        var key = keys[i - 1];

                        var val = 'string' == typeof m[i]
                            ? decodeURIComponent(m[i])
                            : m[i];

                        if (key && val) {
                            params[key.name] = val;
                        }
                    }
                    return params;
                }
                function inherit(parent, extra) {
                    return angular.extend(new (angular.extend(function() {}, {prototype:parent}))(), extra);
                }
                function parseRoute() {
                    // Match a route
                    var params, match;
                    angular.forEach($route.routes, function(route, path) {
                        if (!match && (params = switchRouteMatcher($location.path(), route))) {
                            match = inherit(route, {
                                params: angular.extend({}, $location.search(), params),
                                pathParams: params});
                            match.$$route = route;
                        }
                    });
                    // No route matched; fallback to "otherwise" route
                    return match || $route.routes[null] && inherit($route.routes[null], {params: {}, pathParams:{}});
                }

                return AuthBase;
            }];
    });
