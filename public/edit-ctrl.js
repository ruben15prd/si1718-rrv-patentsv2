angular.module("PatentManagerApp")
    .controller("EditCtrl", ["$scope", "$http", "$routeParams", "$location",
        function($scope, $http, $routeParams, $location) {
            $scope.patentId = $routeParams.idPatent;
            console.log("EditCtrl initialized for contact "+$scope.patentId);
            $http
                .get("/api/v1/patents/"+$scope.patentId)
                .then(function(response) {
                    $scope.updatedPatent = response.data;
                });
            
            $scope.updatePatent = function (){
              
              delete $scope.updatedPatent._id;
            
              $http
                .put("/api/v1/patents/"+$scope.patentId,$scope.updatedPatent)
                .then(function(response) {
                    console.log("updated");
                    $location.path("/");
                });
            
            }
        
        }]);