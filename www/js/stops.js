var stops = null;

function initializeStops(){
    stops = new Stops();
     stops.init();
}

function Stops(){
    
   var sClass = this;
   var _itemsPP = 25;
   var _stops = null;
   var streetName = null;
   
    
    this.init = function(){
        sClass.showMsg("Идет определение местоположения...");
      sClass.getUserStreet(function(street){
            if(street){
                sClass.showMsg("Местоположение определено: "+street, 2000);
                streetName = street;
                sClass.getNearStops(0);
            
                    $(sClass).bind('stops_loaded', function(e, noerror){        
                        if(noerror){
                            this.showStops(sClass._stops);
                        }else{
                            // error
                        }
                    });
                    
                    $(sClass).bind('stopinfo_loaded', function(e, noerror, stop){        
                        if(noerror){
                         
                            this.showStopInfo(sClass._stops[stop]);
                        }else{
                            // error
                        }
                    });
            }else{
                sClass.showMsg("Ошибка определения местоположения", 2000);
            }
      });  
        
    }
    
    this.getNearStops = function(displayStart, callback){
        $.get("api.php?getstops="+streetName, function(data){
            if(data !== ''){                
                sClass._stops = JSON.parse(data);
                $(sClass).trigger('stops_loaded', [true]); 
            }else{
                $(sClass).trigger('stops_loaded', [false]);
            }
        });
    }
    
    this.showStops = function(data){   
       if(!$('#stops').length)
        $('body').append($("<div id = 'stops'>"));
       else{
            $('#stops').html('');
             $('#stops').hide();
       }
        
        
        var table = document.createElement('table');
         table.innerHTML = "<tr class = tablehead><td>Тип</td><td>Улицы</td><td>Маршруты</td></tr>";
         $.each(data, function(i, el){
           var a = document.createElement('a'); 
            var tr = document.createElement('tr');
             var type = document.createElement('td');
             var stopName = document.createElement('td');
             var stopRoutes = document.createElement('td');
             
                 type.innerHTML = el.type;
                  type.className = "stopType";
                 stopName.innerHTML = el.stopNearestStreets;
                  stopName.className = "stopName";
                 
                 stopRoutes.innerHTML = sClass.getRoutesList(data, i);
                 
                 
                 
             tr.appendChild(type);
             tr.appendChild(stopName);
             tr.appendChild(stopRoutes);  
              tr.className = "stop";    
              tr.setAttribute('stopId', i);   
              tr.onclick = function(){sClass.getStopInfo(tr.getAttribute("stopid"))};       
                        
                
                
            
            
            
            table.appendChild(tr);
         });
          document.getElementById('stops').appendChild(table);
    }
    
    this.closeStops = function(){
        $('#stops').hide();
    }
    
    this.getRoutesList = function(data, stop){
      var routesList = '';
      
        $.each(data[stop].routes, function(i, st){
            routesList += st.number;
             if(i < data[stop].routes.length - 1)
              routesList += ", ";      
        });
       return routesList;
    }
    
    this.getStopInfo = function(i){
        sClass.showMsg("Загрузка");
        $.get("api.php?getstopinfo="+sClass._stops[i].id, function(data){
           
             if(data !== 'null'){                
                sClass._stops[i].routes_data = JSON.parse(data);               
                $(sClass).trigger('stopinfo_loaded', [true, i]);
                sClass.hideMsg();
            }else{                
                $(sClass).trigger('stopinfo_loaded', [false]);
                sClass.showMsg("Нет данных", 2000);
            }
        });
    }
    
    this.showStopInfo = function(data){
       if(!$('#stopinfo').length) 
        $('body').append($("<div id = 'stopinfo'>"));
       else{
         $('#stopinfo').html('');
          $('#stopinfo').show();
       }
        
        var header = document.createElement('div');
         header.id = "stopHeader";
          var header_title = '';
           if(data.type == 'bus'){
            header_title += "Автобусная остановка";
             header.setAttribute('type', 'bus');
           }
           else if(data.type == 'tram'){
            header_title += "Трамвайная остановка";
             header.setAttribute('type', 'tram');
           }
           else if(data.type == 'trolley'){
            header_title += 'Троллейбусная остановка';
             header.setAttribute('type', 'trolley');
           }
           
           header_title += " "+data.stopNearestStreets;
            header.innerHTML = header_title;        
               
        var table = document.createElement('table');
           table.innerHTML = "<tr class = tablehead><td>Номер</td><td>Через</td></tr>";
         $.each(data.routes_data, function(i, el){
            var tr = document.createElement('tr');
             var number = document.createElement('td');
              number.className = "number";
               number.innerHTML = el.number;
             var arrivingIn = document.createElement('td');
              arrivingIn.className = "arrivingIn";
               arrivingIn.innerHTML = el.arrivingIn+" мин.";              
              
             tr.appendChild(number);
             tr.appendChild(arrivingIn); 
             
            table.appendChild(tr);
         });
        
        var closeBtn = document.createElement('a');
         closeBtn.innerHTML = "Закрыть";
          closeBtn.className = "closeStopInfo";
           closeBtn.setAttribute('href', "javascript:null");
           closeBtn.onclick = sClass.closeStopInfo;
          
          document.getElementById('stopinfo').appendChild(header);
          document.getElementById('stopinfo').appendChild(table);
          document.getElementById('stopinfo').appendChild(closeBtn);
        
    }
    
    this.closeStopInfo = function(){
        $('#stopinfo').hide();
    } 
    
    
    this.showMsg = function(text, time){
        if(!$('#showLoading').length) 
        $('body').append($("<div id = 'showLoading'>"+text+"</div>"));
       else{
         $('#showLoading').html(text);
          $('#showLoading').show();
       }
       
     
       if(time !== undefined)
        setTimeout(this.hideMsg, time);
       
    }
    
    this.hideMsg = function(){
        $('#showLoading').hide();
    }
    
    this.getUserStreet = function(callback){
        var geocoder = new google.maps.Geocoder();
         detectLocation(true, function(){
            var latlng = new google.maps.LatLng(_userLonLat.lat,_userLonLat.lon);
             geocoder.geocode({'latLng':latlng}, function(results, status){
                if(status == google.maps.GeocoderStatus.OK){
                  //  $('html').html(print_r(results));
                    callback(results[0].address_components[1].long_name);
                }else{
                    log("ERROR GEOCODER CANT GET LOCATION");
                     callback(false);
                }
             });
         });
         
    }
    
   
    
} 

