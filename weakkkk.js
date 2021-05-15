/* @fn new WeakKkk(t,a)
 * @brief initialize a new object for kuma kuma 3-ary Psi by t and a.
 * @param t = {"0", "1", "2", ... , "9", "w","+",","} = initialize type
 *  When t = "0" -- "9", the object is initialized as the natural number.
 *  When t = "w"       , the object is initialized as the first transfinite ordinal.
 *  When t = "+" and a=[a0,a1,...,aN], the object is initialized as the ordinal which indicates a0+a1+a2...aN.
 *  When t = "," and a=[a0,a1,...,aN], the object is initialized as the ordinal which indicates (a0,a1,a2,...,aN).
 * @param a = parameter set for "+" and ",". see reference for t.
 */
WeakKkk = function(t,a){
  /* programmer memo: Define conversion from suger syntax to the object here. */
  switch(t){
    case "0":
      this.t="0";
      this.a=null;
    return;
    case "1":
      this.t=",";
      this.a=[new WeakKkk("0"), new WeakKkk("0")];
    return;
    case "w":
      this.t=",";
      this.a=[new WeakKkk("0"), new WeakKkk("1")];
    return;
    case "W":
      this.t=",";
      this.a=[new WeakKkk("1"), new WeakKkk("0")];
    return;
    case "e":
      this.t=",";
      this.a=[new WeakKkk("0"), new WeakKkk("W")];
    return;
    case "z":
      var k=WeakKkk.parse("(0,(1,W))");
      this.t=k.t;
      this.a=k.a;
    return;
    case "G":
      var k=WeakKkk.parse("(0,(1,(1,W)))");
      this.t=k.t;
      this.a=k.a;
    return;
    default:
    break;
  }
  if(t!="" && isFinite(t)){ //nat
    this.t="+";
    this.a=new Array(parseInt(t));
    for(var i=0;i<this.a.length;i++){
      this.a[i]=new WeakKkk("1");
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

/* @fn WeakKkk.toSugar
 * @brief Callback for sugar for toString(sugar). 
 * @detail When you use kuma.toString(), if you add the function for the parameter of toString() like kuma.toString(WeakKkk.toSugar), toString will become to use the sugar syntax defined in the function. 
 * @param str = input string from toString().
 * @returns str = modified string which is finally output by toString(). */
WeakKkk.toSugar = function(str){
  /* programmer memo: Define conversion from the object to the suger syntax here. */
  switch(str){
    case "(0,0)":
    return "1";
    
    case "(0,1)":
    return "w";
    
    case "(1,0)":
    return "W";
  }
  return str;
}

/* programmer memo: Please put the code as following to make the type WeakKkk the extension of the type Ordinal. */
/* ------------------0---------------------------------- begin */
WeakKkk.prototype = Object.create(Ordinal.prototype);
Object.defineProperty(WeakKkk.prototype, 'constructor', 
  {value:WeakKkk, enumerable:false, writable:true});
WeakKkk.parse     = Ordinal.parse;
WeakKkk.add       = Ordinal.add;
WeakKkk.cat       = Ordinal.cat;
/* ----------------------------------------------------- end */

WeakKkk.prototype.normalize = function(){
  Ordinal.prototype.normalize();
  if(this.t==","){
    if(this.a.length==1) this.a=[].concat([WeakKkk.k0,WeakKkk.k0],this.a);
    if(this.a.length==2) this.a=[].concat([WeakKkk.k0            ],this.a);
  }
}
WeakKkk.prototype.iszero=function(){return this.eq(k0);}
WeakKkk.prototype.isone =function(){return this.eq(k1);}
WeakKkk.prototype.isw   =function(){return this.eq(kw);}
WeakKkk.prototype.isPT  =function(){return this.t==",";}
WeakKkk.prototype.isadd =function(){return this.t=="+";}
WeakKkk.prototype.slice =function(s,e){ return new WeakKkk(this.t, this.a.slice(s,e));}
WeakKkk.prototype.eq    =function(x){return WeakKkk.eq(this,x);}
WeakKkk.prototype.lt    =function(x){return WeakKkk.lt(this,x);}
WeakKkk.prototype.isfinite=function(){
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
WeakKkk.prototype.toint=function(){
  switch(this.t){
    case "0": return 0;
    case "+": return this.isfinite()?this.a.length:-1;
    case ",": return this.isone()?1:-1;
    default : return -1;
  }
}
WeakKkk.prototype.mul=function(n){
  if(n==0)return WeakKkk.k0;
  if(n==1)return this;
  var a=new Array(n);
  for(var i=0;i<a.length;i++) a[i]=this;
  return new WeakKkk("+",a);
}

WeakKkk.eq=function(x,y){
  if(x.t!=y.t) return false;
  if(x.a instanceof Array && y.a instanceof Array){
    if(x.a.length!=y.a.length) return false;
    for(var i=0;i<x.a.length;i++){
      if(!WeakKkk.eq(x.a[i],y.a[i])) return false;
    }
  }
  return true;
}
WeakKkk.k0=new WeakKkk("0");
WeakKkk.k1=new WeakKkk("1");
WeakKkk.kw=new WeakKkk("w");
WeakKkk.kW=new WeakKkk("W");
/* original part -------------------------------------------------------------------------------*/

/** @fn lt(x,y)
  * @brief compare x and y and returns ordering of them.  
  * @param x = WeakKkk ordinal notation.
  * @param y = WeakKkk ordinal notation.
  * @returns = {true:x<y, false:x>=y}.
  * */
/*-----------------------------------------------------------------------------
Kanrokoti, "くまくま3変数ψ", 巨大数研究 Wiki, 2021-01-03T22:42:55.
  revision 33606, https://googology.wikia.org/ja/wiki/%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%83%96%E3%83%AD%E3%82%B0:Kanrokoti/%E3%81%8F%E3%81%BE%E3%81%8F%E3%81%BE3%E5%A4%89%E6%95%B0%CF%88?oldid=33606
  ---------------------------------------------------------------------------*/
/* 順序 ここでは、表記間の大小関係を定義する。 */
/* X,Y∈Tに対し、2項関係X<Yを以下のように再帰的に定める: */
WeakKkk.lt=function(X,Y){
  if(!X instanceof WeakKkk) throw new Error("X is not WeakKkk object.");
  if(!Y instanceof WeakKkk) throw new Error("Y is not WeakKkk object.");
  var eq = WeakKkk.eq;
  var lt = WeakKkk.lt;
  /* 1.         もしX=0ならば、X<Yは  Y≠0と同値である。 */
  /* 1       */ if(X.iszero()) return !Y.iszero();
  /* 2.         ここでX=ψ_{X_1}(X_2,X_3)を満たすX_1,X_2,X_3∈Tが存在するとする。 */
  /* 2       */ if(X.isPT  ()){
  /*         */   var X_1 = X.a[0]; var X_2 = X.a[1]; var X_3 = X.a[2];
  /* 2-1.         もしY=0ならば、X<Yは  偽である。 */
  /* 2-1     */   if(Y.iszero()) return false;
  /* 2-2.         ここでY=ψ_{Y_1}(Y_2,Y_3)を満たすY_1,Y_2,Y_3∈Tが存在するとする。 */
  /* 2-2     */   if(Y.isPT()){
  /*         */     var Y_1 = Y.a[0]; var Y_2 = Y.a[1]; var Y_3 = Y.a[2];
  /* 2-2-1.         もし   X_1= Y_1 かつ    X_2=Y_2 ならば、X<Yは     X_3<Y_3と同値である。*/
  /* 2-2-1   */     if( eq(X_1, Y_1) &&  eq(X_2,Y_2))       return lt(X_3,Y_3);
  /* 2-2-2.         もし   X_1= Y_1 かつ    X_2≠Y_2ならば、X<Yは     X_2<Y_2と同値である。*/
  /* 2-2-2   */     if( eq(X_1, Y_1) && !eq(X_2,Y_2))       return lt(X_2,Y_2);
  /* 2-2-3.         もし   X_1≠Y_1ならば、                 X<Yは     X_1<Y_1と同値である。 */
  /* 2-2-3   */     if(!eq(X_1, Y_1)                )       return lt(X_1,Y_1);
  /*         */   }
  /* 2-3.         もしY=Y_1+...+Y_{m'}を満たすY_1,...,Y_{m'}∈PT (2≦m'<∞)が存在するならば、 */
  /* 2-3     */   if(Y.isadd()){
  /*         */     var Y_1 = Y.a[0]; var Y_2 = Y.a[1]; var Y_3 = Y.a[2];
  /* ??           X<Yは     X=Y_1  または X<Y_1と同値である。 */
  /*         */     return eq(X,Y_1) ||  lt(X,Y_1);
  /*         */   }
  /*         */ }
  /* 3.         ここでX=X_1+...+X_mを満たすX_1,...,X_m∈PT (2≦m<∞)が存在するとする。 */
  /* 3       */ if(X.isadd()){
  /*         */   var X_1 = X.a[0]; var X_2 = X.a[1]; var X_3 = X.a[2]; var Xm = X.a.length;
  /* 3-1.         もしY=0ならば、X<Yは  偽である。 */
  /* 3-1     */   if(Y.iszero()) return false; 
  /* 3-2.         もしY=ψ_{Y_1}(Y_2,Y_3)を満たすY_1,Y_2,Y_3∈Tが存在するならば、
                                 X<Yは     X_1<Y と同値である。 */
  /* 3-2     */   if(Y.isPT  ()) return lt(X_1,Y); 
  /* 3-3.         ここでY=Y_1+...+Y_{m'}を満たすY_1,...,Y_{m'}∈PT (2≦m'<∞)が存在するとする。 */
  /* 3-3     */   if(Y.isadd ()){ 
  /*         */     var Y_1 = Y.a[0]; var Y_2 = Y.a[1]; var Y_3 = X.a[2]; var Ym = Y.a.length;
  /*         */     var X_2Xm = X.slice(1); /* X_2+X_3+...+Xm */
  /*         */     var Y_2Ym = Y.slice(1); /* Y_2+Y_3+...+Ym */
  /* 3-3-1.         ここでX_1=Y_1とする。 */
  /* 3-3-1   */     if(eq(X_1,Y_1)){
  /* 3-3-1-1.         もしm= 2かつ m'=2ならば、X<Yは   X_2         < Y_2と同値である。            */
  /* 3-3-1-1 */       if(Xm==2 && Ym==2)     return lt(X_2         , Y_2  );
  /* 3-3-1-2.         もしm= 2かつ m'>2ならば、X<Yは   X_2         < Y_2+...+Y_{m'}と同値である。 */
  /* 3-3-1-2 */       if(Xm==2 && Ym> 2)     return lt(X_2         , Y_2Ym);
  /* 3-3-1-3.         もしm> 2かつ m'=2ならば、X<Yは   X_2+...+X_m < Y_2と同値である。            */
  /* 3-3-1-3 */       if(Xm> 2 && Ym==2)     return lt(X_2Xm       , Y_2  );
  /* 3-3-1-4.         もしm> 2かつ m'>2ならば、X<Yは   X_2+...+X_m < Y_2+...+Y_{m'}と同値である。 */
  /* 3-3-1-4 */       if(Xm> 2 && Ym> 2)     return lt(X_2Xm       , Y_2Ym);
  /*         */     }
  /* 3-3-2.         もし   X_1≠Y_1ならば、X<Yは   X_1<Y_1と同値である。 */
  /* 3-3-2   */     if(!eq(X_1 ,Y_1))    return lt(X_1,Y_1);
  /*         */   }
  /*         */ }
}

/* 共終数 */
/* ここでは、共終数という概念を定義する。 */
WeakKkk.prototype.dom=function(){
  var dom = function(A){return A.dom();};
  var lt = WeakKkk.lt;
  var kw = WeakKkk.kw;
  var k0 = WeakKkk.k0;
  var X  = this;
  /* 1.      もし  X=0ならば、dom(X) = 0である。 */
  /* 1       */ if(X.iszero()) return k0;
  /* 2.         ここでX=ψ_{X_1}(X_2,X_3)を満たすX_1,X_2,X_3∈Tが存在するとする。 */
  /* 2       */ if(X.isPT  ()){
  /*         */   var X_1 = X.a[0]; var X_2 = X.a[1]; var X_3 = X.a[2];
  /* 2-1.         ここでdom(X_3)=0とする。 */
  /* 2-1     */   if(   dom(X_3).iszero()){
  /* 2-1-1.        ここでdom(X_2)=0とする。 */
  /* 2-1-1   */     if(  dom(X_2).iszero()){
  /* 2-1-1-1.         もしdom(X_1)=0    または dom(X_1)=$1ならば、dom(X)=Xである。 */
  /* 2-1-1-1 */       if( dom(X_1).iszero() || dom(X_1).isone())  return X ;
  /* 2-1-1-2.         もしdom(X_1)≠0        ,          $1ならば、dom(X)=dom(X_1)である。 */
  /* 2-1-1-2 */       if(!dom(X_1).iszero() &&!dom(X_1).isone())  return dom(X_1);
                    }
  /* 2-1-2.         もしdom(X_2)=$1ならば、dom(X)=Xである。 */
                    if( dom(X_2).isone()) return  X;
  /* 2-1-3.         ここでdom(X_2)≠0       ,            $1とする。 */
  /* 2-1-3   */     if(  !dom(X_2).iszero() && !dom(X_2).isone()){
  /* 2-1-3-1.         もし  dom(X_2)<Xならば、dom(X)=dom(X_2)である。 */
  /* 2-1-3-1 */       if(lt(dom(X_2),X))      return dom(X_2);
  /* 2-1-3-2.         そうでないならば、      dom(X)=$ωである。 */
  /* 2-1-3-2 */       else                    return kw;
  /*         */     }
  /*         */   }
  /* 2-2.         もしdom(X_3)=$1   またはdom(X_3)=$ωならば、dom(X)=$ωである。 */
  /* 2-2     */   if( dom(X_3).isone() || dom(X_3).isw())     return kw;
  /* 2-3.             dom(X_3)≠0       ,            $1      ,            $ωとする。 */
  /* 2-3     */   if(!dom(X_3).iszero() && !dom(X_3).isone() && !dom(X_3).isw()){
  /* 2-3-1.         もし  dom(X_3)<Xならば、dom(X)=dom(X_3)である。 */
  /* 2-3-1   */     if(lt(dom(X_3),X))return       dom(X_3);
  /* 2-3-2.         そうでないならば、dom(X)=$ωである。 */
  /* 2-3-2   */     else              return kw;
  /*         */   }
  /*         */ }
  /* 3.         もしX=X_1+...+X_mを満たすX_1,...,X_m∈PT (2≦m<∞)が存在するならば、*/
  /* 3       */ if(X.isadd()){
  /*              dom(X)= dom(X_  m            )である。 */
                  return  dom(X.a[X.a.length-1]);
                }
  throw new Error("You Died");
  return null;
}

/* 基本列 */
/* ここでは、基本列という概念を先で定義した共終数を用いて定義する。 */
WeakKkk.prototype.expand=function(Y){
  if(!Y instanceof WeakKkk) throw new Error("Y is not WeakKkk object.");
  var dom = function(A){return A.dom();};
  var lt = WeakKkk.lt;
  var k0 = WeakKkk.k0;
  var kw = WeakKkk.kw;
  var X  = this;
  var newk = function(X_1,X_2,X_3){return new WeakKkk(",",[X_1,X_2,X_3]);};
  /* 1.            もしX=0ならば、    X[Y]=0である。 */
                    if(X.iszero()) return k0;
  /* 2. ここでX=ψ_{X_1}(X_2,X_3)を満たすX_1,X_2,X_3∈Tが存在するとする。 */
  /* 2           */ else if(X.isPT  ()){
  /*             */   var X_1 = X.a[0]; var X_2 = X.a[1]; var X_3 = X.a[2];
  /* 2-1.             ここでdom(X_3)=0とする。 */
  /* 2-1         */   if(   dom(X_3).iszero()){
  /* 2-1-1.             ここでdom(X_2)=0とする。 */
  /* 2-1-1       */     if(   dom(X_2).iszero()){
  /* 2-1-1-1.             もしdom(X_1)=0ならば、 X[Y]   =0である。 */
  /* 2-1-1-1     */       if( dom(X_1).iszero()) return k0;
  /* 2-1-1-2.             もしdom(X_1)=$1ならば、X[Y]  = Yである。 */
  /* 2-1-1-2     */       if( dom(X_1).isone ()) return  Y;
  /* 2-1-1-3.             もしdom(X_1)≠0       ,          $1ならば、   X[Y]=ψ_{X_1 [      Y]}(X_2,X_3)である。 */
  /* 2-1-1-3     */       if(!dom(X_1).iszero()&&!dom(X_1).isone())  return newk(X_1.expand(Y), X_2,X_3);
  /*             */     }
  /* 2-1-2.             もしdom(X_2)=$1ならば、X[Y]  =Yである。 */
  /* 2-1-2       */     if(   dom(X_2).isone ()) return Y;
  /* 2-1-3.             ここでdom(X_2)≠0       ,          $1とする。 */
  /* 2-1-3       */     if(  !dom(X_2).iszero()&&!dom(X_2).isone()){
  /* 2-1-3-1.             もし  dom(X_2)<Xならば、X[Y]=ψ_{X_1}(X_2[       Y],X_3)である。 */
  /* 2-1-3-1     */       if(lt(dom(X_2),X))   return newk(X_1, X_2.expand(Y),X_3);
  /* 2-1-3-2.             そうでないならば、dom(X_2)=ψ_{P}(Q,0) (P,Q∈T)とおく。 */
  /* 2-1-3-2     */       else{
  /*             */         var P=dom(X_2).a[0]; 
  /*             */         var Q=dom(X_2).a[1];
  /* 2-1-3-2-1.             ここでQ=0とする。 */
  /* 2-1-3-2-1   */         if(   Q.iszero()){
  /* 2-1-3-2-1-1.             もしY=$h (1≦h<∞)かつ X[Y[0]]=ψ_{X_1}(Γ,X_3)となるΓ∈Tが一意に存在するならば、*/
  /* 2-1-3-2-1-1 */           if(!Y.iszero() && Y.isfinite()){
  /*             */             var Gamma=X.expand(Y.expand(k0)).a[1];
  /* ?????                    X[Y]=ψ_{X_1}(X_2[        ψ_{P       [ 0]}(Γ   ,  0)],X_3)である。 */
  /*             */             return newk(X_1, X_2.expand(newk(P.expand(k0), Gamma, k0)),X_3);
  /*             */           }
  /* 2-1-3-2-1-2.             そうでないならば */
  /*             */           else{
  /*                            X[Y]=   ψ_{X_1}(X_2[        ψ_{P       [ 0]}(Q    ,  0)],X_3)である。 */
  /*             */             return newk(X_1, X_2.expand(newk(P.expand(k0), Q,     k0)),X_3);
  /*             */           }
  /*             */         }
  /* 2-1-3-2-2.             ここでQ≠0とする。 */
  /* 2-1-3-2-2   */         if(  !Q.iszero()){
  /* 2-1-3-2-2-1.             もしY=$h (1≦h<∞)かつ*/ 
  /* 2-1-3-2-2-1 */           if(!Y.iszero() && Y.isfinite()){
  /*                            X[Y[0]]=ψ_{X_1}(Γ,X_3)となるΓ∈Tが一意に存在するならば、 */
  /*             */             var Gamma=X.expand(Y.expand(k0)).a[1];
  /* ?????                 X[Y]=   ψ_{X_1}(X_2       [ ψ_{P}(Q[0],Γ)],X_3)である。 */
  /*             */             return newk(X_1, X_2.expand(newk(P.expand(k0), Q, Gamma)),X_3);
  /*             */           }
  /* 2-1-3-2-2-2.             そうでないならば、 */
  /* 2-1-3-2-2-2 */           else{
  /*                            X[Y]=   ψ_{X_1}(X_2       [ ψ_{P}(Q       [ 0], 0)],X_3)である。*/
  /*             */             return newk(X_1, X_2.expand(newk(P, Q.expand(k0),k0)),X_3);
  /*             */           }
  /*             */         }
  /*             */       }
  /*             */     }
  /*             */   }
  /* 2-2.             ここでdom(X_3)=$1とする。 */
  /* 2-2         */   if(   dom(X_3).isone()){
  /* 2-2-1.             もしY=$1ならば、X[Y]=ψ_{X_1}(X_2,X_3[0])である。 */
  /* 2-2-1       */     if(Y.isone()) return newk(X_1,X_2,X_3.expand(k0));
                        var k=Y.toint();
  /* 2-2-2.             もしY=$k (2≦k<∞)ならば、 */
  /* 2-2-2       */     if(2<=k && k!=-1)
  /* ???               X[Y]=   ψ_{X_1}(X_2,X_3[        0])+
                              ...+ψ_{X_1}(X_2,X_3[        0]) (ψ_{X_1}(X_2,X_3[0])がk個)である。 */
                          return newk(X_1, X_2,X_3.expand(k0)).mul(k);
  /* 2-2-3.             そのいずれでもないならば、X[Y]=0である。 */
  /* 2-2-3       */     else                   return k0;
  /*             */   }
  /* 2-3.             もしdom(X_3)=$ωならば、X[Y]=ψ_{X_1}(X_2,X_3[Y])である。 */
  /* 2-3         */   if( dom(X_3).eq(kw)) return newk(X_1,X_2,X_3.expand(Y));
  /* 2-4.             ここでdom(X_3)≠0        ,           $1,                     $ωとする。 */
  /* 2-4         */   if(  !dom(X_3).iszero() && !dom(X_3).isone() && !dom(X_3).eq(kw)){
  /* 2-4-1.             もしdom(X_3)<   Xならば、X[Y]=ψ_{X_1}(X_2,X_3[       Y])である。 */
  /* 2-4-1       */     if( dom(X_3).lt(X)) return   newk(X_1, X_2,X_3.expand(Y));
  /* 2-4-2.             そうでないならば、dom(X_3)=ψ_{P}(Q,0) (P,Q∈T)とおく。 */
  /* 2-4-2       */     else{
                          var P=dom(X_3).a[0];
                          var Q=dom(X_3).a[1];
                          var h=Y.toint();
  /* 2-4-2-1.             ここでQ=0とする。 */
  /* 2-4-2-1     */       if(Q.iszero()){
  /* 2-4-2-1-1.             もしY=$h (1≦h<∞)かつ*/
  /* 2-4-2-1-1   */         if(1<=h && h!=-1){
  /* ???             ?    X[Y[0]]=ψ_{X_1}(X_2,Γ)となるΓ∈Tが一意に存在するならば、 */
  /*             */           var Gamma=X.expand(Y.expand(k0)).a[2];
  /*                             X[Y]=ψ_{X_1}(X_2,X_3       [ψ_{ P       [0 ]}(Γ   , 0)])である。 */
  /*             */           return newk(X_1, X_2,X_3.expand(newk(P.expand(k0), Gamma,k0)));
  /* 2-4-2-1-2.             そうでないならば、*/
  /* 2-4-2-1-2   */         }else{
  /*                          X[Y]=   ψ_{X_1}(X_2,X_3       [ψ_{ P       [0 ]}(Q     ,0)])である。 */
  /*             */           return newk(X_1, X_2,X_3.expand(newk(P.expand(k0), Q    ,k0)));
  /*             */         }
  /* 2-4-2-2.             ここでQ≠0とする。 */
  /*             */       }
  /* 2-4-2-2     */       if(!Q.iszero()){
  /*             */         var h=Y.toint();
  /* 2-4-2-2-1.             もしY=$h (1≦h<∞)かつ*/
  /* 2-4-2-2-1   */         if( 1<=h && h!=-1){
  /*                          X[Y[0]]=ψ_{X_1}(X_2,Γ)となるΓ∈Tが一意に存在するならば、 */
  /*             */           var Gamma=X.expand(Y.expand(k0)).a[2];
  /* ???              ?   X[Y]=   ψ_{X_1}(X_2,X_3       [ ψ_{P}(Q       [ 0],Γ    )])である。 */
  /*             */           return newk(X_1, X_2,X_3.expand(newk(P, Q.expand(k0), Gamma)));
  /* 2-4-2-2-2.             そうでないならば、*/
  /* 2-4-2-2-2   */         }else{
  /*                          X[Y]=   ψ_{X_1}(X_2,X_3[        ψ_{P}(Q       [0 ],     0)])である。 */
  /*             */           return newk(X_1, X_2,X_3.expand(newk(P, Q.expand(k0),    k0)));
  /*             */         }
  /*             */       }
  /*             */     }
  /*             */   }
  /*             */ }
  /* 3.             ここでX=X_1+...+X_mを満たすX_1,...,X_m∈PT (2≦m<∞)が存在するとする。 */
  /* 3           */ if(X.isadd()){
  /*             */   var m=X.a.length;
                      var X_m_Y          = X.a[m-1].expand(Y);
                      var X_1_t0__X__mm1 = X.slice(0,m-1);
  /* 3-1.             もしX_m[Y]=0        かつm= 2ならば、X[Y]=X_1である。 */
  /* 3-1         */   if( X_m_Y .iszero() &&  m==2)     return X.a[0];
  /* 3-2.             もしX_m[Y]=0        かつm> 2ならば、X[Y]=X_1+...+X_{m-1}である。 */
  /* 3-2         */   if( X_m_Y .iszero() &&  m> 2)     return X_1_t0__X__mm1;
  /* 3-3.             もしX_m[Y]≠0ならば、               X[Y]=X_1+...+X_{m-1}  +        X_m[Y]である。 */
  /* 3-3         */   if(!X_m_Y .iszero())              return X_1_t0__X__mm1  .addright(X_m_Y);
                    }
}

WeakKkk.prototype.countzero=function(){
  var retval=0;
  if(this.iszero()) return 1;
  else{
    for(var i=0;i<this.a.length;i++) retval += this.a[i].countzero();
  }
}
WeakKkk.prototype.isstd=function(){
  var X=this;
  var lt=WeakKkk.lt;
  var lt=WeakKkk.eq;
  if(X.iszero())return true;
  else if(X.isPT()){
    /* make S minimum (0,0,C) which S<X 
       C=((((...(0,0,0),0,0),0,0)...),0,0) */
    var C=WeakKkk.k0;
    var S;
    while(1){
      S=new WeakKkk(",",[0,0,C]);
      if(lt(X,S)){
        break;
      }
      C=new WeakKkk(",",[C,0,0]); //upgrade C
    }
    if(eq(S,X)) return true;
    
    /* apply [0] to S while X.countzero()<S.countzero() */
    Xcountzero = X.countzero();
    while(Xcountzero<S.countzero()){
      S=S.expand(WeakKkk.k0);
    }
    if(eq(S,X)) return true;
    
    
    L=L.expand(n);
    var n=0;
    var L2=L.expand(n);
    while(lt(L2,X)){
      n++;
      L2=L.expand(n);
    }
    if(X.equal(L2))return true;
    L.expand(n+1)
    
  }
  else{ /* + */
    for(var i=0;i<X.a.length-1;i++){
      if(lt(X.a[i],X.a[i+1])return false;
    }
    return true;
  }
}






