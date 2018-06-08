
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
    resetButton.style.cursor = 'pointer';

    resetButton.onclick = function(){
        zoom1();
        chart.series[0].drillUp();
        hideInfo();
    };
}

function drawWheel(){

    // Splice in transparent for the center circle
    Highcharts.getOptions().colors.splice(0, 0, 'transparent');

    zoom = 1;
    chart = Highcharts.chart('container', {
        credits: false,
        chart: {
            height: '90%',
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
                        //console.log("^^^", this);                    
                    }
                },
                cursor: 'pointer',
                point: {
                    events: {
                        click: function () {
                                               
                            if(this.value == "2")
                            {
                                showInfo(this.name);
                            }
                            else if(this.value == "1")
                            {                     
                                if(zoom == 1)
                                {                                   
                                    zoom2();                           
                                }
                                else
                                {
                                    zoom1();
                                    chart.series[0].drillUp();
                                }
                                chart.render();
                            }
                            else
                            {
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
                allowOverlap: true,    
                rotationMode: 'perpendicular',     
                format: '{point.name}',
            },
            levels: [{
                level: 1,
                levelIsConstant: false,
                levelSize: {
                    unit: 'percentage',
                    value: 40
                },
                dataLabels: {
                    rotationMode: 'parallel'                
                }
            }, {
                level: 2,
                levelSize: {
                    unit: 'percentage',
                    value: 60
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
            formatter: function () 
            {
                console.log(zoom, this.point.value);
                if(zoom == 1 && this.point.value == 1)
                {
                    return 'I love ' + this.point.name.toLowerCase();
                }
                else if(zoom == 2 && this.point.value == 2)
                {
                    if(this.point.name.toLowerCase().charAt() == 'a')
                    {
                        return 'I want to be an ' + this.point.name.toLowerCase();
                    }
                    else
                    {
                        return 'I want to be a ' + this.point.name.toLowerCase();
                    }
                }
                else if(zoom == 2 && this.point.value == 1)
                {
                    return "Start again";
                }
                else
                {
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

    console.log("ZOOM 1");

    // Zoom out to full wheel
    zoom = 1;
    chart.series[0].options.levels[0].levelSize.value = '40';
    chart.series[0].options.levels[1].levelSize.value = '60';
    chart.series[0].options.levels[1].dataLabels.rotationMode = 'perpendicular';
    chart.series[0].options.levels[2].levelSize.value = '0';
    chart.series[0].options.levels[2].dataLabels.enabled = false;

    var resetButton = document.getElementById("reset");
    resetButton.style.visibility = 'hidden'; 

    instruction.innerHTML = 'Choose a subject that interests you.';
}

function zoom2(){

    console.log("ZOOM 2");
    // Zoom in to subject
    zoom = 2;
    chart.series[0].options.levels[1].levelSize.value = '40';
    chart.series[0].options.levels[2].levelSize.value = '60';
    chart.series[0].options.levels[1].dataLabels.rotationMode = 'parallel';
    chart.series[0].options.levels[2].dataLabels.enabled = true; 

    var resetButton = document.getElementById("reset");
    resetButton.style.visibility = 'visible'; 

    var instruction = document.getElementById("instruction");                            
    instruction.innerHTML = 'Choose a degree that interests you.';
}

function showInfo(careerName){
    lightbox = lity('/files/career-info.html?career=' + careerName); // Modify to pass careerName through to url
}

function hideInfo(){
    lightbox.close();
}

init();