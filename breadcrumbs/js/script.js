angular.module('BreadcrumbsApp', ['ui.router', 'ui.bootstrap'])
    .factory('getUserData', function ($http) {
        return function (baseUrl) {
            var accessToken = window.localStorage.getItem('accessToken')
                endUrl = '&callback=JSON_CALLBACK';            
            return new Promise(function (resolve, reject) {
                $http.jsonp(baseUrl + accessToken + endUrl)
                    .then(function (response) {
                        resolve(response.data.data);
                    }, function (error) {
                        reject(error);
                    });
            }); 
       }        
    })
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'views/login.html',
                controller: 'LoginController'
            })
            .state('main', {
                url: '/main',
                templateUrl: 'views/main.html',
                controller: 'MainController'
            })
            .state('main.photos', {
                url: '/photos',
                templateUrl: 'views/photos.html',
                controller: 'MainController'
            })
            .state('main.ena', {
                url: '/ena',
                templateUrl: 'views/ena.html',
                controller: 'EController'
            })
            .state('main.vince', {
                url: '/vince',
                templateUrl: 'views/vince.html',
                controller: 'VController'
            })
            .state('main.johnathan', {
                url: '/johnathan',
                templateUrl: 'views/johnathan.html',
                controller: 'JController'
            });

        //TODO create controllers
        $urlRouterProvider.otherwise('/login');
    })
    .controller('LoginController', function($scope) {
        $scope.login = function() {
        /*
            This part requires some customization (just for this stage of development)
            the clientID and redirectURL are mine (ena's), yours will probs be different

            1. go to https://www.instagram.com/developer/
            2. sign in
            3. click "Manage Clients" in the navbar on the upper right
            4. register a client 
            5. fill out things in 'Details' tab
            6. go to the 'Security' tab, uncheck 'Disable implicit OAuth' **important**
            7. register
            8. update the variables below, 
                maybe we should just comment out each others while we are developing?
         */

            //TODO create paintberi instagram account to make universal clientID

            //ena's client stuff
            //var clientID = 'e2fad0935d07402c9c5a68287915d997';
            //var redirectUrl = 'http://localhost:8000/insta-oauth.html';

            //vince's client stuff
             var clientID = 'ab1c06711b0046b995f3b42fd2ee5b33';
             var redirectUrl = 'http://localhost:8000/paintberi/breadcrumbs/insta-oauth.html';

            var url = 'https://instagram.com/oauth/authorize/?client_id=' + 
                        clientID + '&scope=basic+public_content&redirect_uri=' +
                        redirectUrl + '&response_type=token';

            window.location.href = url;
        }
    })
    .controller('MainController', function($scope, $state, $http, getUserData) {
        // retrieve access token from local storage
        var accessToken = window.localStorage.getItem('accessToken');

        if (!accessToken) {
            $state.go('login');
        } else {
            //ena = 6865520

            // base URL for self
            var selfBaseURL = 'https://api.instagram.com/v1/users/402726334/?access_token=';

            // base URL for self recent
            var selfMediaBaseURL = 'https://api.instagram.com/v1/users/self/media/recent/?access_token=';

            // get current user data from Instagram
            getUserData(selfBaseURL)
                .then(function (response) {
                    $scope.currentUser = {
                        name: response.username,
                        id: response.id,
                        profPic: response.profile_picture
                    }
                }, function (error) {
                    console.log(error);
                });
            
            // get most recent posts
            getUserData(selfMediaBaseURL)
                .then(function (response) {
                    var selfData = {
                        recentPhotos: _.pluck(response, 'images.standard_resolution.url'),
                        recentLikes: _.pluck(response, 'likes.count')
                    };

                    $scope.selfRecent = _.zip(selfData.recentPhotos, selfData.recentLikes);
                }, function (error) {
                    console.log(error);
                })
        }

        // navbar collapse code
        $scope.isCollapsed = true;

        // user logout
        $scope.logout = function() {
            window.localStorage.setItem('accessToken', '');

            $state.go('login');
        };

    })
    .controller('EController', function ($scope, getUserData) {
        
    })
    .controller('VController', function ($scope) {

    })
    .controller('JController', function ($scope) {

    });