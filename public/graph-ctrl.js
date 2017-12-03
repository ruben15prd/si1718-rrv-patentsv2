angular.module("PatentManagerApp")
    .controller("GraphCtrl", ["$scope", "$http", function($scope, $http) {
        
        $scope.patentsGraph;
        
        function refresh() {
            
            $http
                .get("/api/v1/patents")
                .then(function(response) {
                    $scope.data = response.data;
                    $scope.patentsGraph = response.data;
                    var years = [];
                // Recorremos las patentes para sacar los años    
                for(var i in $scope.data) {
                    
                        var year = $scope.data[i].date.split("-")[0];
                        var yearNumber = Number(year);
                        years.push(yearNumber);
                }
                // Ordenamos el array para coger el minimo y maximo
                var yearsSort = years.sort();
                
                var startYear= yearsSort[0];
                var finishYear = yearsSort[yearsSort.length - 1];
                
                var consecutiveYears=[];
                //Generamos los años que queremos que tenga nuestro diagrama de barras
                for(i = startYear ;i <= finishYear; i++) {
                    
                    consecutiveYears.push(String(i));
                }
                //Generamos el numero de patentes para cada año
                var patentsValuePerYear = [];
                var numPatentsPerYear = 0;
                
                var cont = startYear;
                while (cont <= finishYear) {
                    
                    for(var i in $scope.data) {
                        var year = $scope.data[i].date.split("-")[0];
                        var yearNumber = Number(year);
                        if(cont == yearNumber){
                            numPatentsPerYear = numPatentsPerYear +1;
                        }
                    }
                    patentsValuePerYear.push(numPatentsPerYear);
                    numPatentsPerYear = 0;
                    cont++;
                    
                }
                    
                    Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Patents per year'
    },
    subtitle: {
        text: 'Source: Patents'
    },
    xAxis: {
        categories: consecutiveYears,
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Patents'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [{
        name: 'Patents',
        data: patentsValuePerYear

    }]
});


                    


                }).then(function(response) {
                  // Generamos el segundo diagrama
                  
                 // Obtenemos todos los investigadores 
                  $http
                .get("https://si1718-dfr-researchers.herokuapp.com/api/v1/researchers")
                .then(function(response) {
                    $scope.allResearchers = response.data;
                
                    
                    
                    
                    //Obtenemos los grupos y sus investigadores
                    $http
                .get("https://si1718-rgg-groups.herokuapp.com/api/v1/groups")
                .then(function(response) {
                    $scope.data = response.data;
                    
                    var peticion = [];
                    
                    for(var i in $scope.data) {
                        var idGroup = $scope.data[i].idGroup;
                        var components = $scope.data[i].components;
                        
                        peticion.push({
                            key:   idGroup,
                            value: components
                        });
                        
                }
                // Recorremos el diccionario
                var departmentIds = [];
                var numPatentsPerGroup = [];
                
                
                for(var i in peticion) {
                var numPatents = 0;
                var departmentId = peticion[i].key;
                departmentIds.push(departmentId);
                        
                var inventors = peticion[i].value;
                
                for (var j = 0; j < inventors.length; j++) {
                            
                var inventor = inventors[j];
                 //Obtenemos la id del investigador
                        
                        var idEncontrado = searchResearcherId(String(inventor));
                        
                        //console.log("id: "+idEncontrado);
                        if(!idEncontrado == ""){
                            numPatents = numPatents + numOfPatentsInventor(idEncontrado);
                        }else{
                            numPatents = 0;
                        }
                          
                }
    
                  //console.log(numPatents);       
                  numPatentsPerGroup.push(numPatents); 
                }
                //console.log("departmentIds: "+ departmentIds);
                //console.log("patents: "+ numPatentsPerGroup);
                
                
                    
Highcharts.chart('container2', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Patens per group of researchers'
    },
    subtitle: {
        text: 'Source: Groups'
    },
    xAxis: {
        categories: departmentIds,
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Patents per group'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [{
        name: 'Patents',
        data: numPatentsPerGroup

    }]
});



                    


                })
 
                    
                });
                    
                }
                    
                    
                    );
                
            

        }


        refresh();
        function searchResearcherId(busqueda){
        var res = "";
        
        for(var q in $scope.allResearchers){
            if(String($scope.allResearchers[q].name).includes(busqueda)){
                    res = $scope.allResearchers[q].idResearcher;
                    break;
            }
            }
            //console.log("id: "+res);
            return res;    
        }
        
        function numOfPatentsInventor(inventorId){
        var res = 0;
        
        for(var i in $scope.patentsGraph){
           var inventors = $scope.patentsGraph[i].inventors;
           //console.log($scope.patentsGraph[i].inventors);
           for(var q in inventors){
               //console.log("inventor: "+inventors[q] +" comparando con el id: "+inventorId);
               if(inventors[q].includes(inventorId)){
                   res = res + 1;
                   break;
               } 
               
           }
            }
            return res;    
        }

    }]);
