// =====================================================
// GWS WEATHER STATION
// Lectura desde ThingSpeak
// =====================================================

const CHANNEL = "2879152";

const API = "https://api.thingspeak.com/channels/"+CHANNEL+"/feeds.json?api_key=M1POOBTT61ND0UTV&results=20";

// Cantidad de datos a consultar
const RESULTS = 20;


// =====================================================
// URL THINGSPEAK
// =====================================================

const URL_THINGSPEAK =
    `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?api_key=${READ_API_KEY}&results=${RESULTS}`;


// =====================================================
// ELEMENTOS HTML
// =====================================================

const tempC = document.getElementById("tempC");
const humedad = document.getElementById("humedad");

const estadoAlarma =
    document.getElementById("estadoAlarma");

const alarma =
    document.getElementById("alarma");

const fecha =
    document.getElementById("fecha");

const estado =
    document.getElementById("estado");


// =====================================================
// LEER THINGSPEAK
// =====================================================

async function leerThingSpeak()
{
    try
    {
        const respuesta =
            await fetch(URL_THINGSPEAK);

        if (!respuesta.ok)
        {
            throw new Error(
                "Error consultando ThingSpeak"
            );
        }


        const datos =
            await respuesta.json();


        if (!datos.feeds || datos.feeds.length === 0)
        {
            console.log(
                "No hay datos en ThingSpeak"
            );

            return;
        }


        // Último registro
        const ultimo =
            datos.feeds[datos.feeds.length - 1];


        // =================================================
        // TEMPERATURA
        // Field 1
        // =================================================

        if (ultimo.field1 !== null)
        {
            tempC.innerHTML =
                `${parseFloat(ultimo.field1).toFixed(1)} °C`;
        }


        // =================================================
        // HUMEDAD
        // Field 2
        // =================================================

        if (ultimo.field2 !== null)
        {
            humedad.innerHTML =
                `${parseFloat(ultimo.field2).toFixed(0)} %`;
        }


        // =================================================
        // ALARMA
        // FIELD 7
        // =================================================

        const valorAlarma =
            parseInt(ultimo.field7);


        if (valorAlarma === 1)
        {
            activarAlarma();
        }
        else
        {
            desactivarAlarma();
        }


        // =================================================
        // FECHA
        // =================================================

        if (ultimo.created_at)
        {
            const fechaDato =
                new Date(ultimo.created_at);


            fecha.innerHTML =
                fechaDato.toLocaleString(
                    "es-AR"
                );
        }


        // =================================================
        // ESTADO CONEXIÓN
        // =================================================

        estado.innerHTML =
            "🟢 Conectado a ThingSpeak";


        estado.style.color =
            "green";


        console.log(
            "ThingSpeak actualizado"
        );

    }
    catch (error)
    {
        console.error(
            "Error:",
            error
        );


        estado.innerHTML =
            "🔴 Sin conexión";


        estado.style.color =
            "red";
    }
}


// =====================================================
// ALARMA ACTIVADA
// =====================================================

function activarAlarma()
{
    alarma.classList.add(
        "alarma-activa"
    );


    estadoAlarma.innerHTML =
        "🚨 ¡ALARMA ACTIVADA!";


    estadoAlarma.style.fontWeight =
        "bold";
}


// =====================================================
// ALARMA DESACTIVADA
// =====================================================

function desactivarAlarma()
{
    alarma.classList.remove(
        "alarma-activa"
    );


    estadoAlarma.innerHTML =
        "🟢 Alarma desactivada";


    estadoAlarma.style.fontWeight =
        "normal";
}


// =====================================================
// ACTUALIZAR
// =====================================================

// Primera lectura
leerThingSpeak();


// Actualizar cada 15 segundos
setInterval(
    leerThingSpeak,
    15000
);