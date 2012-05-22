/* DEFAULT GLOBALS */
 
  var mapdiv;
    var m = new mapper();

/*var onorientationchange = function()    {
    alert('change orientation')
     var orient = Math.abs(window.orientation) === 90 ? 'landscape' : 'portrait';
      if(orient == 'landscape'){
       hideMap();       
      }else{
         if(_state.page == stMAP)
          showMap();
      }
}
window.onload = function() {
    window.onorientationchange = window.onorientationchange
}*/

$(document).ready(function(){
  mapdiv = document.getElementById('map');
  
   m.hideMap(true, null, 0);
  
	setTimeout(function(){
         if(m._state.mapLoaded == false)
    	   m.showMap();
	}, 5000);
    
    m.detectLocation(function(){
        m.initialize();    
    });
    
    
  $(window).resize(function(){
        if((m._state.page == m._state.types.stMAP) && (m.MAP !== null)){        
             google.maps.event.trigger(m.MAP, "resize");
        }        
  });

});



function mapper(){
    
  var mp = this;
    
  mp._zoom = 10, mp._lat = 59.95, mp._lon = 30.35;  
  
  mp._disableUI = true;
  mp._tileSize = 256;
  mp._maxZoom = 18;
  
  mp._updateLayerTime = 8000;
  mp._detectLocationTime = 20000;
  
  mp._userLonLat = {};
  mp._userLocMarker = null;
  mp._userBrowserType = "desktop";
  
  mp._canUpdateLayer = false;  
  mp._tilesUrls = [];
  
  mp._layers = {
        "bus": "vehicle_bus",
        "tram": "vehicle_tram",
        "trolley": "vehicle_trolley"
    };
  
  mp._img = {
            swtch: {
                map: "img/map.png",
                options: "img/options.png",
                logotext: "img/logo_mini_str.png"
            }
        };
        
   mp._state = {
            page: 0, mapLoaded: false, logoVisible: true, logoCentered: true,
            types: {
                stLOGO: 0,
                stMap: 1,
                stOPTIONS: 2,
                stINFO: 3
            }
        };       
   

    mp.detectBrowser = function () {
          var useragent = navigator.userAgent;
          var mapdiv = document.getElementById("map");
        
          /* HIDE URL BAR IN MOBILE SAFARI*/
           if (navigator.userAgent.match(/(iPhone|iPod)/i)){                   
                  setTimeout(function(){                    
                    window.scrollTo(0, 1);
                  }, 0);               
           }
       
       if(navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/i))
        mp._userBrowserType = "mobile";
       else
        mo._userBrowserType = "desktop";      
      
    }
    
    mp.detectLocation = function (callback){        
        if (navigator.geolocation) {
            
        	  navigator.geolocation.getCurrentPosition(function(position) {                        
                 mp._userLonLat.lon = position.coords.longitude;
                 mp._userLonLat.lat = position.coords.latitude;
                                
                    if(callback)
                     callback();
              });
              
        }else{
            log("Geolocation is not supported.");
        }
    }
    
    
    mp.setCenterToUserLocation = function(zoom){
        var z = (zoom !== undefined)?zoom:13;
        var user_location = new google.maps.LatLng(mp._userLonLat.lat, mp._userLonLat.lon);       
         if(mp.MAP !== null){
           
            mp.MAP.panTo(user_location);
            mp.MAP.setZoom(z);
         }else{
            log("Failed to center the map because there is no MAP object");
         }      
    }
    
    mp.setMarker = function(lon, lat){        
        var user_location = new google.maps.LatLng(lat, lon);                                                                       
        if(mp._userLocMarker !== null){
            mp._userLocMarker.setPosition(user_location);
       	}else{
        	mp._userLocMarker =  new google.maps.Marker({position: user_location, map: mp.MAP});                            
       	}
    }
    
    mp.setMarkerToUserLocation = function(goToMarker){
        mp.detectLocation(function(){
            mp.setMarker(mp._userLonLat.lon, mp._userLonLat.lat);
             if(goToMarker == true)
              mp.setCenterToUserLocation(15);
        });
    }
    
    
    
    
    
    mp.initialize = function(){       
       
        	mp.mapOptions = {
                center: new google.maps.LatLng(mp._userLonLat.lat, mp._userLonLat.lon),
                zoom: mp._zoom,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
               // disableDefaultUI: mp._disableUI,
                zoomControl: true,
                zoomControlOptions: {
                  style: google.maps.ZoomControlStyle.LARGE
                },
                maxZoom: mp._maxZoom,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.LARGE,
                    position: google.maps.ControlPosition.TOP_RIGHT
                },
                streetViewControl: false,
                panControl: false,
                mapTypeControl: false                
            };        
        
            
            mp.TransportLayerOptions = {
                getTileUrl: mp.TransportLayerGetTileURL,
                isPng: true,
                tileSize: new google.maps.Size(mp._tileSize, mp._tileSize)                
            };
            
            mp.MAP = new google.maps.Map(mapdiv, mp.mapOptions);        
        
             mp.setMarkerToUserLocation(true);
             setInterval(function(){mp.setMarkerToUserLocation(false);}, mp._detectLocationTime);   
             
            mp.TransportLayer = new google.maps.ImageMapType(mp.TransportLayerOptions);
        
        
        
        /* Замена функции getTile из библиотеки googlemaps */
             mp.TransportLayer.baseGetTile = mp.TransportLayer.getTile;             
              mp.TransportLayer.getTile = function(tileCoord, zoom, ownerDocument){
                 var node = mp.TransportLayer.baseGetTile(tileCoord, zoom, ownerDocument);
                  $('img', node).one('load', function(){
                     var index = $.inArray(this.__src__, mp._tilesUrls);
                      mp._tilesUrls.splice(index, 1);
                       if(mp._tilesUrls.length === 0)
                        $(mp.TransportLayer).trigger('layer_ready')
                  });
                return node;
              }
        /* Замена getTile */        
        
        mp.MAP.overlayMapTypes.push(mp.TransportLayer);    
    	
        mp.updateLayer = function(){
              if(mp._canUpdateLayer){                               
                mp.MAP.overlayMapTypes.push(mp.TransportLayer);  
                  mp._canUpdateLayer = false;
                                        
                    $(mp.TransportLayer).bind('layer_ready', function remove_first(){            
                      if( mp.MAP.overlayMapTypes.length > 1)          
                        mp.MAP.overlayMapTypes.removeAt(0);       
                       mp._canUpdateLayer = true;
                    });
                      
              }else{
                log("Layer is not ready to update.");
              }
        }   
    
        google.maps.event.addListener(mp.MAP, 'tilesloaded', function(){
            log('All tiles are loaded, map is READY.');                        
             mp._state.mapLoaded = true;
              mp.showMap();
               mp._canUpdateLayer = true;
               
              if(mp._state.page == mp._state.types.stMAP)
        	     google.maps.event.trigger(mp.MAP, 'resize'); 
        
        });  
    
    }
    
    mp.showMap = function(callback){   
          if(mp._state.page !== mp._state.types.stMAP){
            hideLogo();
               
        	  setTimeout(function(){
        		$('#options_button').show();
        		  $("#map").css({position: 'absolute'});  
        		  $("#map").animate({opacity: 1, top: 0}, 'slow', function(){
        			$("#map").css({position: 'relative'});  
        			  google.maps.event.trigger(mp.MAP, "resize");
        			 if(callback)
        			  callback();
        		  });
        		  
        		  $('#options_button img').attr('src', mp._img.swtch.logotext);
                 mp._state.page = mp._state.types.stMAP;
                  log("map is ON");
                 
        	  }, 50);
              
                
           }     
             
     }
        
     mp.hideMap = function(ignore, callback, time){
           if((mp._state.page == mp._state.types.stMAP) || ignore == true){
            $("#map").css({position: 'absolute', top: 0});
                 $("#map").animate({opacity: 0, top: "900px"}, time, function(){
                   // $('#map').hide();
                   $("#map").css({position: 'relative'});
                    showLogo();
                     if(callback)
                      callback();
                });
                mp._state.page = mp._state.types.stLOGO;
                 log("map is OFF");
           } 
           
     }
    
    mp.TransportLayerGetTileURL = function(tile, zoom){
        var proj = mp.MAP.getProjection();
        var Zfactor = Math.pow(2, zoom);
        var top = proj.fromPointToLatLng( 
                    new google.maps.Point(tile.x*mp._tileSize/Zfactor, tile.y*mp._tileSize/Zfactor));
        var bot = proj.fromPointToLatLng(
                    new google.maps.Point((tile.x + 1)*mp._tileSize/Zfactor, (tile.y +1)*mp._tileSize/Zfactor));
        var blng = bot.lng();
        var blat = bot.lat();
        var tlng = top.lng();
        var tlat = top.lat();    
    
        var topll = {lon:tlng, lat:tlat};
        var botll = {lon: blng, lat: blat};
        
        var topsm = mp.LonLatToSMercator(topll);
        var botsm = mp.LonLatToSMercator(botll);
        
        var deltax = 0;
        var deltay = 0;
        var bbox = (topsm.x+deltax)+","+(botsm.y+deltay)+","
                    +(botsm.x+deltax)+","+(topsm.y+deltay);
                    
        var url = 
         "transport_lite.php?"
            +"BBOX="+bbox
            +"&WIDTH=256&HEIGHT=256&TRANSPARENT=TRUE"
            +"&FORMAT=image%2Fpng"
            +"&VERSION=1.1.1"
            +"&REQUEST=GetMap"
            +"&SRS=EPSG%3A900913"
            +"&_OLSALT="+Math.random()
            +"&SERVICE=WMS"
            +"&MAP=vehicle_typed.map"
            +"&LAYERS=vehicle_bus,vehicle_tram,vehicle_trolley";
            mp._tilesUrls.push(url);
         return url;
    }
    
    mp.LonLatToSMercator = function(c){
         var x=c.lon*20037508.34/180;
         var y= Math.log(Math.tan((90+c.lat)*Math.PI/360))/(Math.PI/180);
         y= y*20037508.34/180;
          return {"x": x, "y": y};
    }

}

