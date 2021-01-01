/* @fn new Kuma3ary(t,a)
 * @brief initialize a new object for kuma kuma 3-ary Psi by t and a.
 * @param t = {"0", "1", "2", ... , "9", "w","+",","} = initialize type
 *  When t = "0" -- "9", the object is initialized as the natural number.
 *  When t = "w"       , the object is initialized as the first transfinite ordinal.
 *  When t = "+" and a=[a0,a1,...,aN], the object is initialized as the ordinal which indicates a0+a1+a2...aN.
 *  When t = "," and a=[a0,a1,...,aN], the object is initialized as the ordinal which indicates (a0,a1,a2,...,aN).
 * @param a = parameter set for "+" and ",". see reference for t.
 */
Kuma3ary = function(t,a){
  /* programmer memo: Define conversion from suger syntax to the object here. */
  switch(t){
    case "0":
      this.t="0";
      this.a=null;
    return;
    case "1":
      this.t=",";
      this.a=[new Kuma3ary("0"),new Kuma3ary("0"),new Kuma3ary("0")];
    return;
    case "w": //omega
      this.t=",";
      this.a=[new Kuma3ary("0"), new Kuma3ary("0"), new Kuma3ary("1")];
    return;
    default:
    break;
  }
  if(t!="" && isFinite(t)){ //nat
    this.t="+";
    this.a=new Array(parseInt(t));
    for(var i=0;i<this.a.length;i++){
      this.a[i]=new Kuma3ary("1");
    }
    return;
  }
  
  /* programmer memo:  "+", "," can be parsed by Ordinal built-in function. */
  Ordinal.call(this,t,a);
}

/* @fn Kuma3ary.toSugar
 * @brief Callback for sugar for toString(sugar). 
 * @detail When you use kuma.toString(), if you add the function for the parameter of toString() like kuma.toString(Kuma3ary.toSugar), toString will become to use the sugar syntax defined in the function. 
 * @param str = input string from toString().
 * @returns str = modified string which is finally output by toString(). */
Kuma3ary.toSugar = function(str){
  /* programmer memo: Define conversion from the object to the suger syntax here. */
  switch(str){
    case "(0)": case "(0,0)": case "(0,0,0)":
    return "1";
    case "(1)": case "(0,0,1)": case "(0,0,1)":
    return "w";
  }
  return str;
}

/* programmer memo: Please put the code as following to make the type Kuma3ary the extension of the type Ordinal. */
/* ------------------0---------------------------------- begin */
Kuma3ary.prototype = Object.create(Ordinal.prototype);
Object.defineProperty(Kuma3ary.prototype, 'constructor', 
  {value:Kuma3ary, enumerable:false, writable:true});
Kuma3ary.parse = Ordinal.parse;
/* ----------------------------------------------------- end */


Kuma3ary.prototype.isone =function(){return Kuma3ary.equal(this,k0);}
Kuma3ary.prototype.isone =function(){return Kuma3ary.equal(this,k1);}
Kuma3ary.prototype.isw   =function(){return Kuma3ary.equal(this,kw);}
Kuma3ary.prototype.isPT  =function(x){return this.t==",";}
Kuma3ary.prototype.isadd =function(x){return this.t=="+";}
Kuma3ary.prototype.slice =function(s,e){ return new Kuma3ary(this.t, this.a.slice(s,e));}

/** @fn this.equal()
  * @returns true if x==y. */
Kuma3ary.equal=function(x,y){
  if(x.t!=y.t) return false;
  if(x.a instanceof Array && y.a instanceof Array){
    if(x.a.length!=y.a.length) return false;
    for(var i=0;i<x.a.length;i++){
      if(!Kuma3ary.equal(x.a[i],y.a[i])) return false;
    }
  }
  return true;
}

Kuma3ary.k0=new Kuma3ary("0");
Kuma3ary.k1=new Kuma3ary("1");
Kuma3ary.kw=new Kuma3ary("w");
/* original part -------------------------------------------------------------------------------*/

/** @fn lessthan(x,y)
  * @brief compare x and y and returns ordering of them.  
  * @param x = Kuma3ary ordinal notation.
  * @param y = Kuma3ary ordinal notation.
  * @returns = {true:x<y, false:x>=y}.
  * */
