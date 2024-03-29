<?


class cURL {
var $headers;
var $user_agent;
var $compression;
var $cookies;
var $proxy;
var $referer;
 
function cURL($origin = '',$cookies = '', $referer = '', $compression='gzip', $proxy='') {
//	$this->headers[] = 'Accept: image/gif, image/x-bitmap, image/jpeg, image/pjpeg';
	$this->headers[] = 'Connection: Keep-Alive';
    $this->headers[] = 'X-Requested-With:XMLHttpRequest';
	$this->headers[] = 'Content-type: application/x-www-form-urlencoded;charset=UTF-8';
     if($origin !== '')
      $this->headers[] = 'Origin: '.$origin;
    $this->referer = $referer;
	$this->user_agent = 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; .NET CLR 1.0.3705; .NET CLR 1.1.4322; Media Center PC 4.0)';
	$this->compression=$compression;
	$this->proxy=$proxy;
    $this->cookies = $cookies;
	
}
 
function get($url) {
	$process = curl_init($url);
	curl_setopt($process, CURLOPT_HTTPHEADER, $this->headers);
	curl_setopt($process, CURLOPT_HEADER, 0);
	curl_setopt($process, CURLOPT_USERAGENT, $this->user_agent);
	//curl_setopt($process, CURLOPT_COOKIE, file_get_contents($this->cookie_file));
	curl_setopt($process,CURLOPT_ENCODING , $this->compression);
	curl_setopt($process, CURLOPT_TIMEOUT, 30);
	if ($this->proxy) curl_setopt($process, CURLOPT_PROXY, $this->proxy);
	curl_setopt($process, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($process, CURLOPT_FOLLOWLOCATION, 1);
	$return = curl_exec($process);
	curl_close($process);
	return $return;
}
 
function post($url,$data) { 
	$process = curl_init($url);
	curl_setopt($process, CURLOPT_HTTPHEADER, $this->headers);
	curl_setopt($process, CURLOPT_HEADER, 0);
	curl_setopt($process, CURLOPT_USERAGENT, $this->user_agent);
	curl_setopt($process, CURLOPT_COOKIE, $this->cookies);
//	curl_setopt($process, CURLOPT_ENCODING , $this->compression);
	//curl_setopt($process, CURLOPT_TIMEOUT, 30);
	//if ($this->proxy) curl_setopt($process, CURLOPT_PROXY, $this->proxy);
	curl_setopt($process, CURLOPT_POSTFIELDS, $data);
	curl_setopt($process, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($process, CURLOPT_FOLLOWLOCATION, 1);
	curl_setopt($process, CURLOPT_POST, 1);
   // curl_setopt($process, CURLOPT_REFERER, $this->referer);    
    
	$return = curl_exec($process);
	curl_close($process);
	return $return;
}
}
?>