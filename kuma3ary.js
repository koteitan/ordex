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
      this.a=[new Kuma3ary("0"), new Kuma3ary("0"), new Kuma3ary("0")];
    return;
    case "w":
      this.t=",";
      this.a=[new Kuma3ary("0"), new Kuma3ary("0"), new Kuma3ary("1")];
    return;
    case "W":
      this.t=",";
      this.a=[new Kuma3ary("0"), new Kuma3ary("1"), new Kuma3ary("0")];
    return;
    case "e":
      this.t=",";
      this.a=[new Kuma3ary("0"), new Kuma3ary("0"), new Kuma3ary("W")];
    return;
    case "z":
      var k=Kuma3ary.parse("(0,0,(0,1,W))");
      this.t=k.t;
      this.a=k.a;
    return;
    case "G":
      var k=Kuma3ary.parse("(0,0,(0,1,(0,1,W)))");
      this.t=k.t;
      this.a=k.a;
    return;
    default:
    break;
  }
  if(isFinite(t)){ //nat
    if(t==0){
      this.t="0";
      this.a=null;
    }else if(t==1){
      this.t=",";
      this.a=[new Kuma3ary("0"), new Kuma3ary("0"), new Kuma3ary("0")];
    }else{
      this.t="+";
      this.a=new Array(parseInt(t));
      for(var i=0;i<this.a.length;i++){
        this.a[i]=new Kuma3ary("1");
      }
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
    
    case "(0,W)": case "(0,0,W)":
    return "e";
    
    case "(0,(0,1,W))": case "(0,0,(0,1,W))":
    return "z";
    
    case "(0,(0,1,(0,1,W)))": case "(0,0,(0,1,(0,1,W)))":
    return "G";
  }
  return str;
}

/* programmer memo: Please put the code as following to make the type Kuma3ary the extension of the type Ordinal. */
/* ------------------0---------------------------------- begin */
Kuma3ary.prototype = Object.create(Ordinal.prototype);
Object.defineProperty(Kuma3ary.prototype, 'constructor', 
  {value:Kuma3ary, enumerable:false, writable:true});
Kuma3ary.parse     = Ordinal.parse;
Kuma3ary.add       = Ordinal.add;
Kuma3ary.cat       = Ordinal.cat;
/* ----------------------------------------------------- end */

Kuma3ary.prototype.normalize = function(){
  Ordinal.prototype.normalize();
  if(this.t==","){
    if(this.a.length==1) this.a=[].concat([Kuma3ary.k0,Kuma3ary.k0],this.a);
    if(this.a.length==2) this.a=[].concat([Kuma3ary.k0            ],this.a);
  }
}
Kuma3ary.prototype.iszero=function(){return this.eq(Kuma3ary.k0);}
Kuma3ary.prototype.isone =function(){return this.eq(Kuma3ary.k1);}
Kuma3ary.prototype.isw   =function(){return this.eq(Kuma3ary.kw);}
Kuma3ary.prototype.isPT  =function(){return this.t==",";}
Kuma3ary.prototype.isadd =function(){return this.t=="+";}
Kuma3ary.prototype.slice =function(s,e){ return new Kuma3ary(this.t, this.a.slice(s,e));}
Kuma3ary.prototype.eq    =function(x){return Kuma3ary.eq(this,x);}
Kuma3ary.prototype.lt    =function(x){return Kuma3ary.lt(this,x);}
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

/** @fn lt(x,y)
  * @brief compare x and y and returns ordering of them.  
  * @param x = Kuma3ary ordinal notation.
  * @param y = Kuma3ary ordinal notation.
  * @returns = {true:x<y, false:x>=y}.
  * */
/*-----------------------------------------------------------------------------
Kanrokoti, "���܂���3�ϐ���", ���吔���� Wiki, 2021-01-03T22:42:55.
  revision 33606, https://googology.wikia.org/ja/wiki/%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%83%96%E3%83%AD%E3%82%B0:Kanrokoti/%E3%81%8F%E3%81%BE%E3%81%8F%E3%81%BE3%E5%A4%89%E6%95%B0%CF%88?oldid=33606
  ---------------------------------------------------------------------------*/
