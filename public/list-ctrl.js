angular.module("PatentManagerApp")
   .controller("ListCtrl", ["$scope", "$http", function($scope, $http) {
    

        function refresh(){
            $http
                .get("/api/v1/patents")
                .then(function(response) {
                    $scope.contacts = response.data;
                });
            
            $scope.newContact={
            }
        }
    
        $scope.addContact = function (){
            
            $http
                .post("/api/v1/patents/",$scope.newContact)
                .then(function(response) {
                    refresh();
                }, function(error){
                    alert(error.data);
                });
            
        }

        $scope.deleteContact = function (idPatent){
            
            $http
                .delete("/api/v1/patents/"+idPatent)
                .then(function(response) {
                    refresh();
                });
            
        }

        refresh();

}]);