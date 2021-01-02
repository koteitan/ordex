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
    case "w":
      this.t=",";
      this.a=[new Kuma3ary("0"), new Kuma3ary("0"), new Kuma3ary("1")];
    return;
    case "W":
      this.t=",";
      this.a=[new Kuma3ary("0"), new Kuma3ary("1"), new Kuma3ary("0")];
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
  if(t=="+"||t==","){
    Ordinal.call(this,t,a);
  }else{
    var o=Ordinal.parse(t);
    this.t=o.t;
    this.a=o.a;
  }
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
    case "(1,0)": case "(0,1,0)":
    return "W";
  }
  return str;
}

/* programmer memo: Please put the code as following to make the type Kuma3ary the extension of the type Ordinal. */
/* ------------------0---------------------------------- begin */
Kuma3ary.prototype = Object.create(Ordinal.prototype);
Object.defineProperty(Kuma3ary.prototype, 'constructor', 
  {value:Kuma3ary, enumerable:false, writable:true});
Kuma3ary.parse     = Ordinal.parse;
Kuma3ary.normalize = Ordinal.normalize;
Kuma3ary.add       = Ordinal.add;
Kuma3ary.cat       = Ordinal.cat;
/* ----------------------------------------------------- end */


Kuma3ary.prototype.iszero=function(){return this.eq(k0);}
Kuma3ary.prototype.isone =function(){return this.eq(k1);}
Kuma3ary.prototype.isw   =function(){return this.eq(kw);}
Kuma3ary.prototype.isPT  =function(){return this.t==",";}
Kuma3ary.prototype.isadd =function(){return this.t=="+";}
Kuma3ary.prototype.slice =function(s,e){ return new Kuma3ary(this.t, this.a.slice(s,e));}
Kuma3ary.prototype.eq    =function(x){return Kuma3ary.eq(this,x);}
Kuma3ary.prototype.lt    =function(x){return Kuma3ary.lessthan(this,x);}
Kuma3ary.prototype.isfinite=function(){
  if(this.t=="0") return true;
  if(this.t=="+"){
    for(var i=0;i<this.a.length;i++){
      if(!this.a[i].isone()) return false;
    }
    return true;
  }else{
    return this.isone();
  }
}
Kuma3ary.prototype.toint=function(){
  switch(this.t){
    case "0": return 0;
    case "+": return this.isfinite()?this.a.length:-1;
    case ",": return this.isone()?1:-1;
    default : return -1;
  }
}
Kuma3ary.prototype.mul=function(n){
  if(n==0)return Kuma3ary.k0;
  if(n==1)return this;
  var a=new Array(n);
  for(var i=0;i<a.length;i++) a[i]=this;
  return new Kuma3ary("+",a);
}

Kuma3ary.eq=function(x,y){
  if(x.t!=y.t) return false;
  if(x.a instanceof Array && y.a instanceof Array){
    if(x.a.length!=y.a.length) return false;
    for(var i=0;i<x.a.length;i++){
      if(!Kuma3ary.eq(x.a[i],y.a[i])) return false;
    }
  }
  return true;
}
Kuma3ary.k0=new Kuma3ary("0");
Kuma3ary.k1=new Kuma3ary("1");
Kuma3ary.kw=new Kuma3ary("w");
Kuma3ary.kW=new Kuma3ary("W");
/* original part -------------------------------------------------------------------------------*/

/** @fn lessthan(x,y)
  * @brief compare x and y and returns ordering of them.  
  * @param x = Kuma3ary ordinal notation.
  * @param y = Kuma3ary ordinal notation.
  * @returns = {true:x<y, false:x>=y}.
  * */