/* ���� �����ł́A�\�L�Ԃ̑召�֌W���`����B */
/* X,Y��T�ɑ΂��A2���֌WX<Y���ȉ��̂悤�ɍċA�I�ɒ�߂�: */
Kuma3ary.lt=function(X,Y){
  if(!X instanceof Kuma3ary) throw new Error("X is not Kuma3ary object.");
  if(!Y instanceof Kuma3ary) throw new Error("Y is not Kuma3ary object.");
  var eq = Kuma3ary.eq;
  var lt = Kuma3ary.lt;
  /* 1.         ����X=0�Ȃ�΁AX<Y��  Y��0�Ɠ��l�ł���B */
  /* 1       */ if(X.iszero()) return !Y.iszero();
  /* 2.         ������X=��_{X_1}(X_2,X_3)�𖞂���X_1,X_2,X_3��T�����݂���Ƃ���B */
  /* 2       */ if(X.isPT  ()){
  /*         */   var X_1 = X.a[0]; var X_2 = X.a[1]; var X_3 = X.a[2];
  /* 2-1.         ����Y=0�Ȃ�΁AX<Y��  �U�ł���B */
  /* 2-1     */   if(Y.iszero()) return false;
  /* 2-2.         ������Y=��_{Y_1}(Y_2,Y_3)�𖞂���Y_1,Y_2,Y_3��T�����݂���Ƃ���B */
  /* 2-2     */   if(Y.isPT()){
  /*         */     var Y_1 = Y.a[0]; var Y_2 = Y.a[1]; var Y_3 = Y.a[2];
  /* 2-2-1.         ����   X_1= Y_1 ����    X_2=Y_2 �Ȃ�΁AX<Y��     X_3<Y_3�Ɠ��l�ł���B*/
  /* 2-2-1   */     if( eq(X_1, Y_1) &&  eq(X_2,Y_2))       return lt(X_3,Y_3);
  /* 2-2-2.         ����   X_1= Y_1 ����    X_2��Y_2�Ȃ�΁AX<Y��     X_2<Y_2�Ɠ��l�ł���B*/
  /* 2-2-2   */     if( eq(X_1, Y_1) && !eq(X_2,Y_2))       return lt(X_2,Y_2);
  /* 2-2-3.         ����   X_1��Y_1�Ȃ�΁A                 X<Y��     X_1<Y_1�Ɠ��l�ł���B */
  /* 2-2-3   */     if(!eq(X_1, Y_1)                )       return lt(X_1,Y_1);
  /*         */   }
  /* 2-3.         ����Y=Y_1+...+Y_{m'}�𖞂���Y_1,...,Y_{m'}��PT (2��m'<��)�����݂���Ȃ�΁A */
  /* 2-3     */   if(Y.isadd()){
  /*         */     var Y_1 = Y.a[0]; var Y_2 = Y.a[1]; var Y_3 = Y.a[2];
  /* ??           X<Y��     X=Y_1  �܂��� X<Y_1�Ɠ��l�ł���B */
  /*         */     return eq(X,Y_1) ||  lt(X,Y_1);
  /*         */   }
  /*         */ }
  /* 3.         ������X=X_1+...+X_m�𖞂���X_1,...,X_m��PT (2��m<��)�����݂���Ƃ���B */
  /* 3       */ if(X.isadd()){
  /*         */   var X_1 = X.a[0]; var X_2 = X.a[1]; var X_3 = X.a[2]; var Xm = X.a.length;
  /* 3-1.         ����Y=0�Ȃ�΁AX<Y��  �U�ł���B */
  /* 3-1     */   if(Y.iszero()) return false; 
  /* 3-2.         ����Y=��_{Y_1}(Y_2,Y_3)�𖞂���Y_1,Y_2,Y_3��T�����݂���Ȃ�΁A
                                 X<Y��     X_1<Y �Ɠ��l�ł���B */
  /* 3-2     */   if(Y.isPT  ()) return lt(X_1,Y); 
  /* 3-3.         ������Y=Y_1+...+Y_{m'}�𖞂���Y_1,...,Y_{m'}��PT (2��m'<��)�����݂���Ƃ���B */
  /* 3-3     */   if(Y.isadd ()){ 
  /*         */     var Y_1 = Y.a[0]; var Y_2 = Y.a[1]; var Y_3 = X.a[2]; var Ym = Y.a.length;
  /*         */     var X_2Xm = X.slice(1); /* X_2+X_3+...+Xm */
  /*         */     var Y_2Ym = Y.slice(1); /* Y_2+Y_3+...+Ym */
  /* 3-3-1.         ������X_1=Y_1�Ƃ���B */
  /* 3-3-1   */     if(eq(X_1,Y_1)){
  /* 3-3-1-1.         ����m= 2���� m'=2�Ȃ�΁AX<Y��   X_2         < Y_2�Ɠ��l�ł���B            */
  /* 3-3-1-1 */       if(Xm==2 && Ym==2)     return lt(X_2         , Y_2  );
  /* 3-3-1-2.         ����m= 2���� m'>2�Ȃ�΁AX<Y��   X_2         < Y_2+...+Y_{m'}�Ɠ��l�ł���B */
  /* 3-3-1-2 */       if(Xm==2 && Ym> 2)     return lt(X_2         , Y_2Ym);
  /* 3-3-1-3.         ����m> 2���� m'=2�Ȃ�΁AX<Y��   X_2+...+X_m < Y_2�Ɠ��l�ł���B            */
  /* 3-3-1-3 */       if(Xm> 2 && Ym==2)     return lt(X_2Xm       , Y_2  );
  /* 3-3-1-4.         ����m> 2���� m'>2�Ȃ�΁AX<Y��   X_2+...+X_m < Y_2+...+Y_{m'}�Ɠ��l�ł���B */
  /* 3-3-1-4 */       if(Xm> 2 && Ym> 2)     return lt(X_2Xm       , Y_2Ym);
  /*         */     }
  /* 3-3-2.         ����   X_1��Y_1�Ȃ�΁AX<Y��   X_1<Y_1�Ɠ��l�ł���B */
  /* 3-3-2   */     if(!eq(X_1 ,Y_1))    return lt(X_1,Y_1);
  /*         */   }
  /*         */ }
}