Kuma3ary.lessthan=function(x,y){
  /* 1       */ if(x.iszero()) return !y.iszero();
  /* 2       */ if(x.isPT  ()){
  /*         */   var x1 = x.a[0]; var x2 = x.a[1]; var x3 = x.a[2];
  /* 2-1     */   if(y.iszero()) return false;
  /* 2-2     */   if(y.isPT()){
  /*         */     var y1 = y.a[0]; var y2 = y.a[1]; var y3 = y.a[2];
  /* 2-2-1   */     if( Kuma3ary.equal(x1,y1) &&  Kuma3ary.equal(x2,y2)) return Kuma3ary.lessthan(x3,y3);
  /* 2-2-2   */     if( Kuma3ary.equal(x1,y1) && !Kuma3ary.equal(x2,y2)) return Kuma3ary.lessthan(x2,y2);
  /* 2-2-3   */     if(!Kuma3ary.equal(x1,y1)                          ) return Kuma3ary.lessthan(x1,y1);
  /*         */   }
  /* 2-3     */   if(y.isadd()){
  /*         */     var y1 = y.a[0]; var y2 = y.a[1]; var y3 = y.a[2];
  /*         */     return Kuma3ary.equal(x,y1) || Kuma3ary.lessthan(x,y1);
  /*         */   }
  /*         */ }
  /* 3       */ if(x.isadd()){
  /*         */   var x1 = x.a[0]; var x2 = x.a[1]; var x3 = x.a[2]; var xm = x.a.length;
  /* 3-1     */   if(y.iszero()) return false; 
  /* 3-2     */   if(y.isPT  ()) return Kuma3ary.lessthan(x1,y); 
  /* 3-3     */   if(y.isadd ()){ 
  /*         */     var y1 = y.a[0]; var y2 = y.a[1]; var y3 = x.a[2]; var ym = y.a.length;
  /*         */     var x2xm = x.slice(1); /* x2+x3+...+xm */
  /*         */     var y2ym = y.slice(1); /* y2+y3+...+ym */
  /* 3-3-1   */     if(Kuma3ary.equal(x1,y1)){
  /* 3-3-1-1 */       if(xm==2 && ym==2) return Kuma3ary.lessthan(x2  , y2  );
  /* 3-3-1-2 */       if(xm==2 && ym> 2) return Kuma3ary.lessthan(x2  , y2ym);
  /* 3-3-1-3 */       if(xm> 2 && ym==2) return Kuma3ary.lessthan(x2xm, y2  );
  /* 3-3-1-4 */       if(xm> 2 && ym> 2) return Kuma3ary.lessthan(x2xm, y2ym);
  /*         */     }else{
  /* 3-3-2   */       return Kuma3ary.lessthan(x1,y1);
  /*         */     }
  /*         */   }
  /*         */ }
}

Kuma3ary.prototype.dom=function(){
  /*         */ var x=this;
  /* 1       */ if(x.iszero()) return new Kuma3ary("0");
  /* 2       */ if(x.isPT  ()){
  /*         */   var x1 = x.a[0]; var x2 = x.a[1]; var x3 = x.a[2];
  /* 2-1     */   if(x3.dom().iszero()){
  /* 2-1-1   */     if(      x2.dom().iszero()){
  /* 2-1-1-1 */       if(x1.dom().iszero() || x1.dom().isone()){return x  ;}
  /* 2-1-1-2 */       else                                     {return x_1;}
  /* 2-1-2   */     }else if(x2.dom().isone ()){return x;}
  /* 2-1-3   */     else{
  /* 2-1-3-1 */       if(Kuma3ary.lessthan(x2.dom(),x)){return x2.dom();}
  /* 2-1-3-2 */       else return Kuma3ary.kw;
  /*         */     }
  /* 2-2     */   }else if(x3.dom().isone() || x3.dom().isw()){return kw;}
  /* 2-3     */   else{
  /* 2-3-1   */     if(Kuma3ary.lessthan(x3.dom(), x)){return x3.dom()}
  /* 2-3-2   */     else{return kw;}
  /*         */   }
  /*         */ }
  /* 3       */ else{return x.a[x.a.length-1].dom();}
}