Kuma3ary.lessthan=function(x,y){
  if(!x instanceof Kuma3ary) throw new Error("x is not Kuma3ary object.");
  if(!y instanceof Kuma3ary) throw new Error("y is not Kuma3ary object.");
  var eq = Kuma3ary.eq;
  var lt = Kuma3ary.lessthan;
  /* 1       */ if(x.iszero()) return !y.iszero();
  /* 2       */ if(x.isPT  ()){
  /*         */   var x1 = x.a[0]; var x2 = x.a[1]; var x3 = x.a[2];
  /* 2-1     */   if(y.iszero()) return false;
  /* 2-2     */   if(y.isPT()){
  /*         */     var y1 = y.a[0]; var y2 = y.a[1]; var y3 = y.a[2];
  /* 2-2-1   */     if( eq(x1,y1) &&  eq(x2,y2)) return lt(x3,y3);
  /* 2-2-2   */     if( eq(x1,y1) && !eq(x2,y2)) return lt(x2,y2);
  /* 2-2-3   */     if(!eq(x1,y1)                          ) return lt(x1,y1);
  /*         */   }
  /* 2-3     */   if(y.isadd()){
  /*         */     var y1 = y.a[0]; var y2 = y.a[1]; var y3 = y.a[2];
  /*         */     return eq(x,y1) || lt(x,y1);
  /*         */   }
  /*         */ }
  /* 3       */ if(x.isadd()){
  /*         */   var x1 = x.a[0]; var x2 = x.a[1]; var x3 = x.a[2]; var xm = x.a.length;
  /* 3-1     */   if(y.iszero()) return false; 
  /* 3-2     */   if(y.isPT  ()) return lt(x1,y); 
  /* 3-3     */   if(y.isadd ()){ 
  /*         */     var y1 = y.a[0]; var y2 = y.a[1]; var y3 = x.a[2]; var ym = y.a.length;
  /*         */     var x2xm = x.slice(1); /* x2+x3+...+xm */
  /*         */     var y2ym = y.slice(1); /* y2+y3+...+ym */
  /* 3-3-1   */     if(eq(x1,y1)){
  /* 3-3-1-1 */       if(xm==2 && ym==2) return lt(x2  , y2  );
  /* 3-3-1-2 */       if(xm==2 && ym> 2) return lt(x2  , y2ym);
  /* 3-3-1-3 */       if(xm> 2 && ym==2) return lt(x2xm, y2  );
  /* 3-3-1-4 */       if(xm> 2 && ym> 2) return lt(x2xm, y2ym);
  /*         */     }else{
  /* 3-3-2   */       return lt(x1,y1);
  /*         */     }
  /*         */   }
  /*         */ }
}

Kuma3ary.prototype.dom=function(){
  var lt = Kuma3ary.lessthan;
  var kw = Kuma3ary.kw;
  var k0 = Kuma3ary.k0;
  /*         */ var x  = this;
  /* 1       */ if(x.iszero()) return k0;
  /* 2       */ if(x.isPT  ()){
  /*         */   var x1 = x.a[0]; var x2 = x.a[1]; var x3 = x.a[2];
  /* 2-1     */   if(x3.dom().iszero()){
  /* 2-1-1   */     if(      x2.dom().iszero()){
  /* 2-1-1-1 */       if(x1.dom().iszero() || x1.dom().isone()){return x  ;}
  /* 2-1-1-2 */       else                                     {return x_1;}
  /* 2-1-2   */     }else if(x2.dom().isone()){return x;}
  /* 2-1-3   */     else{
  /* 2-1-3-1 */       if(lt(x2.dom(),x)){return x2.dom();}
  /* 2-1-3-2 */       else return kw;
  /*         */     }
  /* 2-2     */   }else if(x3.dom().isone() || x3.dom().isw()){return kw;}
  /* 2-3     */   else{
  /* 2-3-1   */     if(lt(x3.dom(), x)){return x3.dom()}
  /* 2-3-2   */     else{return kw;}
  /*         */   }
  /*         */ }
  /* 3       */ else{return x.a[x.a.length-1].dom();}
}

