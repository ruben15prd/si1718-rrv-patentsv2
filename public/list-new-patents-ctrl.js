angular.module("PatentManagerApp")
   .controller("ListNewPatentsCtrl", ["$scope", "$http","$routeParams", "$location", "$route", function($scope, $http, $routeParams, $location, $route) {
    

        function refresh(){
            $http
                .get("/api/v1/patentsAux")
                .then(function(response) {
                    $scope.patents = response.data;
                });
            
            
        }
        
        $scope.searchPatents = function(){
            $http({
                url: "/api/v1/patents",
                params: $scope.tosearch
            })
                .then(function(response) {
                    $scope.patents = response.data;
                    
                    if(String(response.status) == '200' && response.data.length == 0){
                    
                            $scope.error = "No patents found";
                        
}

                });
            
        }
    

         function deletePatentAux(idPatent){
            
            $http
                .delete("/api/v1/patentsAux/"+idPatent)
                .then(function(response) {
                });
            
        }
        
        $scope.addToValidPatents = function (idPatent){
            
            $http
                .get("/api/v1/patentsAux/"+idPatent)
                .then(function(response) {
                    $scope.patentToAdd = response.data;
               
            
                    insertPatent($scope.patentToAdd);
                    
                    deletePatentAux($scope.patentToAdd.idPatent);
                    
                    refresh();
                });
            
        }
        
        function insertPatent(patent){
          $http
                .post("/api/v1/addPatentsFromAux/",patent)
                .then(function(response) {
                }, function(error){
                    console.log(error.status);
                    
                     if(String(error.status) != '200'){
                    switch (String(error.status)) {
                        case '422':
                            $scope.error = "Please review the information entered in the fields";
                            break;
                        case '409':
                            $scope.error = "There is another patent with same name and date";
                            break;
                        default:
                            $scope.error = "Error, please contact administrator";
}
                        //alert($scope.error);
                    } 
                    
                    
                });
            
            
        }

        refresh();

}]);