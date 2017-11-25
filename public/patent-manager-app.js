
angular.module("PatentManagerApp", ["ngRoute"])
    .config(function ($routeProvider){
        
        $routeProvider
            .when("/",{
                templateUrl: "list.html",
                controller : "ListCtrl"
            }).when("/patents/:idPatent",{
                templateUrl: "edit.html",
                controller : "EditCtrl"
            }).when("/create",{
                templateUrl: "create.html",
                controller : "CreateCtrl"
            });
        
        console.log("App Initialized");            
        
    });
