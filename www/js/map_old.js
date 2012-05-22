var W, H;
var lon = 30.34565464, lat = 59.945654646, zoom = 9;
var def_step = 10; /* step меняется в зав от zoom step = def_step/zoom */

var pos = {};
var touch = false;
var last_move = 0;


$('img').live('selectstart dragstart', function(e){e.preventDefault();return false;}); 

$(document).ready(function(){
    W = $(window).width();
     H = $(window).height();
        map_update();
        
        setInterval(function(e){
    
           if(W !== $(window).width()){
              W = $(window).width();
               setTimeout(map_update, 500);
           }
           
            if(H !== $(window).height()){
              H = $(window).height();
              
               
           }
            
        }, 1000);
   
        $('#map').bind('taptwo', function(e){
            console.log('zooming out');
            zoom_change('out');
            
        });
        $('#map').doubletap(function(e){
            zoom_change('in');
            console.log('zooming in');
        });
        
        $('#map').bind('swipeleft', function(){
            go('right');
            console.log('right');
        });
        
        $('#map').bind('swipedown', function(){
            go('up');
            console.log('down');
        });
        
        $('#map').bind('swipeup', function(){
            go('down');
            console.log('down');
        });
        
        $('#map').bind('swiperight', function(){
            go('left');
            console.log('right');
        });
        
        
        
        
        
        $('#map').bind('swipeleftup', function(){
            go('rightdown');
            console.log('leftup');
        });
        
        
        $('#map').bind('swiperightup', function(){
            go('leftdown');
            console.log('rightup');
        });
        
        
        
        $('#map').bind('swiperightdown', function(){
            go('leftup');
            console.log('rightdown');
        });
        
        
        
        $('#map').bind('swipeleftdown', function(){
            go('rightup');
            console.log('leftdown');
        });
     
           
      
});

document.ontouchmove = function(event){
    event.preventDefault();
}



function tmstart(e){
   touch = true;
   pos.startx = e.pageX;
   pos.starty = e.pageY;

   $('body').append($('<span style = "position:absolute;left:'+  pos.startx+';top:'+ pos.starty+';background: red;width: 15px;height:15px">'));
}

function tmmove(e){
    pos.currentx = e.pageX;
    pos.currenty = e.pageY;
}

function tmend(e){
    touch = false;
    pos.endx = e.pageX;
    pos.endy = e.pageY;
}

function tcancel(e){
    touch = false;
}











function map_update(){
    load_data('lon='+lon+'&lat='+lat+'&zoom='+zoom+"&w="+W+"&h="+H, function(data){
            display_map(data);
    });
}

function create_map_url(lon, lat, zoom, w, h, prov){
    
    //correct sizes
    
    if(w > 630)
      w = 630;
    if(h > 630)
      h = 630;
    
    
    
    switch(prov){
        case 'osm':
            return "http://ojw.dev.openstreetmap.org/StaticMap/?lat="+lat+"&lon="+lon+"&z="+zoom+"&w="+w+"&h="+h+"&show=1";
         break;
        case 'osm2':
            return "http://pafciu17.dev.openstreetmap.org/?module=map&center="+lon+","+lat+"&zoom="+zoom+"&type=mapnik&width="+w+"&height="+h;
         break;
        case 'google':
            return "http://maps.google.com/staticmap?center="+lat+","+lon+"&zoom="+zoom+"&size="+h+"x"+w+"&maptype=mobile&sensor=false";
         break;
    }
    
  
           
}

function display_map(data){
   if(data && data.map_data && data.layer_data){  
    
        if($('#map').length){
           // check inner containers 
            if(!$('#map #streets').length)
             $('#map').append($('<div id = streets style = "position:absolute; z-index: -1">'));
            if(!$('#map #layer').length)
             $('#map').append($('<div id = layer > style = "position:absolute"'));
           
           //insert images  
           
           
          var map_url = create_map_url(lon, lat, zoom, W, H, 'osm2');
           
             if($('#map #streets img').length)
              $('#map #streets img').attr('src',  "data:image/png;base64,"+data.map_data).attr('width', W);
             else
              $('#map #streets').append($('<img width = '+W+' src = "'+ "data:image/png;base64,"+data.map_data+'" />'));
              
             if($('#map #layer img').length)
              $('#map #layer img').attr('src', "data:image/png;base64,"+data.layer_data).attr('width', W);
             else
              $('#map #layer').append($('<img width = '+W+'  src = "data:image/png;base64,'+data.layer_data+'" />'));
        }else{
            // no map container
        }
   }else{
     // no data
   }
}

function go(direction){
    date = new Date();
    
    if(date.getTime() - last_move < 1000*1)
     return false;
    
    last_move = date.getTime();
    
    var step = def_step/(Math.pow(zoom, 2.6));
    switch(direction){
        case 'left':
           lon -= step;
         break;
                case 'leftup':
                    lon -= step;
                    lat += step;
                 break;
                case 'leftdown':
                    lon -= step;
                    lat -= step;
                 break;
        case 'right':
           lon += step;
                case 'rightup':
                   lon += step;
                   lat += step;
                 break;
                case 'rightdown':
                   lon += step;
                   lat -= step;
                 break;
         break;
        case 'up':
           lat += step;
         break;
        case 'down':
           lat -= step;
         break;
    }
    
    map_update();
}
function zoom_change(direction){
    switch(direction){
        case 'in':
          if(zoom < 15)
           zoom++;
         break;
        case 'out':
         if(zoom > 1)
           zoom--;
         break;
         
    }
    
    map_update();
} 

function load_data(params, callback){
    $.get("transport.php?"+params, function(data){
        if(callback)
         callback(JSON.parse(data));
    });
}