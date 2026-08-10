const revenueChart=document.getElementById("revenueChart");

if(revenueChart){

new Chart(revenueChart,{

type:"line",

data:{

labels:["Jan","Feb","Mar","Apr","May","Jun"],

datasets:[{

label:"Revenue",

data:[120000,180000,150000,220000,260000,300000],

borderColor:"#0d6efd",

backgroundColor:"rgba(13,110,253,.12)",

fill:true,

tension:.4

}]

},

options:{

responsive:true,

plugins:{

legend:{display:false}

}

}

});

}



const occupancyChart=document.getElementById("occupancyChart");

if(occupancyChart){

new Chart(occupancyChart,{

type:"doughnut",

data:{

labels:["Occupied","Available","Maintenance"],

datasets:[{

data:[76,18,6],

backgroundColor:[

"#198754",

"#0d6efd",

"#ffc107"

]

}]

},

options:{

plugins:{

legend:{

position:"bottom"

}

}

}

});

}