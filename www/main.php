<?



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










?>