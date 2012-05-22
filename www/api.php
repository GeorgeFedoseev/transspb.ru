<?

require_once("main.php");
require_once("curl.php");


if($_GET){
  $tr = new transport();
    if($street = urldecode($_GET['getstops'])){        
         $tr->setLocation($street);
         echo json_encode($tr->getNearStops(0));
    }elseif($stop = (int)$_GET['getstopinfo']){
         echo json_encode($tr->getStopInfo($stop));
    }
}






class transport{
    
    var $user_location;
    var $curl;
    var $itemsPP = 25;
    
    function __construct(){
        $this->curl = new cURL("http://transport.orgp.spb.ru",
         "JSESSIONID=WQ8RdaDLMbktD6tXPX8ew__;portal.baseLayer=%u041A%u0430%u0440%u0442%u0430%20%u0420%u043E%u0441%u0441%u0438%u0438%20%28OSM%29;",
         "http://transport.orgp.spb.ru/Portal/transport/stops"         
         );
    }
    
    function setLocation($street, $lon = 0, $lat = 0){
        $this->user_location = (object)array("street" => $street, "lon" => $lon, "lat" => $lat);        
    }
    
    function getNearStops($displayStart){
        $stops = null;
            $data = $this->curl->post('http://transport.orgp.spb.ru/Portal/transport/stops/list',
                "sEcho=30"
                ."&iColumns=7"
                ."&sColumns=id,transportType,name,images,nearestStreets,routes,lonLat"
                ."&iDisplayStart=".$displayStart
                ."&iDisplayLength=".$this->itemsPP
                ."&sNames=id,transportType,name,images,nearestStreets,routes,lonLat"
                ."&iSortingCols=1"
                ."&iSortCol_0=0"
                ."&sSortDir_0=asc" /* or desc */
                ."&bSortable_0=true"
                ."&bSortable_1=true"
                ."&bSortable_2=true"
                ."&bSortable_3false"
                ."&Sortable_4=true"
                ."&bSortable_5=false"
                ."&bSortable_6=false"
                ."&transport-type=0"
                ."&transport-type=2"
                ."&transport-type=1"
                ."&nearest-streets=".$this->user_location->street
            );
            
            $data = json_decode($data);
           // echo $data->sColumns;
            //echo "<pre>".print_r($data, 1)."</pre>";
             foreach($data->aaData as $st){
                $stop = null;
                $routes = null;
                
                
                 foreach($st[5] as $rt){
                    $route = null;

                      $route = (object)array(
                                        "name" => $rt->name,
                                        "number" => $rt->routeNumber,
                                        "cost" => $rt->cost,
                                        "start" => (object)array(
                                                            "startName" => $rt->poiStart->name,
                                                            "nearStreets" => $rt->poiStart->nearestStreets,
                                                            "lonLat" => (object)array(
                                                                                     "lon" => $rt->poiStart->lonLat->lon,
                                                                                     "lat" => $rt->poiStart->lonLat->lat
                                                                                    )                                        
                                                        ),
                                        "finish" => (object)array(
                                                            "startName" => $rt->poiFinish->name,
                                                            "nearStreets" => $st->poiFinish->nearestStreets,
                                                             "lonLat" => (object)array(
                                                                                     "lon" => $rt->poiFinish->lonLat->lon,
                                                                                     "lat" => $rt->poiFinish->lonLat->lat
                                                                                    )                                            
                                                        )
                                    );
                      $routes[] = $route;
                 }
                 
                 $stop = (object)array(
                            "id" => $st[0],
                            "type" => $st[1]->systemName,
                            "stopName" => $st[2],
                            "stopImages" => $st[3],
                            "stopNearestStreets" => $st[4],
                            "routes" => $routes
                         );
                 $stops[] = $stop;
             }
             
             
             
            return $stops;
    }
    
    function getStopInfo($id, $displayStart = 0){
        $data = $this->curl->post('http://transport.orgp.spb.ru/Portal/transport/stop/'.$id.'/arriving',
             "sEcho=30"
             ."&iColumns=4"
             ."&sColumns=index,routeNumber,timeToArrive,parkNumber"
             ."&iDisplayStart=".$displayStart
             ."&iDisplayLength=-1"
             ."&sNames=index,routeNumber,timeToArrive,parkNumber"
        );
        
         $routes = null;
         $data = json_decode($data);
          if($data->aaData){
            foreach($data->aaData as $rt){
                $route = null;
                 $routes[] = (object)array(
                                            "number" => $rt[1],
                                            "arrivingIn" => $rt[2]
                                        );
            }
          }
        return $routes;
        
    }
    
    private function getDistance($a, $b){
        return sqrt(($a->x - $b->x)*($a->x - $b->x) +  ($a->y - $b->y)*($a->y - $b->y));
    }
}








?>