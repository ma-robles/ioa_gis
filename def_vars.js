//var definition
function var_gen(url, layer, style, range,){
    var var_t=L.tileLayer.wms(url,{
        version:"1.3.0",
        //layers:'wrf_Dom1/T2C',
        layers: layer,
        format:'image/png',
        transparent:true,
        opacity:0.6,
        //styles:"default-scalar/temperatura",
        styles: style,
        //colorscalerange:"-15,50",
        colorscalerange: range,
        belowmincolor:"extend",
        abovemaxcolor:"extend",
        numcolorbands:64,
        //time:"2019-09-12T00:00:00.000Z",
        attribution:'IOA, Centro de Ciencias de la Atmósfera',
        uppercase:true,
        });
return var_t;
}

//var url="https://pronosticos.atmosfera.unam.mx:8443/thredds/wms/atlas/WRF/Dom1_2019-09-11.nc"
var url_owgis="http://pronosticos.unam.mx:8080/ncWMS_2015/wms"
var url_gea="https://pronosticos.atmosfera.unam.mx:8443/ncWMS_2015/wms"
var url="https://pronosticos.atmosfera.unam.mx:8443/thredds/wms/atlas/WRF/Dom1_2019-09-12.nc"

var temp=var_gen(url_gea,
    layer='wrf_Dom1/T2C',
    style="default-scalar/temperatura",
    range="-15,50",
);
var rh=var_gen(url_gea,
    layer='wrf_Dom1/RH',
    style="default-scalar/rh",
    range="50,100",
);
var rain_h=var_gen(url_gea,
    layer='wrf_Dom1/PRECH',
    style="default-scalar/precipitacionGrad",
    range="1,500",
);
var rain_3=var_gen(url_gea,
    layer='wrf_Dom1/PRECA3',
    style="default-scalar/precipitacionGrad",
    range="1,500",
);
var rain_6=var_gen(url_gea,
    layer='wrf_Dom1/PRECA6',
    style="default-scalar/precipitacionGrad",
    range="1,500",
);

var rain_t=var_gen(url_gea,
    layer='wrf_Dom1/PREC2',
    style="default-scalar/precipitacionGrad",
    range="1,500",
);

var cloud=var_gen(url_gea,
    layer='wrf_Dom1/QCLOUD2',
    style="default-scalar/seq-Greys-inv",
    range="0,100",
);

var qfx=var_gen(url_gea,
    layer='wrf_Dom1/QFX',
    style="default-scalar/seq-BlueHeat",
    range="-2.985E-5,5.369E-4",
);

var wind=var_gen(url_gea,
    layer='wrf_Dom1/Uat10:Vat10-mag',
    style="default-scalar/wind2",
    range="0,250",
);

