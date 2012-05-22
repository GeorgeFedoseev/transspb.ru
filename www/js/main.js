function print_r(theObj){
  var str = '';
  if(theObj.constructor == Array ||
     theObj.constructor == Object){
    str += "<ul>";
    for(var p in theObj){
      if(theObj[p].constructor == Array||
         theObj[p].constructor == Object){
           str += "<li>["+p+"] => "+typeof(theObj)+"</li>";
         str += "<ul>";
        str +=  print_r(theObj[p]);
         str += "</ul>";
      } else {
           str +=  "<li>["+p+"] => "+theObj[p]+"</li>";
      }
    }
     str +=  "</ul>";
  }
   return str;
}

function rand( min, max ) {	// Generate a random integer
	// 
	// +   original by: Leslie Hoare

	if( max ) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	} else {
		return Math.floor(Math.random() * (min + 1));
	}
}


function secondsToHms(d) {
	d = Number(d);
	var h = Math.floor(d / 3600);
	var m = Math.floor(d % 3600 / 60);
	var s = Math.floor(d % 3600 % 60);
	return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s);
}





