Kuma3ary.prototype.expand=function(y){
  if(!y instanceof Kuma3ary) throw new Error("y is not Kuma3ary object.");
  var lt = Kuma3ary.lessthan;
  var k0 = Kuma3ary.k0;
  var kw = Kuma3ary.kw;
  var x  = this;
  var newk = function(x1,x2,x3){return new Kuma3ary(",",[x1,x2,x3]);};
  /* 1           */ if(x.iszero()) return k0;
  /* 2           */ else if(x.isPT  ()){
  /*             */   var x1 = x.a[0]; var x2 = x.a[1]; var x3 = x.a[2];
  /* 2-1         */   if(x3.dom().iszero()){
  /* 2-1-1       */     if(x2.dom().iszero()){
  /* 2-1-1-1     */       if     (x1.dom().iszero()) return k0;
  /* 2-1-1-2     */       else if(x1.dom().isone ()) return y;
  /* 2-1-1-3     */       else                       return newk(x1.expand(y), x2, x3);
  /* 2-1-2       */     }else if(x2.dom().isone ()) return y;
  /* 2-1-3       */     else{
  /* 2-1-3-1     */       if(lt(x2.dom(),x)) return newk(x1, x2.expand(y), x3);
  /* 2-1-3-2     */       else{
  /*             */         var p=x2.dom().a[0]; 
  /*             */         var q=x2.dom().a[1];
  /* 2-1-3-2-1   */         if(q.iszero()){
  /* 2-1-3-2-1-1 */           if(!y.iszero() && y.isfinite()){
  /*             */             var Gamma=x.expand(y.expand(k0)).a[1];
  /*             */             return newk(x1,x2.expand(newk(p.expand(k0), Gamma, k0)),x3);
  /*             */           }else{
  /*             */             return newk(x1,x2.expand(newk(p.expand(k0), q,     k0)),x3);
  /*             */           }
  /* 2-1-3-2-2   */         }else{
  /* 2-1-3-2-2-1 */           if(!y.iszero() && y.isfinite()){
  /*             */             var Gamma=x.expand(y.expand(k0)).a[1];
  /*             */             return newk(x1,x2.expand(newk(p.expand(k0), q, Gamma)),x3);
  /* 2-1-3-2-2-2 */           }else{
  /*             */             return newk(x1,x2.expand(newk(p.expand(k0), q,    k0)),x3);
  /*             */           }
  /*             */         }
  /*             */       }
  /*             */     }
  /* 2-2         */   }else if(x3.dom().isone()){
  /* 2-2-1       */     if(y.isone()) return newk(x1,x2,x3.expand(k0));
  /* 2-2-2       */     else{
                          var k=y.toint();
                          if(2<=k && k!=-1) return newk(x1,x2,x3.expand(k0)).mul(k);
  /* 2-2-3       */       else return k0;
                        }
  /* 2-3         */   }else if(x3.dom().eq(kw)) return newk(x1,x2,x3.expand(y));
  /* 2-4         */   if(!x3.dom().iszero() && !x3.dom().isone() && !x3.dom().eq(kw)){
  /* 2-4-1       */     if(x3.dom().lt(x)) return newk(x1,x2,x3.expand(y));
  /* 2-4-2       */     else{
                          var P=x3.a[0];
                          var Q=x3.a[1];
                          var h=y.toint();
  /* 2-4-2-1     */       if(Q.iszero()){
  /* 2-4-2-1-1   */         if(1<=h && h!=-1){
  /*             */           var Gamma=x.expand(y.expand(k0)).a[2];
  /*             */           return newk(x1,x2,x3.expand(newk(P.expand(k0), Gamma, k0)));
  /* 2-4-2-1-2   */         }else{
  /*             */           return newk(x1,x2,x3.expand(newk(P.expand(k0), Q,     k0)));
  /*             */         }
  /* 2-4-2-2     */       }else{
  /* 2-4-2-2-1   */         if(!y.iszero() && y.isfinite()){
  /*             */           var Gamma=x.expand(y.expand(k0)).a[2];
  /*             */           return newk(x1,x2,x3.expand(newk(P.expand(k0), Q.expand(k0), Gamma)));
  /* 2-1-3-2-2   */         }else{
  /*             */           return newk(x1,x2,x3.expand(newk(P.expand(k0), Q.expand(k0),    k0)));
  /*             */         }
  /*             */       }
  /*             */     }
  /*             */   }
  /*             */ }
  /* 3           */ else if(x.isadd()){
  /*             */   var m=x.a.length;
                      var xm_y = x.a[m-1].expand(y);
  /* 3-1         */   if(xm_y.iszero() && m==2) return x.a[0];
  /* 3-2         */   if(xm_y.iszero() && m> 2) return x.slice(0,m-1);
  /* 3-3         */   else return x.slice(0,m-1).addright(x.a[m-1].expand(y));
                    }
}








