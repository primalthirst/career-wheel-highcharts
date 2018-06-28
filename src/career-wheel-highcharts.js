
var lightbox;
var chart;
var zoom;
var careerInfo;

function init(){

    if(!data){
        console.log("Can't find data file or it doesn't set 'data'");
        return;
    }

    drawWheel();

    window.onresize = function(){
        drawWheel();
    }

    // Reset button
    var resetButton = document.getElementById('reset');
    if(resetButton){
        resetButton.style.cursor = 'pointer';

        resetButton.onclick = function(){
            zoom1();
            chart.series[0].drillUp();
        };
    }

    // Close button
    var closeButton = document.getElementById('closeButton');
    if(closeButton){
        closeButton.onclick = function(){
            
            // Fade out info window
            document.getElementById('info-overlay').classList.remove('fade-in');
            document.getElementById('info-overlay').classList.add('fade-out');
            
            // Fade in career wheel
            document.getElementById('career-wheel').classList.remove('fade-out');
            document.getElementById('career-wheel').classList.add('fade-in');

            // Fade in career wheel close button
            parent.document.getElementsByClassName('featherlight-close-icon')[0].classList.remove('hide');
        };
    }

    // Load career info JSON file
    loadJSON(function(response) {
        careerInfo = JSON.parse(response);
    });
}

function drawWheel(){

    var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    if(w < 400){
        var wheelFontSize = '8px';        
        var chartSize = '100%';
        var wheelBorderWidth = 1;
    }    
    else if(w < 500){
        wheelFontSize = '10px';
        chartSize = '100%';
        wheelBorderWidth = 1;
    }
    else if(w < 600){
        wheelFontSize = '11px';
        chartSize = '100%';
        wheelBorderWidth = 1.5;
    }
    else if(w < 760){
        wheelFontSize = '12px';
        chartSize = '80%';
        wheelBorderWidth = 1.5;
    }
    else{
        wheelFontSize = '14px';   
        chartSize = '80%';
        wheelBorderWidth = 1.5;
    }
    
    zoom = 1;
    chart = Highcharts.chart('container', {
        colors: ['#79c267', ' #c5d647', ' #f5d63d', ' #f28c33', ' #e868a2', ' #bf62a6', ' #0392cf'],
        credits: false,
        chart: {
            spacing: [0, 0, 0, 0],
            height: chartSize,
            backgroundColor:'null'
        },
        title: {
            text: ''
        },
        plotOptions: {
            exporting: false,
            series: {
                states: {
                    hover: {
                        color: 'rgba(255,255,255, 0.9)'
                    }
                },
                cursor: 'pointer',
                point: {
                    events: {
                        click: function (){
                                               
                            if(this.value == "2"){
                                showInfo(this.name);
                            }
                            else if(this.value == "1"){                     
                                if(zoom == 1){                                   
                                    zoom2();                           
                                }
                                else{
                                    zoom1();
                                    chart.series[0].drillUp();
                                }
                                chart.render();
                            }
                        }
                    }
                }
            }
        },
        series: [{
            type: "sunburst",
            borderColor: '#222222',
            lineWidth: 2,
            borderWidth: wheelBorderWidth,
            states: {
                hover: {
                    borderColor: '#222',
                }
            },
            colorByPoint: true,
            data: data,
            allowDrillToNode: true,
            cursor: 'pointer',
            colorVariation: {
                    key: 'brightness',
                    to: -0.5
            },
            dataLabels: {   
                allowOverlap: true,    
                rotationMode: 'perpendicular',
                style:  {
                    fontFamily: 'Helvetica',
                    textShadow: false,
                    fontSize: wheelFontSize,
                    fontWeight: 'bold',
                    textOverflow: 'none',
                    textOutline: '1px contrast'
                }
            },
            levels: [{
                level: 1,
                levelIsConstant: false,
                levelSize: {
                    unit: 'percentage',
                    value: 28
                },
                dataLabels: {
                    rotationMode: 'parallel',
                }
            }, {
                level: 2,
                levelSize: {
                    unit: 'percentage',
                    value: 72
                },
                colorByPoint: true,
                dataLabels: {
                    rotationMode: 'perpendicular',
                },
            },
            {
                level: 3,            
                colorByPoint: true,
                levelSize: {
                    unit: 'percentage',
                    value: 0
                },
                dataLabels: {
                    enabled : false,
                },
                colorVariation: {
                    key: 'brightness',
                    to: -0.5
                },
            }]

        }],
        tooltip: {
            enabled: false,
        }
    });
}

