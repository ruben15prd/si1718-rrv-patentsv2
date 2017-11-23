
angular.module("PatentManagerApp", ["ngRoute"])
    .config(function ($routeProvider){
        
        $routeProvider
            .when("/",{
                templateUrl: "list.html",
                controller : "ListCtrl"
            }).when("/patents/:idPatent",{
                templateUrl: "edit.html",
                controller : "EditCtrl"
            });
        
        console.log("App Initialized");            
        
    });
