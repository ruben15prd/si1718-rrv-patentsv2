angular.module("PatentManagerApp")
    .controller("EditCtrl", ["$scope", "$http", "$routeParams", "$location", "$route",
        function($scope, $http, $routeParams, $location, $route) {

            var inventor;

            $scope.patentId = $routeParams.idPatent;
            console.log("EditCtrl initialized for patent " + $scope.patentId);
            $http
                .get("/api/v1/patents/" + $scope.patentId)
                .then(function(response) {
                    $scope.updatedPatent = response.data;

                    if ($scope.updatedPatent.inventors.length > 0) {
                        inventor = String($scope.updatedPatent.inventors[0]);
                        $scope.inventorsCol = [];
                        for (var i in $scope.updatedPatent.inventors) {
                            if ($scope.updatedPatent.inventors[i].includes("https://") == true) {
                                $scope.inventorsCol.push($scope.updatedPatent.inventorName);
                            }
                            else {
                                $scope.inventorsCol.push($scope.updatedPatent.inventors[i]);
                            }
                        }
                        //console.log($scope.inventorsCol);
                    }

                    if (inventor.includes("https://") == true) {
                        $scope.muestraValida = false;
                        inventor = $scope.updatedPatent.inventorName;
                    }
                    else {
                        $scope.muestraValida = true;
                    }


                    $http
                        .get("https://si1718-dfr-researchers.herokuapp.com/api/v1/researchers?search=" + inventor)
                        .then(function(response) {
                            $scope.researchers = response.data;
                            if ($scope.researchers.length > 0) {
                                $scope.researcher = $scope.researchers[0];
                                $scope.inventorName = $scope.researchers[0].name;
                            }

                        });
                    // Mostramos las recomendaciones
                    $scope.recommendations = [];
                      $http
                        .get("/api/v1/recommendation/" + $scope.patentId)
                        .then(function(response) {
                            $scope.recommendationsIds = response.data;
                            
                            
                            for(var i in $scope.recommendationsIds.recomendations) {
                                var idPatent = $scope.recommendationsIds.recomendations[i];
                                
                             
                           $http
                        .get("/api/v1/patents/"  + idPatent)
                        .then(function(response) {
                            $scope.recommendation = response.data;
                            $scope.recommendations.push($scope.recommendation);

                        });
                         
                    
                        
                 }
                            
                        });
                    
                    
                    
                    

                });




            $scope.updatePatent = function() {

                delete $scope.updatedPatent._id;

                //Pasamos los strings a colecciones tanto de inventors como de keywords

                var inventorsCollection = inventorsStrToCollection($scope.updatedPatent);

                $scope.updatedPatent.inventors = inventorsCollection;


                var keywordsCollection = keywordsStrToCollection($scope.updatedPatent);

                $scope.updatedPatent.keywords = keywordsCollection;

                $http
                    .put("/api/v1/patents/" + $scope.patentId, $scope.updatedPatent)
                    .then(function(response) {
                        console.log("updated");
                        $location.path("/");
                    }, function(error) {

                        if (String(error.status) != '200') {
                            switch (String(error.status)) {
                                case '422':
                                    $scope.error = "Please review the information entered in the fields";
                                    break;
                                default:
                                    $scope.error = "Error, please contact administrator";
                            }

                        }
                        //alert(error.data);
                    });

            }























            $scope.deleteInventor = function() {

                $scope.updatedPatent.inventors.splice($scope.updatedPatent.inventors.length - 1, 1);
                delete $scope.updatedPatent._id;

                //Pasamos los strings a colecciones tanto de inventors como de keywords

                var inventorsCollection = inventorsStrToCollection($scope.updatedPatent);

                $scope.updatedPatent.inventors = inventorsCollection;


                var keywordsCollection = keywordsStrToCollection($scope.updatedPatent);

                $scope.updatedPatent.keywords = keywordsCollection;

                $http
                    .put("/api/v1/patents/" + $scope.patentId, $scope.updatedPatent)
                    .then(function(response) {
                        console.log("updated");
                        $route.reload();
                    }, function(error) {

                        if (String(error.status) != '200') {
                            switch (String(error.status)) {
                                case '422':
                                    $scope.error = "Please review the information entered in the fields";
                                    break;
                                default:
                                    $scope.error = "Error, please contact administrator";
                            }

                        }
                        //alert(error.data);
                    });
            }


            $scope.refresh = function() {
                $route.reload();
            }

            $scope.addInventor = function() {
                if ($scope.updatedPatent.inventors.length == 0) {
                    $scope.updatedPatent.inventors = $scope.updatedPatent.inventors + "" + $scope.inventorAdd;
                }
                else {
                    $scope.updatedPatent.inventors = $scope.updatedPatent.inventors + "," + $scope.inventorAdd;
                }
                delete $scope.updatedPatent._id;

                //Pasamos los strings a colecciones tanto de inventors como de keywords

                var inventorsCollection = inventorsStrToCollection($scope.updatedPatent);

                $scope.updatedPatent.inventors = inventorsCollection;


                var keywordsCollection = keywordsStrToCollection($scope.updatedPatent);

                $scope.updatedPatent.keywords = keywordsCollection;

                $http
                    .put("/api/v1/patents/" + $scope.patentId, $scope.updatedPatent)
                    .then(function(response) {
                        console.log("updated");
                        $route.reload();
                    }, function(error) {

                        if (String(error.status) != '200') {
                            switch (String(error.status)) {
                                case '422':
                                    $scope.error = "Please review the information entered in the fields";
                                    break;
                                default:
                                    $scope.error = "Error, please contact administrator";
                            }

                        }
                        //alert(error.data);
                    });
            }






            $scope.validatePatent = function() {

                delete $scope.updatedPatent._id;

                if ($scope.researchers.length > 0) {
                    $scope.updatedPatent.inventorName = $scope.researcher.name;
                    $scope.updatedPatent.inventors[0] = 'https://si1718-dfr-researchers.herokuapp.com/api/v1/researchers/' + $scope.researchers[0].idResearcher;
                }

                //Pasamos los strings a colecciones tanto de inventors como de keywords

                var inventorsCollection = inventorsStrToCollection($scope.updatedPatent);

                $scope.updatedPatent.inventors = inventorsCollection;


                var keywordsCollection = keywordsStrToCollection($scope.updatedPatent);

                $scope.updatedPatent.keywords = keywordsCollection;

                $http
                    .put("/api/v1/patents/" + $scope.patentId, $scope.updatedPatent)
                    .then(function(response) {
                        console.log("updated");
                        $location.path("/");
                    }, function(error) {

                        if (String(error.status) != '200') {
                            switch (String(error.status)) {
                                case '422':
                                    $scope.error = "Please review the information entered in the fields";
                                    break;
                                default:
                                    $scope.error = "Error, please contact administrator";
                            }

                        }
                        //alert(error.data);
                    });

            }

            $scope.change = function() {

                $scope.muestraValida = false;




            }


        }
    ]);

function inventorsStrToCollection(patent) {



    if (!Array.isArray(patent.inventors)) {
        var inventorsCollection = [];
        var split = patent.inventors.split(",");

        for (var i in split) {
            inventorsCollection.push(split[i]);
        }
        return inventorsCollection;
    }
    else {
        return patent.inventors;
    }




}

function keywordsStrToCollection(patent) {

    if (!Array.isArray(patent.keywords)) {
        var keywordsCollection = [];
        var split = patent.keywords.split(",");

        for (var i in split) {
            keywordsCollection.push(split[i]);
        }
        return keywordsCollection;
    }
    else {
        return patent.keywords;
    }





}
