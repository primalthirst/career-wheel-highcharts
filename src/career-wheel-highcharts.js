
var lightbox;
var chart;
var zoom;

function init(){

    if(!data){
        console.log("Can't find data file or it doesn't set 'data'");
        return;
    }

    drawWheel();

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
            //document.getElementsByClassName('lity-close')[0].classList.remove('fade-out');
            //document.getElementsByClassName('lity-close')[0].classList.add('fade-in');
        };
    }
}

function drawWheel(){

    var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    console.log("W: ", w);

    if(w < 400){
        var wheelFontSize = '8px';
        var wheelFontOutline = false;
        var chartHeight = '100%';
    }    
    else if(w < 600){
        var wheelFontSize = '10px';
        var wheelFontOutline = false;
        var chartHeight = '100%';
    }
    else if(w < 760){
        wheelFontSize = '12px';
        wheelFontOutline = false;
        chartHeight = '100%';
    }
    else if(w < 1024){
        wheelFontSize = '16px';   
        wheelFontOutline = true;
        chartHeight = '90%';
    }
    else{
        wheelFontSize = '24px';
        wheelFontOutline = true;
        chartHeight = '100%';
    }
    

    // Splice in transparent for the center circle
    Highcharts.getOptions().colors.splice(0, 0, 'transparent');

    zoom = 1;
    chart = Highcharts.chart('container', {
        credits: false,
        chart: {
            height: chartHeight,
            backgroundColor:'null',
        },
        title: {
            text: ''
        },
        plotOptions: {
            exporting: false,
            series: {
                events: {
                        afterAnimate: function() {                  
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
                            else{
                                hideInfo();
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
            states: {
                hover: {
                    borderColor: '#222',
                }
            },
            colorByPoint: true,
            data: data,
            allowDrillToNode: true,
            cursor: 'pointer',
            dataLabels: {   
                padding: 0,
                allowOverlap: true,    
                rotationMode: 'perpendicular',    
                formatter: function(){
                    var s = formatString(this.point.name, 16);
                    console.log('split', s, this.point.name);
                    return s;
                },
                style:  {
                    textShadow: true,
                    fontSize: wheelFontSize,
                }
            },
            levels: [{
                level: 1,
                levelIsConstant: false,
                levelSize: {
                    unit: 'percentage',
                    value: 30
                },
                dataLabels: {
                    rotationMode: 'parallel'                
                }
            }, {
                level: 2,
                levelSize: {
                    unit: 'percentage',
                    value: 72
                },
                colorByPoint: true,
                dataLabels: {
                    rotationMode: 'perpendicular'
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
                    enabled : false                
                },
                colorVariation: {
                    key: 'brightness',
                    to: -0.5
                }
            }]

        }],
        tooltip: {
            formatter: function () {
                //console.log(zoom, this.point.value);
                if(zoom == 1 && this.point.value == 1){
                    return 'I love ' + this.point.name.toLowerCase();
                }
                else if(zoom == 2 && this.point.value == 2)
                {
                    return 
                    if(this.point.name.toLowerCase().charAt() == ('a' || 'e' || 'i' || 'o' || 'u')){
                        return 'I want to be an ' + this.point.name.toLowerCase();
                    }
                    else{
                        return 'I want to be a ' + this.point.name.toLowerCase();
                    }
                }
                else if(zoom == 2 && this.point.value == 1){
                    return "Start again";
                }
                else{
                    return "What do I love?";
                }
            }
        },
        colors: ['#79c267', ' #c5d647', ' #f5d63d', ' #f28c33', ' #e868a2', ' #bf62a6', ' #0392cf'],
    });
}

function getWidth() {
    if (self.innerWidth) {
        return self.innerWidth;
    }

    if (document.documentElement && document.documentElement.clientWidth) {
        return document.documentElement.clientWidth;
    }

    if (document.body) {
        return document.body.clientWidth;
    }
}

function zoom1(){

    // Zoom out to full wheel
    zoom = 1;
    chart.series[0].options.levels[0].levelSize.value = '30';
    chart.series[0].options.levels[1].levelSize.value = '70';
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

    // Zoom in to subject
    zoom = 2;
    chart.series[0].options.levels[1].levelSize.value = '30';
    chart.series[0].options.levels[2].levelSize.value = '70';
    chart.series[0].options.levels[1].dataLabels.rotationMode = 'parallel';
    chart.series[0].options.levels[2].dataLabels.enabled = true; 

    // Show reset button
    var resetButton = document.getElementById("reset");
    resetButton.style.visibility = 'visible'; 

    // Update instructions
    var instruction = document.getElementById("instruction");                            
    instruction.innerHTML = 'Choose a degree that interests you.';
}

function showInfo(careerName){
   // lightbox = lity('/files/career-info.html?career=' + careerName); // Modify to pass careerName through to url
   var info = document.getElementById("info-overlay");
   if(info){
        
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
   }

   // Fade out career wheel
   document.getElementById('career-wheel').classList.remove('fade-in');
   document.getElementById('career-wheel').classList.add('fade-out');

   // Hide career wheel close button
   console.log("*", document.getElementsByClassName('lity-close'));
   console.log("*", document.getElementsByClassName('lity-close')[0]);
   //document.getElementsByClassName('lity-close')[0].classList.remove('fade-in');
   //document.getElementsByClassName('lity-close')[0].classList.add('fade-out');
}


function formatString(str, splitAt) {
    if(str.length > splitAt){
        console.log(str, splitAt);
        var p = 0;
        for (;p < str.length && (str[p]!= ' ' && str[p] != '/'); p++){ 
        }
        
        if(str[p] == ' '){      
            return str.slice(0, p) + "<br/>" + str.slice(p + 1, str.length);
        }
        else if(str[p] == '/'){
            return str.slice(0, p + 1) + "<br/>" + str.slice(p + 1, str.length);
        }
    }
    return str;
}

function hideInfo(){
    //lightbox.close();
}

init();