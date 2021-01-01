/*Kuma3ary = Initialize this object in T for kuma kuma 3-ary Psi by p and septype.
  ex. new Kuma3ary(); // means 0
  ex. new Kuma3ary(0); // means 0
  ex. new Kuma3ary(1); // means 1
  ex. new Kuma3ary("w"); // means w  
 */
Kuma3ary = function(t,a){
  // nicknames
  switch(t){
    case "0":
      this.t="0";
      this.a=null;
      this.p=null;
    return;
    case "1":
      this.t=",";
      this.a=[new Kuma3ary("0"),new Kuma3ary("0"),new Kuma3ary("0")];
      this.p=null;
    return;
    case "w": //omega
      this.t=",";
      this.a=[new Kuma3ary("0"), new Kuma3ary("0"), new Kuma3ary("1")];
      this.p=null;
    return;
    default:
    break;
  }
  if(isFinite(t)){ //N
    this.t="+";
    this.a=new Array(parseInt(t));
    for(var i=0;i<this.a.length;i++){
      this.a[i]=new Kuma3ary("1");
    }
    this.p=null;
    return;
  }
  
  // primitive 
  if(typeof(t)=="undefined"){
    Ordinal.call(this);
  }else if(typeof(a)=="undefined"){
    Ordinal.call(this,t);
  }else{
    Ordinal.call(this,t,a);
  }
}
Kuma3ary.prototype = Object.create(Ordinal.prototype);
Object.defineProperty(Kuma3ary.prototype, 'constructor', 
  {value:Kuma3ary, enumerable:false, writable:true});
Kuma3ary.add = Ordinal.add;
Kuma3ary.cat = Ordinal.cat;
Kuma3ary.parse = Ordinal.parse;
