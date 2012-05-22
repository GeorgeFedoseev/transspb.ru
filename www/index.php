<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
    <head>
        <title>Где автобус? - Питер 2.0</title>
        <script src="js/jquery-1.7.2.min.js"></script>
        <script src="js/jgestures.js"></script>
      
        
        <script src="js/map.js"></script>
        <script src="js/stops.js"></script>
        <script src="js/options.js"></script>
        <script src="js/main.js"></script>
        <script src="js/jquery.cookie.js"></script>
        <script src="js/add2home.js"></script>
        <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key=AIzaSyCXmipZ6g4bsNTHoMhA_P_ANcl3FuRuZuk&sensor=true">
            </script>
            
         <script>
            var addToHomeConfig = {
            	animationIn: 'bubble',
            	animationOut: 'drop',
            	lifespan: 10000,			
            	expire: 0,
            	touchIcon:true/*,
             	message:'This is a custom message. Your device is an <strong>%device</strong>. The action icon is `%icon`.'*/
            };
        </script>
            
         <link rel="stylesheet" href="js/css/add2home.css"/>
          <link rel="stylesheet" href="ui.css"/>    
        
        
        <!--<meta name="viewport" content="width=device-width,user-scalable=no" />-->
		 <meta name="viewport" content="initial-scale=1.6; maximum-scale=1.0; width=device-width; "/>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black">
    </head>
    <body>
        <div id="logo"><img src="img/logo_256.png" /></div>
        <!--<div id="map_wrapper">
            <div id="map"></div>
        </div>-->
        
        
        <div id="options_button" style="display: none;"><img src="img/logo_mini_str.png" /></div>
        
    <div style="display: none;" id="options">
		 <h1>Предложения: <a  href= "mailto:george.fedoseev@me.com">george.fedoseev@me.com</a></h1>
            <h2>Скоро:</h2>				
					<li>Время прибытия автобуса к остановке</li>
        <a style="background: #554B3A; padding: 3px; margin: 5px;" href="javascript:initializeStops()">Показать ближайшие остановки</a>
     </div>
            
        
         <div id="map"></div>
		 
  <script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-31578935-1']);
  _gaq.push(['_setDomainName', 'гдеавтобус.рф']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>
         
        
    </body>
</html>