/* ���I�� */
/* �����ł́A���I���Ƃ����T�O���`����B */
Kuma3ary.prototype.dom=function(){
  var dom = function(A){return A.dom();};
  var lt = Kuma3ary.lt;
  var kw = Kuma3ary.kw;
  var k0 = Kuma3ary.k0;
  var X  = this;
  /* 1.      ����  X=0�Ȃ�΁Adom(X) = 0�ł���B */
  /* 1       */ if(X.iszero()) return k0;
  /* 2.         ������X=��_{X_1}(X_2,X_3)�𖞂���X_1,X_2,X_3��T�����݂���Ƃ���B */
  /* 2       */ if(X.isPT  ()){
  /*         */   var X_1 = X.a[0]; var X_2 = X.a[1]; var X_3 = X.a[2];
  /* 2-1.         ������dom(X_3)=0�Ƃ���B */
  /* 2-1     */   if(   dom(X_3).iszero()){
  /* 2-1-1.        ������dom(X_2)=0�Ƃ���B */
  /* 2-1-1   */     if(  dom(X_2).iszero()){
  /* 2-1-1-1.         ����dom(X_1)=0    �܂��� dom(X_1)=$1�Ȃ�΁Adom(X)=X�ł���B */
  /* 2-1-1-1 */       if( dom(X_1).iszero() || dom(X_1).isone())  return X ;
  /* 2-1-1-2.         ����dom(X_1)��0        ,          $1�Ȃ�΁Adom(X)=dom(X_1)�ł���B */
  /* 2-1-1-2 */       if(!dom(X_1).iszero() &&!dom(X_1).isone())  return dom(X_1);
                    }
  /* 2-1-2.         ����dom(X_2)=$1�Ȃ�΁Adom(X)=X�ł���B */
                    if( dom(X_2).isone()) return  X;
  /* 2-1-3.         ������dom(X_2)��0       ,            $1�Ƃ���B */
  /* 2-1-3   */     if(  !dom(X_2).iszero() && !dom(X_2).isone()){
  /* 2-1-3-1.         ����  dom(X_2)<X�Ȃ�΁Adom(X)=dom(X_2)�ł���B */
  /* 2-1-3-1 */       if(lt(dom(X_2),X))      return dom(X_2);
  /* 2-1-3-2.         �����łȂ��Ȃ�΁A      dom(X)=$�ւł���B */
  /* 2-1-3-2 */       else                    return kw;
  /*         */     }
  /*         */   }
  /* 2-2.         ����dom(X_3)=$1   �܂���dom(X_3)=$�ւȂ�΁Adom(X)=$�ւł���B */
  /* 2-2     */   if( dom(X_3).isone() || dom(X_3).isw())     return kw;
  /* 2-3.             dom(X_3)��0       ,            $1      ,            $�ւƂ���B */
  /* 2-3     */   if(!dom(X_3).iszero() && !dom(X_3).isone() && !dom(X_3).isw()){
  /* 2-3-1.         ����  dom(X_3)<X�Ȃ�΁Adom(X)=dom(X_3)�ł���B */
  /* 2-3-1   */     if(lt(dom(X_3),X))return       dom(X_3);
  /* 2-3-2.         �����łȂ��Ȃ�΁Adom(X)=$�ւł���B */
  /* 2-3-2   */     else              return kw;
  /*         */   }
  /*         */ }
  /* 3.         ����X=X_1+...+X_m�𖞂���X_1,...,X_m��PT (2��m<��)�����݂���Ȃ�΁A*/
  /* 3       */ if(X.isadd()){
  /*              dom(X)= dom(X_  m            )�ł���B */
                  return  dom(X.a[X.a.length-1]);
                }
  throw new Error("You Died");
  return null;
}