function zoom1(){

    // Zoom out to full wheel
    zoom = 1;
    chart.series[0].options.levels[0].levelSize.value = '28';
    chart.series[0].options.levels[1].levelSize.value = '72';
    chart.series[0].options.levels[1].dataLabels.rotationMode = 'perpendicular';
    chart.series[0].options.levels[2].levelSize.value = '0';
    chart.series[0].options.levels[2].dataLabels.enabled = false;

    // Hide reset button
    var resetButton = document.getElementById("reset");
    resetButton.style.visibility = 'hidden'; 

    // Update instructions
    instruction.innerHTML = 'Choose a subject that interests you.';
}

function zoom2(){

    // Zoom in to career options
    zoom = 2;
    chart.series[0].options.levels[1].levelSize.value = '28';
    chart.series[0].options.levels[2].levelSize.value = '72';
    chart.series[0].options.levels[1].dataLabels.rotationMode = 'parallel';
    chart.series[0].options.levels[2].dataLabels.enabled = true; 

    // Show reset button
    var resetButton = document.getElementById("reset");
    resetButton.style.visibility = 'visible'; 

    // Update instructions
    var instruction = document.getElementById("instruction");                            
    instruction.innerHTML = 'Choose a career that interests you.';
}

function showInfo(careerName){
   // lightbox = lity('/files/career-info.html?career=' + careerName); // Modify to pass careerName through to url
   var info = document.getElementById("info-overlay");
   if(info && careerInfo && careerInfo[careerName]){
        
        // Fade in info window 
        info.classList.remove('hide');
        info.classList.remove('fade-out');
        info.classList.add('fade-in');

        // Update message at top of window
        if(careerName.toLowerCase().charAt() == ('a' || 'e' || 'i' || 'o' || 'u')){
            var message = "So you want to be an "; 
        }
        else{
            var message = "So you want to be a "; 
        }
        document.getElementById("subheading").innerHTML = message + careerName + "...";


        // Show degrees - Clear current list from info window than add list of relevant degrees linking to college site
        var list = document.getElementById("degrees");
        
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
        
        var arrayColours = ["bg-cmbe50", "bg-cps50", "platinum10"];
        var c = 0;
        careerInfo[careerName].degrees.forEach(function(item) {
            
            if(careerInfo[item])
            {
                var link = careerInfo[item].url;
                var icon = careerInfo[item].icon;

                if(link && icon)
                {
                    
                    var ico = document.createElement('img');
                    //ico.className = 'fa-4x fa fa-' + icon + ' ' + arrayColours[c];
                    ico.src = icon;
                    ico.className = "icon-image";
                    c++;
                    if(c == arrayColours.length) c = 1;

                    var icoHolder = document.createElement('div');
                    icoHolder.className = "padbottom"
                    icoHolder.appendChild(ico);

                    var a = document.createElement('a');
                    a.appendChild(icoHolder);
                    a.appendChild(document.createTextNode(item))
                    a.className = "nounderline";
                    a.title = item;
                    a.href = link;

                    var box = document.createElement('div');  
                    box.className = "float degree-box text-center"                    
                    box.appendChild(a);

                    list.appendChild(box); 
                }
                else
                {
                    console.log("ERROR: Can't find link or icon for:", item);
                }
            }
            else
            {
                console.log("ERROR: Can't find degree:", item)
            }
        }); 

        /*

        // Show majors - Clear current list from info window than add list of relevant majors
        var list = document.getElementById("majors");
        
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
        
        careerInfo[careerName].majors.forEach(function(item) {
            var listItem = document.createElement('li');
            listItem.appendChild(document.createTextNode(item));
            list.appendChild(listItem);
        }); 

        // Show minors - Clear current list from info window than add list of relevant minors
        list = document.getElementById("minors");
        
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
        
        careerInfo[careerName].minors.forEach(function(item) {
            var listItem = document.createElement('li');
            listItem.appendChild(document.createTextNode(item));
            list.appendChild(listItem);
        }); 

        // Show specialisations - Clear current list from info window than add list of relevant specialisations
        list = document.getElementById("specialisations");
        
        while(list.firstChild) {
            list.removeChild(list.firstChild);
        }
        
        careerInfo[careerName].specialisations.forEach(function(item) {
            var listItem = document.createElement('li');
            listItem.appendChild(document.createTextNode(item));
            list.appendChild(listItem);
        });

        */ 
   }
   else
   {
        console.log("ERROR: Reading career info data");
        console.log("Info overlay element:", info);
        console.log("CareerInfo JSON object:", careerInfo);
        console.log("Selected career in JSON object:", careerName, careerInfo[careerName]);
   }

   // Fade out career wheel
   document.getElementById('career-wheel').classList.remove('fade-in');
   document.getElementById('career-wheel').classList.add('fade-out');

   // Hide career wheel close button
   parent.document.getElementsByClassName('featherlight-close-icon')[0].classList.add('hide');
}

 function loadJSON(callback) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', '/sites/science.anu.edu.au/libraries/career-wheel/career-info-highcharts.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }

init();