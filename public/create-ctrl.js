angular.module("PatentManagerApp")
    .controller("CreateCtrl", ["$scope", "$http", "$routeParams", "$location",
        function($scope, $http, $routeParams, $location) {
           
           function clearPatent(){
          
            $scope.newPatent={
            }
        }
           function backToListPatents(){
          
            $location.path("/");
        }
           
            
            $scope.createPatent = function (){
              
            
             $http
                .post("/api/v1/patents/",$scope.newPatent)
                .then(function(response) {
                    backToListPatents();
                }, function(error){
                    console.log(error.status);
                    
                    if(error.status == '422'){
                    $scope.error = "Please review the information entered in the fields";
                    }
                    if(error.status == '409'){
                    $scope.error = "There is another patent with same name and date";
                    }
                    //alert(error.data);
                });
            
            }
            clearPatent();
        
        }]);