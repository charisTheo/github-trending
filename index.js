(function(){
    'use strict';

    angular
        .module('Repositories')
        .controller('RepositoriesCtrl', function($scope, $http) {
            $scope.repositories;

            $http({
                method: 'GET',
                url: 'https://api.github.com/repositories' 
            }).then(function(response) {
                let repositories = response.data;
                $scope.repositories = repositories;

                for (let repository of repositories) {
                    $http({
                        method: 'GET',
                        url: repository.events_url
                    }).then(function(events) {
                        // filter events by type and by time of creation 
                        let watchEvents = events.filter(function(event) {
                            // get events fired only after the beginning of today   
                            return event.type === 'WatchEvent' && new Date(event.created_at).getTime() >= new Date().setHours(0,0,0,0);
                        });
                        repository.numberOfStarsToday = watchEvents.length;
                    });
                }
            });

        });

}());