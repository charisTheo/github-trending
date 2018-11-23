(function(){
    'use strict';

    angular
        .module('Repositories')
        .controller('RepositoriesCtrl', function($scope, $http) {
            $scope.repositories;
            
            // $http({
            //     method: 'GET',
            //     url: 'https://github.com/login/oauth/authorize?client_id=Iv1.f97764743ca89b4c'
            // }).then(function(response) {
            //     console.log(response);
            // });

            // get public repositories
            $http({
                method: 'GET',
                url: 'https://api.github.com/repositories?client_id=Iv1.f97764743ca89b4c' 
            }).then(function(response) {
                let repositories = response.data;

                for (let repository of repositories) {
                    // get events of each repository
                    $http({
                        method: 'GET',
                        url: repository.events_url + '?client_id=Iv1.f97764743ca89b4c'
                    }).then(function(events) {
                        // filter events by type and by time of creation 
                        let watchEvents = events.filter(function(event) {
                            // get events fired only after the beginning of today   
                            return event.type === 'WatchEvent' && new Date(event.created_at).getTime() >= new Date().setHours(0,0,0,0);
                        });
                        repository.numberOfStarsToday = watchEvents.length;
                    });
                }
                // add repositories to scope 
                $scope.repositories = repositories;
            });
        });
}());