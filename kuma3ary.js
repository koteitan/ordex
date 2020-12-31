/*Kuma3ary = Initialize this object in T for kuma kuma 3-ary Psi by p and septype.
  ex. new Kuma3ary(); // means 0
  ex. new Kuma3ary(0); // means 0
  ex. new Kuma3ary(1); // means 1
  ex. new Kuma3ary("w"); // means w  
 */
Kuma3ary = function(_in){
  Ordinal.call(this);
  if(typeof(_in)==='undefined'||_in==0){
    //nop
  }else if(isFinite(_in)){
    if(_in==1){
      this.t=',';
      this.a=[new Kuma3ary(),new Kuma3ary(),new Kuma3ary()];
      this.p=null;
      this.a[0].p=this;
      this.a[1].p=this;
      this.a[2].p=this;
    }else{
      //under construction
    }
  }else if(_in=="w"){
    this.t=",";
    this.a=[new Kuma3ary(0), new Kuma3ary(0), new Kuma3ary(1)];
    this.p=null;
  }
}
Kuma3ary.prototype = Object.create(Ordinal.prototype);
