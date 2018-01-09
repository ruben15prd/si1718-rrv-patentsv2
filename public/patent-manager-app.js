
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
            }).when("/graph",{
                templateUrl: "graph.html",
                controller : "GraphCtrl"
            }).when("/graph2",{
                templateUrl: "graph2.html",
                controller : "GraphCtrl2"
            }).when("/listNewPatents",{
                templateUrl: "listNewPatents.html",
                controller : "ListNewPatentsCtrl"
            })
            ;
        
        console.log("App Initialized");            
        
    });
