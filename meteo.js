            //var cities = L.layerGroup();

        //L.marker([39.61, -105.02]).bindPopup('This is Littleton, CO.').addTo(cities),
        //L.marker([39.74, -104.99]).bindPopup('This is Denver, CO.').addTo(cities),
        //L.marker([39.73, -104.8]).bindPopup('This is Aurora, CO.').addTo(cities),
        //L.marker([39.77, -105.23]).bindPopup('This is Golden, CO.').addTo(cities);
var paises=L.tileLayer.wms('https://pronosticos.atmosfera.unam.mx:8443/geoservercenapred/wms',{
    layers:"cen:paises",
    transparent:true,
    format:'image/png',
    });
var estados=L.tileLayer.wms('https://pronosticos.atmosfera.unam.mx:8443/geoservercenapred/wms',{
    layers:"cen:estados",
    transparent:true,
    format:'image/png',
    });

    var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ',
    //mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
    mbUrl = "https://mt1.google.com/vt/lyrs=s&hl=pl&&x={x}&y={y}&z={z}";

    var back_layer= L.tileLayer(mbUrl, {id: 'back', attribution: mbAttr});

    var map = L.map('map', {
        center: [19.73, -100.99],
        zoom: 5,
        //layers: [back_layer, temp, paises, estados]
        layers: [back_layer, estados],
        timeDimension: true,
        timeDimensionControl:true,
        timeDimensionOptions:{
            //
        },
        });

temp2.getLayer('wrf_Dom1/T2C').addTo(map);
//temp2.addTo(map);
    var base_layers = {
        "Temperatura a 2 m":temp2,
        "RH":rh,
        "Precipitación Horaria":rain_h,
        "Precipitación Acumulada 3Hrs":rain_3,
        "Precipitación Acumulada 6Hrs":rain_6,
        "Precipitación Total":rain_t,
        "Nubosidad":cloud,
        "Viento": wind,
        };
    var overlay_layers = {
        //"paises": paises,
        "Estados": estados,
    };


    //only controls baselayers
    layer_control=L.control.layers(base_layers, overlay_layers);
    layer_control.addTo(map);
    //wind
        //$.getJSON("https://pronosticos.atmosfera.unam.mx/wind.json", function(data) {
        $.getJSON("scripts/wind.json", function(data) {
          var velocityLayer = L.velocityLayer({
            displayValues: true,
            displayOptions: {
              velocityType: "GBR Wind",
              displayPosition: "bottomleft",
              displayEmptyString: "No wind data"
              },
            data: data,
            maxVelocity: 10
            });

            layer_control.addOverlay(velocityLayer, "WRF Wind ");
          });

//time
    var testTimeLayer=L.timeDimension.layer.wms(temp,{updateTimeDimension:true,});
    testTimeLayer.addTo(map);

    // Insertando una leyenda en el mapa
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML +=
    '<img alt="legend" src="http://132.248.8.238:8080/ncWMS_2015/wms?REQUEST=GetLegendGraphic&LAYER=wrf_Dom1/RH&COLORBARONLY=true&PALETTE=rh&WIDTH=547&HEIGHT=15&NUMCOLORBANDS=250&VERTICAL=False"  width="547" height="15" />';
    };
    //legend.addTo(map);

//map.on('overlayadd', onOverlayAdd);
map.on('baselayerchange', onOverlayAdd);
var check=0;

function onOverlayAdd(e){
    console.log(e);
//time
    testTimeLayer.remove();
    //    map.removeLayer(base_layers[e["name"]]);
    testTimeLayer=L.timeDimension.layer.wms(base_layers[e["name"]],{updateTimeDimension:true,});
    testTimeLayer.addTo(map);
   }

map.on('layeradd',onadd);
function onadd(e){
    console.log('add...',e);
}
