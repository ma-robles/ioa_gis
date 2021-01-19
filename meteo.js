
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

    mbUrl = "https://mt1.google.com/vt/lyrs=s&hl=pl&&x={x}&y={y}&z={z}";

    var back_layer= L.tileLayer(mbUrl, {id: 'back', attribution: mbAttr});
    var tod = new Date();
    var nxt = new Date(tod.getFullYear(), tod.getMonth(), tod.getDate()+4);
    var startDate = tod.toISOString().substr(0, 10).split('-').map(x => x.substr(0, 4)).join('-');
    var endDate = nxt.toISOString().substr(0, 10).split('-').map(x => x.substr(0, 4)).join('-');
    var interv = startDate + "/" + endDate;

    var map = L.map('map', {
         center: [19.73, -100.99],
         zoom: 5,
         //layers: [back_layer, temp, paises, estados]
         layers: [back_layer, estados],
         fullscreenControl: true,
         timeDimension: true,
         timeDimensionControl:true,
         timeDimensionOptions:{
             timeInterval: interv,
             period: "PT1H",
             currentTime: tod
         },
         timeDimensionControlOptions: {
           position: "topright",
           autoPlay: false,
           loopButton: true,
           timeSteps: 1,
           playReverseButton: true,
           limitSliders: true,
           playerOptions: {
             buffer: 20,
             transitionTime: 500,
             loop: true,
          }
        }
         });

    var baseMaps = [
      {
        groupName: 'Capas Base',
        expanded: true,
        layers: {

          'OpenStreetMap': back_layer
        },
        visible: true,
        removable: true,
      }
    ]
    var overlays = [

      {
        groupName: 'Temperatura',
        expanded: false,
        layers: {
          'Temperatura a 2 metros': temp
        }
      },
      {
        groupName: 'Precipitación',
        expanded: false,
        layers: {
          'Precipitación Horaria': rain_h,
          'Precipitación Acumulada 3hrs': rain_3,
          'Precipitación Acumulada 6hrs': rain_6,
          'Precipitación Total': rain_t
        }
      },
      {
        groupName: 'Nubosidad',
        expanded: false,
        layers: {
          'Nubosidad': cloud
        }
      },

      {
        groupName: 'Humedad Relativa',
        expanded: false,
        layers: {
          'Humedad Relativa': rh
        }
      },

      {
        groupName: 'Viento',
        expanded: false,
        layers: {
          'Viento a 10 metros': wind
        }
      },
      {
        groupName: 'Capas Opcionales',
        expanded: false,
        layers: {
          'Estados': estados
        },
        visible: true
      },
    ]

    var options = {
		container_width 	: "300px",
		container_maxHeight : "550px",
		group_maxHeight     : "100px",
		exclusive       	: false,
    position          : "topleft"
	};

    var control = L.Control.styledLayerControl(baseMaps, overlays, options);
  	map.addControl(control);


    /* wind
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

*/
//time


     //Insertando una leyenda en el mapa



     function var_leg(url,layer,palette){
       var legend = L.control({position: 'bottomright'});
       legend.onAdd = function (map) {
         var src = url + "?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&LAYER"+layer+"&COLORBARONLY=true&PALETTE="+palette+"&WIDTH=547&HEIGHT=15&NUMCOLORBANDS=250&VERTICAL=False"
         var div = L.DomUtil.create('div', 'info-legend');
         div.innerHTML +='<img src ="'+ src + '"alt="legend">';
         return div;
       };
       return legend;

     }

    var legendHR = var_leg(url_gea,"wrf_Dom1/RH", "rh");
    var legendTemp = var_leg(url_gea,"wrf_Dom1/T2", "temperatura");
    var legendPrecH = var_leg(url_gea, "wrf_Dom1/PRECH", "precipitacionGrad")
    var legendPrecAc3 = var_leg(url_gea, "wrf_Dom1/PRECA3", "precipitacionGrad")
    var legendPrecAc6 = var_leg(url_gea, "wrf_Dom1/PRECA6", "precipitacionGrad");
    var legendPrecTot = var_leg(url_gea, "wrf_Dom1/PREC2", "precipitacionGrad");
    var legendNub = var_leg(url_gea, "wrf_Dom1/QCLOUD2", "precipitacionGrad");
    var legendVi = var_leg(url_gea, "wrf_Dom1/Uat10:Vat10-mag", "precipitacionGra");



    function time_layer(layer,name,units){
      var timeLayer = L.timeDimension.layer.wms(layer, {
        updateTimeDimension: true,
        name : name,
        units: units,
      });
      return timeLayer;
    }

    var timeLayerTemp = time_layer(temp,"Temperatura a 2 metros", "°C");
    var timeLayerHR = time_layer(rh,"Humedad Relativa", "%");
    var timeLayerPrecH = time_layer(rain_h,"Precipitación Horaria", "mm");
    var timeLayerPrecAc3 = time_layer(rain_3, "Precipitación Acumulada 3hrs", "mm");
    var timeLayerPrecAc6 = time_layer(rain_6, "Precipitación Acumulada 6hrs", "mm");
    var timeLayerPrecTot = time_layer(rain_t, "Precipitación Total", "mm");
    var timeLayerNub = time_layer(cloud, "Nubosidad", "");
    var timeLayerVi = time_layer(wind, "Viento a 10 metros", "km/h");

    map.on('overlayadd', function(eventLayer) {
    if (eventLayer.name == 'Humedad Relativa') {
      legendHR.addTo(this);
      timeLayerHR.addTo(map);
      infoHR.addTo(this);
    }
    else if (eventLayer.name == 'Temperatura a 2 metros') {
      legendTemp.addTo(this);
      timeLayerTemp.addTo(map);
      infoTemp.addTo(this);
    }

    else if (eventLayer.name == 'Precipitación Horaria') {
      legendPrecH.addTo(this);
      timeLayerPrecH.addTo(map);
      infoPrecH.addTo(this);
    }
    else if (eventLayer.name == 'Precipitación Acumulada 3hrs') {
      legendPrecAc3.addTo(this);
      timeLayerPrecAc3.addTo(map);
      infoPrecAc3.addTo(this);
    }
    else if (eventLayer.name == 'Precipitación Acumulada 6hrs') {
      legendPrecAc6.addTo(this);
      timeLayerPrecAc6.addTo(map);
      infoPrecAc6.addTo(this);
    }
    else if (eventLayer.name == 'Precipitación Total') {
      legendPrecTot.addTo(this);
      timeLayerPrecTot.addTo(map);
      infoPrecTot.addTo(this);
    }

    else if (eventLayer.name == 'Nubosidad') {
      legendNub.addTo(this);
      timeLayerNub.addTo(map);
      infoNub.addTo(this);
    }

    else if (eventLayer.name == 'Viento a 10 metros') {
      legendVi.addTo(this);
      timeLayerVi.addTo(map);
      infoVi.addTo(this);
    }

    });

    map.on('overlayremove', function(eventLayer) {
    if (eventLayer.name == 'Humedad Relativa') {
        map.removeControl(legendHR);
        map.removeControl(timeLayerHR);
        map.removeControl(infoHR);
    } else if (eventLayer.name == 'Temperatura a 2 metros') {
        map.removeControl(legendTemp);
        map.removeControl(timeLayerTemp);
        map.removeControl(infoTemp);
    }
    else if (eventLayer.name == 'Precipitación Horaria') {
      map.removeControl(legendPrecH);
      map.removeControl(timeLayerPrecH);
      map.removeControl(infoPrecH);
    }
    else if (eventLayer.name == 'Precipitación Acumulada 3hrs') {
      map.removeControl(legendPrecAc3);
      map.removeControl(timeLayerPrecAc3);
      map.removeControl(infoPrecAc3);
    }
    else if (eventLayer.name == 'Precipitación Acumulada 6hrs') {
      map.removeControl(legendPrecAc6);
      map.removeControl(timeLayerPrecAc6);
      map.removeControl(infoPrecAc6);
    }
    else if (eventLayer.name == 'Precipitación Total') {
      map.removeControl(legendPrecTot);
      map.removeControl(timeLayerPrecTot);
      map.removeControl(infoPrecTot);
    }

    else if (eventLayer.name == 'Nubosidad') {
      map.removeControl(legendNub);
      map.removeControl(timeLayerNub);
      map.removeControl(infoNub);
    }

    else if (eventLayer.name == 'Viento a 10 metros') {
      map.removeControl(legendVi);
      map.removeControl(timeLayerVi);
      map.removeControl(infoVi);
    }
    });
    function var_leg(url,layer,palette){
      var legend = L.control({position: 'bottomright'});
      legend.onAdd = function (map) {
        var src = url + "?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&LAYER"+layer+"&COLORBARONLY=true&PALETTE="+palette+"&WIDTH=547&HEIGHT=15&NUMCOLORBANDS=250&VERTICAL=False"
        var div = L.DomUtil.create('div', 'info-legend');
        div.innerHTML +='<img src ="'+ src + '"alt="legend">';
        return div;
      };
      return legend;
    }

    function setup_info(legend){
      var info = L.control({position: 'topright'});
      info.onAdd = function(map){
        var div = L.DomUtil.create("div", "info");
        div.innerHTML = '<h2>' + legend + '</h2>';
        return div;
      };
      return info;
    }

    var infoHR = setup_info("Humedad Relativa");
    var infoTemp = setup_info("Temperatura");
    var infoPrecH = setup_info("Precipitación Horaria");
    var infoPrecAc3 = setup_info("Precipitación Acumulada 3hrs");
    var infoPrecAc6 = setup_info("Precipitación Acumulada 6hrs");
        var infoPrecTot = setup_info("Precipitación Total");
    var infoNub =  setup_info("Nubosidad");
    var infoVi = setup_info("Viento a 10 metros");
