var opts = {
    angle: 0.20, // The span of the gauge arc
    lineWidth: 0.2, // The line thickness
    radiusScale: 0.99, // Relative radius
    fontSize: 40,
    pointer: {
        length: 0.51, // // Relative to gauge radius
        strokeWidth: 0.035, // The thickness
        color: '#000000' // Fill color
    },
    limitMax: false,     // If false, max value increases automatically if value > maxValue
    limitMin: false,     // If true, the min value of the gauge will be fixed
    colorStart: '#6FADCF',   // Colors
    colorStop: '#8FC0DA',    // just experiment with them
    strokeColor: '#E0E0E0',  // to see which ones work best for you
    generateGradient: true,
    highDpiSupport: true,     // High resolution support
    staticZones: [
        { strokeStyle: "#74C150", min: 0, max: 300 }, // Red from 100 to 130
        { strokeStyle: "#F8C93A", min: 300, max: 450 }, // Yellow
        { strokeStyle: "#F1513A", min: 450, max: 600 } // Green
    ],
    staticLabels: {
        font: "12px sans-serif",  // Specifies font
        labels: [0, 100, 200, 300, 400, 500, 600],  // Print labels at these values
        color: "#000000",  // Optional: Label text color
        fractionDigits: 0  // Optional: Numerical precision. 0=round off.
    },
    renderTicks: {
        divisions: 1,
        divWidth: 1,
        divLength: 0.7,
        divColor: '#333333',
        subDivisions: 6 * 2,
        subLength: 0.5,
        subWidth: 0.6,
        subColor: '#666666'
    },
};
var target = document.getElementById('gauge'); // your canvas element
var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
gauge.maxValue = 600; // set max gauge value
gauge.setMinValue(0);  // Prefer setter over gauge.minValue = 0
gauge.animationSpeed = 2048 * 4; // set animation speed (32 is default value)
gauge.set(0); // set actual value

// var target = document.getElementById('gauge_ave'); // your canvas element
// var gauge_ave = new Gauge(target).setOptions(opts); // create sexy gauge!
// gauge_ave.maxValue = 600; // set max gauge value
// gauge_ave.setMinValue(0);  // Prefer setter over gauge.minValue = 0
// gauge_ave.animationSpeed = 2048 * 4; // set animation speed (32 is default value)
// gauge_ave.set(0); // set actual value


var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['これ', 'ここ', 'こちら', 'それ', 'そこ', 'そちら', 'あれ', 'あそこ', 'あちら'],
        datasets: [{
            label: '指示代名詞自動チェック',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [           // Ｙ軸 
                {
                    ticks: {     // 目盛り        
                        min: 0,      // 最小値
                        // beginAtZero: true でも同じ
                        //max: 25,     // 最大値
                        stepSize: 1  // 間隔
                    }
                }
            ],
            y: {
                beginAtZero: true
            }
        }
    }
});