/* ��{�� */
/* �����ł́A��{��Ƃ����T�O���Œ�`�������I����p���Ē�`����B */
Kuma3ary.prototype.expand=function(Y){
  if(!Y instanceof Kuma3ary) throw new Error("Y is not Kuma3ary object.");
  var dom = function(A){return A.dom();};
  var lt = Kuma3ary.lt;
  var k0 = Kuma3ary.k0;
  var kw = Kuma3ary.kw;
  var X  = this;
  var newk = function(X_1,X_2,X_3){return new Kuma3ary(",",[X_1,X_2,X_3]);};
  /* 1.            ����X=0�Ȃ�΁A    X[Y]=0�ł���B */
                    if(X.iszero()) return k0;
  /* 2. ������X=��_{X_1}(X_2,X_3)�𖞂���X_1,X_2,X_3��T�����݂���Ƃ���B */
  /* 2           */ else if(X.isPT  ()){
  /*             */   var X_1 = X.a[0]; var X_2 = X.a[1]; var X_3 = X.a[2];
  /* 2-1.             ������dom(X_3)=0�Ƃ���B */
  /* 2-1         */   if(   dom(X_3).iszero()){
  /* 2-1-1.             ������dom(X_2)=0�Ƃ���B */
  /* 2-1-1       */     if(   dom(X_2).iszero()){
  /* 2-1-1-1.             ����dom(X_1)=0�Ȃ�΁A X[Y]   =0�ł���B */
  /* 2-1-1-1     */       if( dom(X_1).iszero()) return k0;
  /* 2-1-1-2.             ����dom(X_1)=$1�Ȃ�΁AX[Y]  = Y�ł���B */
  /* 2-1-1-2     */       if( dom(X_1).isone ()) return  Y;
  /* 2-1-1-3.             ����dom(X_1)��0       ,          $1�Ȃ�΁A   X[Y]=��_{X_1 [      Y]}(X_2,X_3)�ł���B */
  /* 2-1-1-3     */       if(!dom(X_1).iszero()&&!dom(X_1).isone())  return newk(X_1.expand(Y), X_2,X_3);
  /*             */     }
  /* 2-1-2.             ����dom(X_2)=$1�Ȃ�΁AX[Y]  =Y�ł���B */
  /* 2-1-2       */     if(   dom(X_2).isone ()) return Y;
  /* 2-1-3.             ������dom(X_2)��0       ,          $1�Ƃ���B */
  /* 2-1-3       */     if(  !dom(X_2).iszero()&&!dom(X_2).isone()){
  /* 2-1-3-1.             ����  dom(X_2)<X�Ȃ�΁AX[Y]=��_{X_1}(X_2[       Y],X_3)�ł���B */
  /* 2-1-3-1     */       if(lt(dom(X_2),X))   return newk(X_1, X_2.expand(Y),X_3);
  /* 2-1-3-2.             �����łȂ��Ȃ�΁Adom(X_2)=��_{P}(Q,0) (P,Q��T)�Ƃ����B */
  /* 2-1-3-2     */       else{
  /*             */         var P=dom(X_2).a[0]; 
  /*             */         var Q=dom(X_2).a[1];
  /* 2-1-3-2-1.             ������Q=0�Ƃ���B */
  /* 2-1-3-2-1   */         if(   Q.iszero()){
  /* 2-1-3-2-1-1.             ����Y=$h (1��h<��)���� X[Y[0]]=��_{X_1}(��,X_3)�ƂȂ郡��T����ӂɑ��݂���Ȃ�΁A*/
  /* 2-1-3-2-1-1 */           if(!Y.iszero() && Y.isfinite()){
  /*             */             var Gamma=X.expand(Y.expand(k0)).a[1];
  /* ?????                    X[Y]=��_{X_1}(X_2[        ��_{P       [ 0]}(��   ,  0)],X_3)�ł���B */
  /*             */             return newk(X_1, X_2.expand(newk(P.expand(k0), Gamma, k0)),X_3);
  /*             */           }
  /* 2-1-3-2-1-2.             �����łȂ��Ȃ�� */
  /*             */           else{
  /*                            X[Y]=   ��_{X_1}(X_2[        ��_{P       [ 0]}(Q    ,  0)],X_3)�ł���B */
  /*             */             return newk(X_1, X_2.expand(newk(P.expand(k0), Q,     k0)),X_3);
  /*             */           }
  /*             */         }
  /* 2-1-3-2-2.             ������Q��0�Ƃ���B */
  /* 2-1-3-2-2   */         if(  !Q.iszero()){
  /* 2-1-3-2-2-1.             ����Y=$h (1��h<��)����*/ 
  /* 2-1-3-2-2-1 */           if(!Y.iszero() && Y.isfinite()){
  /*                            X[Y[0]]=��_{X_1}(��,X_3)�ƂȂ郡��T����ӂɑ��݂���Ȃ�΁A */
  /*             */             var Gamma=X.expand(Y.expand(k0)).a[1];
  /* ?????                 X[Y]=   ��_{X_1}(X_2       [ ��_{P}(Q[0],��)],X_3)�ł���B */
  /*             */             return newk(X_1, X_2.expand(newk(P.expand(k0), Q, Gamma)),X_3);
  /*             */           }
  /* 2-1-3-2-2-2.             �����łȂ��Ȃ�΁A */
  /* 2-1-3-2-2-2 */           else{
  /*                            X[Y]=   ��_{X_1}(X_2       [ ��_{P}(Q       [ 0], 0)],X_3)�ł���B*/
  /*             */             return newk(X_1, X_2.expand(newk(P, Q.expand(k0),k0)),X_3);
  /*             */           }
  /*             */         }
  /*             */       }
  /*             */     }
  /*             */   }
  /* 2-2.             ������dom(X_3)=$1�Ƃ���B */
  /* 2-2         */   if(   dom(X_3).isone()){
  /* 2-2-1.             ����Y=$1�Ȃ�΁AX[Y]=��_{X_1}(X_2,X_3[0])�ł���B */
  /* 2-2-1       */     if(Y.isone()) return newk(X_1,X_2,X_3.expand(k0));
                        var k=Y.toint();
  /* 2-2-2.             ����Y=$k (2��k<��)�Ȃ�΁A */
  /* 2-2-2       */     if(2<=k && k!=-1)
  /* ???               X[Y]=   ��_{X_1}(X_2,X_3[        0])+
                              ...+��_{X_1}(X_2,X_3[        0]) (��_{X_1}(X_2,X_3[0])��k��)�ł���B */
                          return newk(X_1, X_2,X_3.expand(k0)).mul(k);
  /* 2-2-3.             ���̂�����ł��Ȃ��Ȃ�΁AX[Y]=0�ł���B */
  /* 2-2-3       */     else                   return k0;
  /*             */   }
  /* 2-3.             ����dom(X_3)=$�ւȂ�΁AX[Y]=��_{X_1}(X_2,X_3[Y])�ł���B */
  /* 2-3         */   if( dom(X_3).eq(kw)) return newk(X_1,X_2,X_3.expand(Y));
  /* 2-4.             ������dom(X_3)��0        ,           $1,                     $�ւƂ���B */
  /* 2-4         */   if(  !dom(X_3).iszero() && !dom(X_3).isone() && !dom(X_3).eq(kw)){
  /* 2-4-1.             ����dom(X_3)<   X�Ȃ�΁AX[Y]=��_{X_1}(X_2,X_3[       Y])�ł���B */
  /* 2-4-1       */     if( dom(X_3).lt(X)) return   newk(X_1, X_2,X_3.expand(Y));
  /* 2-4-2.             �����łȂ��Ȃ�΁Adom(X_3)=��_{P}(Q,0) (P,Q��T)�Ƃ����B */
  /* 2-4-2       */     else{
                          var P=dom(X_3).a[0];
                          var Q=dom(X_3).a[1];
                          var h=Y.toint();
  /* 2-4-2-1.             ������Q=0�Ƃ���B */
  /* 2-4-2-1     */       if(Q.iszero()){
  /* 2-4-2-1-1.             ����Y=$h (1��h<��)����*/
  /* 2-4-2-1-1   */         if(1<=h && h!=-1){
  /* ???             ?    X[Y[0]]=��_{X_1}(X_2,��)�ƂȂ郡��T����ӂɑ��݂���Ȃ�΁A */
  /*             */           var Gamma=X.expand(Y.expand(k0)).a[2];
  /*                             X[Y]=��_{X_1}(X_2,X_3       [��_{ P       [0 ]}(��   , 0)])�ł���B */
  /*             */           return newk(X_1, X_2,X_3.expand(newk(P.expand(k0), Gamma,k0)));
  /* 2-4-2-1-2.             �����łȂ��Ȃ�΁A*/
  /* 2-4-2-1-2   */         }else{
  /*                          X[Y]=   ��_{X_1}(X_2,X_3       [��_{ P       [0 ]}(Q     ,0)])�ł���B */
  /*             */           return newk(X_1, X_2,X_3.expand(newk(P.expand(k0), Q    ,k0)));
  /*             */         }
  /* 2-4-2-2.             ������Q��0�Ƃ���B */
  /*             */       }
  /* 2-4-2-2     */       if(!Q.iszero()){
  /*             */         var h=Y.toint();
  /* 2-4-2-2-1.             ����Y=$h (1��h<��)����*/
  /* 2-4-2-2-1   */         if( 1<=h && h!=-1){
  /*                          X[Y[0]]=��_{X_1}(X_2,��)�ƂȂ郡��T����ӂɑ��݂���Ȃ�΁A */
  /*             */           var Gamma=X.expand(Y.expand(k0)).a[2];
  /* ???              ?   X[Y]=   ��_{X_1}(X_2,X_3       [ ��_{P}(Q       [ 0],��    )])�ł���B */
  /*             */           return newk(X_1, X_2,X_3.expand(newk(P, Q.expand(k0), Gamma)));
  /* 2-4-2-2-2.             �����łȂ��Ȃ�΁A*/
  /* 2-4-2-2-2   */         }else{
  /*                          X[Y]=   ��_{X_1}(X_2,X_3[        ��_{P}(Q       [0 ],     0)])�ł���B */
  /*             */           return newk(X_1, X_2,X_3.expand(newk(P, Q.expand(k0),    k0)));
  /*             */         }
  /*             */       }
  /*             */     }
  /*             */   }
  /*             */ }
  /* 3.             ������X=X_1+...+X_m�𖞂���X_1,...,X_m��PT (2��m<��)�����݂���Ƃ���B */
  /* 3           */ if(X.isadd()){
  /*             */   var m=X.a.length;
                      var X_m_Y          = X.a[m-1].expand(Y);
                      var X_1_t0__X__mm1 = X.slice(0,m-1);
  /* 3-1.             ����X_m[Y]=0        ����m= 2�Ȃ�΁AX[Y]=X_1�ł���B */
  /* 3-1         */   if( X_m_Y .iszero() &&  m==2)     return X.a[0];
  /* 3-2.             ����X_m[Y]=0        ����m> 2�Ȃ�΁AX[Y]=X_1+...+X_{m-1}�ł���B */
  /* 3-2         */   if( X_m_Y .iszero() &&  m> 2)     return X_1_t0__X__mm1;
  /* 3-3.             ����X_m[Y]��0�Ȃ�΁A               X[Y]=X_1+...+X_{m-1}  +        X_m[Y]�ł���B */
  /* 3-3         */   if(!X_m_Y .iszero())              return X_1_t0__X__mm1  .addright(X_m_Y);
                    }
}

Kuma3ary.prototype.countzero=function(){
  var retval=0;
  if(this.iszero()) return 1;
  else{
    for(var i=0;i<this.a.length;i++) retval += this.a[i].countzero();
  }
}
Kuma3ary.prototype.isstd=function(){
  var X=this;
  var lt=Kuma3ary.lt;
  var lt=Kuma3ary.eq;
  if(X.iszero())return true;
  else if(X.isPT()){
    /* make S minimum (0,0,C) which S<X 
       C=((((...(0,0,0),0,0),0,0)...),0,0) */
    var C=Kuma3ary.k0;
    var S;
    while(1){
      S=new Kuma3ary(",",[0,0,C]);
      if(lt(X,S)){
        break;
      }
      C=new Kuma3ary(",",[C,0,0]); //upgrade C
    }
    if(eq(S,X)) return true;
    
    /* apply [0] to S while X.countzero()<S.countzero() */
    Xcountzero = X.countzero();
    while(Xcountzero<S.countzero()){
      S=S.expand(Kuma3ary.k0);
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
      if(lt(X.a[i],X.a[i+1]))return false;
    }
    return true;
  }
}






