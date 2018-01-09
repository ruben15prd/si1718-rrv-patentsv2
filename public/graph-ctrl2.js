angular.module("PatentManagerApp")
    .controller("GraphCtrl2", ["$scope", "$http", function($scope, $http) {
        
        // Inicializamos variables
        
        $scope.searchDay1 = "";
        $scope.searchMonth1 = "";
        $scope.searchYear1 = "";
        
        $scope.searchMonth2 = "";
        $scope.searchYear2 = "";
        
        function refresh(){
            
            
            
            $http
                .get("/api/v1/statistics2")
                .then(function(response) {
                    $scope.batch = response.data;
                    
                    var currentDate = new Date();
                    
                    var currentDay = currentDate.getDate();
                    var currentMonth = currentDate.getMonth()+1;
                    var currentYear = currentDate.getFullYear();
                    
                    var batchThisMonth = [];
                    var batchToday = [];
                    
                       for(var i in $scope.batch) {
                        
                        var day = $scope.batch[i].date.split("-")[0];
                        var month = $scope.batch[i].date.split("-")[1];
                        var year = $scope.batch[i].date.split("-")[2];
                        
                        var dayNumber = Number(day);
                        var monthNumber = Number(month);
                        var yearNumber = Number(year);
                        
                      
                      
                        //Cogemos los batch de hoy
                        
                        if($scope.searchDay1 != "" && $scope.searchMonth1 != "" && $scope.searchYear1 != ""){
                             var daySearch1 = $scope.searchDay1;
                             var monthSearch1 = $scope.searchMonth1;
                             var yearSearch1 = $scope.searchYear1;
                             
        console.log("Date search: "+ daySearch1+ "-" + monthSearch1+ "-"+ yearSearch1 + "          Date current: "+ currentDay + "-"+currentMonth + "-"+currentYear);
                        
                             
                        if(daySearch1.toString() === dayNumber.toString() && monthSearch1.toString() === monthNumber.toString() && yearSearch1.toString() === yearNumber.toString()){
                            batchToday.push($scope.batch[i]);

                             
                        }

                            
                            
                           
                             
                             
                        }else{
                            
                            if(currentDay.toString() === dayNumber.toString() && currentMonth.toString() === monthNumber.toString() && currentYear.toString() === yearNumber.toString()){
                            batchToday.push($scope.batch[i]);
                        }
                        
                        }
                        
                        
                         //Cogemos los batch del mes
                        //console.log("Date batch: "+ dayNumber+ "-" + monthNumber+ "-"+ yearNumber + "          Date current: "+ currentDay + "-"+currentMonth + "-"+currentYear);
                        
                        if($scope.searchMonth2 != "" && $scope.searchYear2 != ""){
                             var monthSearch2 = $scope.searchMonth2;
                             var yearSearch2 = $scope.searchYear2;
                             
        
                             
                        if(monthSearch2.toString() === monthNumber.toString() && yearSearch2.toString() === yearNumber.toString()){
                            batchThisMonth.push($scope.batch[i]);

                             
                        }

                            
                            
                           
                             
                             
                        }else{
                            
                            if(currentMonth.toString() === monthNumber.toString() && currentYear.toString() === yearNumber.toString()){
                            batchThisMonth.push($scope.batch[i]);
                        }
                        
                        }
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                        
                        
                }
        var categoriesToday = []; 
        var valuesToday = [];
        
       for(var i in batchToday) {
           var keyword = batchToday[i].keyword;
           var numTweets = batchToday[i].numTweets;
           categoriesToday.push(keyword);
           valuesToday.push(numTweets);
           
       }   
       
    Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Tweets by keyword today'
    },
    subtitle: {
        text: 'Source: Batch'
    },
    xAxis: {
        categories: categoriesToday,
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Tweets'
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
        name: 'Tweets',
        data: valuesToday

    }]
});

        var categoriesThisMonth = []; 
        var valuesThisMonth = [];
        
       for(var i in batchThisMonth) {
           var keyword = batchThisMonth[i].keyword;
           var numTweets = batchThisMonth[i].numTweets;
           categoriesThisMonth.push(keyword);
           valuesThisMonth.push(numTweets);
           
       }   
 Highcharts.chart('container2', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Tweets by keyword this month'
    },
    subtitle: {
        text: 'Source: Batch'
    },
    xAxis: {
        categories: categoriesThisMonth,
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Tweets'
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
        name: 'Tweets',
        data: valuesThisMonth

    }]
});


                    
                    
                });
            

        }
        
        $scope.searchRefresh = function() {
            refresh();
        }
        
       

        refresh();

    }]);
