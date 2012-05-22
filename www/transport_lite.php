<?

require_once("main.php");


$query = "";

if($_GET){
    #return image
     foreach($_GET as $key=>$val){
         $query .= "&$key=$val";
     }
   
      $trans_layer = _get("http://transport.orgp.spb.ru/cgi-bin/mapserv?$query");    
        header('Content-Type: image/png');
        echo $trans_layer;
       
       
}else{
    #nothing
}























?>