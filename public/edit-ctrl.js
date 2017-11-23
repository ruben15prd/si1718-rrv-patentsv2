angular.module("PatentManagerApp")
    .controller("EditCtrl", ["$scope", "$http", "$routeParams", "$location",
        function($scope, $http, $routeParams, $location) {
            $scope.contactName = $routeParams.idPatent;
            console.log("EditCtrl initialized for contact "+$scope.contactName);
            $http
                .get("/api/v1/patents/"+$scope.contactName)
                .then(function(response) {
                    $scope.updatedContact = response.data;
                });
            
            $scope.updateContact = function (){
              
              delete $scope.updatedContact._id;
            
              $http
                .put("/api/v1/patents/"+$scope.contactName,$scope.updatedContact)
                .then(function(response) {
                    console.log("updated");
                    $location.path("/");
                });
            
            }
        
        }]);