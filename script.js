const CHANNEL = "2879152";

const API = "https://api.thingspeak.com/channels/"+CHANNEL+"/feeds.json?api_key=M1POOBTT61ND0UTV&results=20";

let chart;

async function cargar(){

const respuesta = await fetch(API);

const datos = await respuesta.json();

const ultimo = datos.feeds[datos.feeds.length-1];

document.getElementById("tempC").innerHTML = Number(data.field1).toFixed(1) + " °C";

document.getElementById("humedad").innerHTML=ultimo.field2+" %";

document.getElementById("fecha").innerHTML=new Date(ultimo.created_at).toLocaleString();

const alarma=document.getElementById("alarma");

const estado=document.getElementById("estadoAlarma");

if(ultimo.field4=="1"){

estado.innerHTML="🚨 ACTIVADA";

alarma.style.background="#ff3b30";

alarma.style.color="white";

}else{

estado.innerHTML="🟢 NORMAL";

alarma.style.background="#4CAF50";

alarma.style.color="white";

}

const etiquetas=[];

const temperaturas=[];

datos.feeds.forEach(f=>{

etiquetas.push(f.created_at.substring(11,16));

temperaturas.push(f.field1);

});

if(chart){

chart.destroy();

}

chart=new Chart(document.getElementById("chartTemp"),{

type:"line",

data:{

labels:etiquetas,

datasets:[{

label:"Temperatura °C",

data:temperaturas,

fill:false,

borderWidth:3

}]

},

options:{

responsive:true

}

});

}

cargar();

setInterval(cargar,15000);
