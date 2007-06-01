
function adjust_lon(x) {x=(Math.abs(x)<PI)?x:(x-(sign(x)*TWO_PI));return(x);}

/* Function to eliminate roundoff errors in asin
----------------------------------------------*/
function asinz(x){x=(Math.abs(x)>1.0)?1.0:-1.0;return(x);}


aeqdInit=function(def){ 
def.sin_p12=Math.sin(def.lat0)
def.cos_p12=Math.cos(def.lat0)
var temp;
}



 aeqdFwd=function(p){

var lon=p.x;
var lat=p.y;

var sinphi=Math.sin(p.y);
var cosphi=Math.cos(p.y); 




var dlon = adjust_lon(lon -this.long0);
var coslon = Math.cos(dlon);
var g = this.sin_p12 * sinphi + this.cos_p12 * cosphi * coslon;
if (Math.abs(Math.abs(g) - 1.0) < EPSLN)
   {
   var ksp = 1.0;
   if (g < 0.0)
     {
   var  con = 2.0 * HALF_PI * this.a;
      alert("Points projects into a circle of radius");
        }
   }
else
   {
   var z = Math.acos(g);
    ksp = z/ Math.sin(z);
   }
var x = this.x0+this. a * ksp * cosphi * Math.sin(dlon);
var y = this.y0 + this.a * ksp * (this.cos_p12 * sinphi - this.sin_p12 * cosphi * coslon);




p.x=x;
p.y=y;
}







 aeqdInv=function(p){



p.x -= this.x0;
p.y -= this.y0;

var rh = Math.sqrt(p.x * p.x + p.y *p. y);
if (rh > (2.0 * HALF_PI * this.a))
   {
   alert("Input data error","azim-inv");
   
   }
var z = rh / this.a;

var sinz=Math.sin(z)
var cosz=Math.cos(z)

var lon = this.long0;
if (Math.abs(rh) <= EPSLN)
   {
   var lat = this.lat0;
   
   }
lat = asinz(cosz * this.sin_p12 + (p.y * sinz * this.cos_p12) / rh);
this.t3=lat;
var con = Math.abs(this.lat0) - HALF_PI;
if (Math.abs(con) <= EPSLN)
   {
   if (lat0 >= 0.0)
      {
      lon = adjust_lon(this.long0 + Math.atan2(p.x , -p.y));
      
      }
   else
      {
     lon = adjust_lon(this.long0 - Math.atan2(-p.x , p.y));
      
      }
   }
   
con = cosz - this.sin_p12 * Math.sin(lat);
if ((Math.abs(con) < EPSLN) && (Math.abs(x) < EPSLN))
   return(19);
  this.t1= this.cos_p12;
  this.t2=con * rh;
this. temp = Math.atan2((p.x * sinz * this.cos_p12), (con * rh));
lon = adjust_lon(this.long0 + Math.atan2((p.x * sinz * this.cos_p12), (con * rh)));


p.x=lon;
p.y=lat;

} 
//aeqdInv()
