<?

require_once("Google/Maps.php");

$imageW = 200;
$imageH = 300;

if($_GET['w'] != '' && (int)$_GET['w'] != 0)
 $imageW = (int)$_GET['w'];
if($_GET['h'] != '' && (int)$_GET['w'] != 0)
 $imageH = (int)$_GET['h'];
 
 define("IMGLIM", 400);
if($imageW > IMGLIM)
 $imageW = IMGLIM;
if($imageH > IMGLIM)
 $imageH = IMGLIM;



 
$ch = null;
/*
    TRANSPARENT=TRUE - прозрачная или серая
    FORMAT=image%2Fpng
    LAYERS=vehicle_bus - может быть еще vehicle_tram и vehicle_trolley
    MAP=vehicle_typed.map - ?
    SERVICE=WMS - ?
    VERSION=1.1.1
    REQUEST=GetMap 
    STYLES=
    SRS=EPSG%3A900913
    _OLSALT=0.11651005083695054
    BBOX=3363226.7980928,8379037.9459335,3384697.65359,8386640.0670186 - координаты(?) определяющие прямоугольник карты
    WIDTH=150 
    HEIGHT=777 - размеры картинки


    Если кто подскажет неизвестные параметры и в каком формате координаты - напишите в комментариях
    Для запроса надо передать КУКУ "portal.baseLayer" => "%u041A%u0430%u0440%u0442%u0430%20%u0420%u043E%u0441%u0441%u0438%u0438%20%28OSM%29" иначе не пройдет
    На выходе картинка с транспортом без карты

*/


$lon = $_GET['lon'];
$lat = $_GET['lat'];
$zoom = $_GET['zoom'];

if($lon !== '' && $lat !== '' && $zoom !== ''){
    # return map
    
    
    $map = Google_Maps::create('static');

    $map->setSize($imageW."x".$imageH);
    $map->setCenter(new Google_Maps_Coordinate($lat, $lon));
    $map->setZoom($zoom);
    $map->setKey('AIzaSyAJMFmPWOka95hILmwUE5NRDWLg_vkoyGo');
    $map_bounds = $map->getBounds($zoom);
   // print_r($map_bounds);
    

    $topLeft = LonLatToSMercator($map_bounds->min_lon, $map_bounds->min_lat);
    $bottomRight = LonLatToSMercator($map_bounds->max_lon, $map_bounds->max_lat);
    
    $SmBounds = (object)array("lonLeft" => $topLeft->x, "lonRight" => $bottomRight->x, "latTop" => $topLeft->y, "latBottom" => $bottomRight->y);
    
    print_r($SmBounds);
   // echo "<br>WIDTH: $imageW";
   // echo "<br>HEIGHT: $imageH";
    $query = "BBOX=$SmBounds->lonLeft,$SmBounds->latTop,$SmBounds->lonRight,$SmBounds->latBottom"
                ."&WIDTH=$imageW&HEIGHT=$imageH&TRANSPARENT=TRUE"
                ."&FORMAT=image%2Fpng"
                ."&VERSION=1.1.1"
                ."&REQUEST=GetMap"
                ."&SRS=EPSG%3A900913"
                ."&SERVICE=WMS"
                ."&MAP=vehicle_typed.map"
                ."&LAYERS=vehicle_bus,vehicle_tram,vehicle_trolley";
                
    //echo $query."<br>";       
        
      //  echo  "http://transport.orgp.spb.ru/cgi-bin/mapserv?$query";
     // echo $map->toUrl();
   $map_url = "http://maps.google.com/staticmap?center=$lat,$lon&zoom=$zoom&size=".$imageW."x".$imageH."&maptype=mobile&sensor=false";
     
     //echo   $google_map = _get($map_url);
       // echo $google_map;
        //$osm_map = _get("http://pafciu17.dev.openstreetmap.org/?module=map&center=$lon,$lat&zoom=$zoom&width=$imageW&height=$imageH&scaleBarPos=leftDownCorner&scaleBarUnit=km&logoPos=rightUpCorner");
        $osm2_map = _get("http://ojw.dev.openstreetmap.org/StaticMap/?lat=$lat&lon=$lon&z=$zoom&w=$imageW&h=$imageH&show=1");
        //$yandex_map = _get("http://static-maps.yandex.ru/1.x/?ll=$lat,$lon&z=$zoom&size=$imageW,$imageH&l=map&key=ANpUFEkBAAAAf7jmJwMAHGZHrcKNDsbEqEVjEUtCmufxQMwAAAAAAAAAAAAvVrubVT4btztbduoIgTLAeFILaQ==");
        $trans_layer = _get("http://transport.orgp.spb.ru/cgi-bin/mapserv?$query");
       // echo $trans_layer;
       //echo $yandex_map;
      // echo "http://static-maps.yandex.ru/1.x/?ll=$lat,$lon&z=$zoom&size=$imageW,$imageH&l=map&key=AOWBoU8BAAAA1ZrIHQIAa_Dd2myj7LJKOocQ1nvXjKYQYBkAAAAAAAAAAABfFtgXadwoa3VYMMQqWTbRpN7Zgw==";
    // echo json_encode(array("map_data" => base64_encode($osm2_map), "layer_data" => base64_encode($trans_layer)));
     
 //echo "<img style = 'position: absolute' src = '$map_url'>";
    //echo "<img style = 'position: absolute' src = 'data:image/png;base64,".base64_encode($trans_layer)."'>";
    //  header('Content-Type: image/jpeg');
      // echo $trans_layer;
       //echo $osm2_map;  

  
}else{
    # nothing
}

  


