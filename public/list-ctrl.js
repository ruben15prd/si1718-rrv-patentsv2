angular.module("PatentManagerApp")
   .controller("ListCtrl", ["$scope", "$http", function($scope, $http) {
    

        function refresh(){
            $http
                .get("/api/v1/patents")
                .then(function(response) {
                    $scope.patents = response.data;
                });
            
            $scope.newPatent={
            }
        }
    
        $scope.addPatent = function (){
            
            $http
                .post("/api/v1/patents/",$scope.newPatent)
                .then(function(response) {
                    refresh();
                }, function(error){
                    alert(error.data);
                });
            
        }

        $scope.deletePatent = function (idPatent){
            
            $http
                .delete("/api/v1/patents/"+idPatent)
                .then(function(response) {
                    refresh();
                });
            
        }

        refresh();

}]);