function _get($url){
    global $ch;
    $ch = curl_init();
   //GET запрос указывается в строке URL
  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_HEADER, false);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 30);
  curl_setopt($ch, CURLOPT_HEADERFUNCTION, 'read_header');
  curl_setopt($ch, CURLOPT_REFERER, 'http://transport.orgp.spb.ru/Portal/transport/main');
  curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.168 Safari/535.19');
  $data = curl_exec($ch);
  curl_close($ch);

   return $data;
}

function read_header($ch, $string)
{

    global $ch; 
    
    $cookiearr = array("portal.baseLayer" => "%u041A%u0430%u0440%u0442%u0430%20%u0420%u043E%u0441%u0441%u0438%u0438%20%28OSM%29");
    $location = "transport.orgp.spb.ru/";
     
    
    $length = strlen($string);
    if(!strncmp($string, "Location:", 9))
    {
      $location = trim(substr($string, 9, -1));
    }
    if(!strncmp($string, "Set-Cookie:", 11))
    {
      $cookiestr = trim(substr($string, 11, -1));
      $cookie = explode(';', $cookiestr);
      $cookie = explode('=', $cookie[0]);
      $cookiename = trim(array_shift($cookie)); 
      $cookiearr[$cookiename] = trim(implode('=', $cookie));
    }
    $cookie = "";
    if(trim($string) == "") 
    {
       // print_r($cookiearr);
      foreach ($cookiearr as $key=>$value)
      {
        $cookie .= "$key=$value; ";
      }
      curl_setopt($ch, CURLOPT_COOKIE, $cookie);
    }

    return $length;
}


function SMercatorToLonLat($x, $y){
    
    $lon=($x/20037508.34)*180; 
     $lat=($y/20037508.34)*180;
      $lat=180/M_PI*(2*atan(exp($lat*M_PI/180))-M_PI/2);
    return (object)array("lon"=>$lon, "lat" => $lat);
}

function LonLatToSMercator($lon,$lat){
     $x=$lon*20037508.34/180;
     $y= log(tan((90+$lat)*M_PI/360))/(M_PI/180);
     $y=$y*20037508.34/180;
      return (object)array("x" => $x, "y" => $y);
}







?>