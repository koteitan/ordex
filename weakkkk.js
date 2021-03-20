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
Kanrokoti, "���ޤ���3�ѿ���", ��������� Wiki, 2021-01-03T22:42:55.
  revision 33606, https://googology.wikia.org/ja/wiki/%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%83%96%E3%83%AD%E3%82%B0:Kanrokoti/%E3%81%8F%E3%81%BE%E3%81%8F%E3%81%BE3%E5%A4%89%E6%95%B0%CF%88?oldid=33606
  ---------------------------------------------------------------------------*/
/* ��� �����Ǥϡ�ɽ���֤��羮�ط���������롣 */
/* X,Y��T���Ф���2��ط�X<Y��ʲ��Τ褦�˺Ƶ�Ū������: */
WeakKkk.lt=function(X,Y){
  if(!X instanceof WeakKkk) throw new Error("X is not WeakKkk object.");
  if(!Y instanceof WeakKkk) throw new Error("Y is not WeakKkk object.");
  var eq = WeakKkk.eq;
  var lt = WeakKkk.lt;
  /* 1.         �⤷X=0�ʤ�С�X<Y��  Y��0��Ʊ�ͤǤ��롣 */
  /* 1       */ if(X.iszero()) return !Y.iszero();
  /* 2.         ������X=��_{X_1}(X_2,X_3)��������X_1,X_2,X_3��T��¸�ߤ���Ȥ��롣 */
  /* 2       */ if(X.isPT  ()){
  /*         */   var X_1 = X.a[0]; var X_2 = X.a[1]; var X_3 = X.a[2];
  /* 2-1.         �⤷Y=0�ʤ�С�X<Y��  ���Ǥ��롣 */
  /* 2-1     */   if(Y.iszero()) return false;
  /* 2-2.         ������Y=��_{Y_1}(Y_2,Y_3)��������Y_1,Y_2,Y_3��T��¸�ߤ���Ȥ��롣 */
  /* 2-2     */   if(Y.isPT()){
  /*         */     var Y_1 = Y.a[0]; var Y_2 = Y.a[1]; var Y_3 = Y.a[2];
  /* 2-2-1.         �⤷   X_1= Y_1 ����    X_2=Y_2 �ʤ�С�X<Y��     X_3<Y_3��Ʊ�ͤǤ��롣*/
  /* 2-2-1   */     if( eq(X_1, Y_1) &&  eq(X_2,Y_2))       return lt(X_3,Y_3);
  /* 2-2-2.         �⤷   X_1= Y_1 ����    X_2��Y_2�ʤ�С�X<Y��     X_2<Y_2��Ʊ�ͤǤ��롣*/
  /* 2-2-2   */     if( eq(X_1, Y_1) && !eq(X_2,Y_2))       return lt(X_2,Y_2);
  /* 2-2-3.         �⤷   X_1��Y_1�ʤ�С�                 X<Y��     X_1<Y_1��Ʊ�ͤǤ��롣 */
  /* 2-2-3   */     if(!eq(X_1, Y_1)                )       return lt(X_1,Y_1);
  /*         */   }
  /* 2-3.         �⤷Y=Y_1+...+Y_{m'}��������Y_1,...,Y_{m'}��PT (2��m'<��)��¸�ߤ���ʤ�С� */
  /* 2-3     */   if(Y.isadd()){
  /*         */     var Y_1 = Y.a[0]; var Y_2 = Y.a[1]; var Y_3 = Y.a[2];
  /* ??           X<Y��     X=Y_1  �ޤ��� X<Y_1��Ʊ�ͤǤ��롣 */
  /*         */     return eq(X,Y_1) ||  lt(X,Y_1);
  /*         */   }
  /*         */ }
  /* 3.         ������X=X_1+...+X_m��������X_1,...,X_m��PT (2��m<��)��¸�ߤ���Ȥ��롣 */
  /* 3       */ if(X.isadd()){
  /*         */   var X_1 = X.a[0]; var X_2 = X.a[1]; var X_3 = X.a[2]; var Xm = X.a.length;
  /* 3-1.         �⤷Y=0�ʤ�С�X<Y��  ���Ǥ��롣 */
  /* 3-1     */   if(Y.iszero()) return false; 
  /* 3-2.         �⤷Y=��_{Y_1}(Y_2,Y_3)��������Y_1,Y_2,Y_3��T��¸�ߤ���ʤ�С�
                                 X<Y��     X_1<Y ��Ʊ�ͤǤ��롣 */
  /* 3-2     */   if(Y.isPT  ()) return lt(X_1,Y); 
  /* 3-3.         ������Y=Y_1+...+Y_{m'}��������Y_1,...,Y_{m'}��PT (2��m'<��)��¸�ߤ���Ȥ��롣 */
  /* 3-3     */   if(Y.isadd ()){ 
  /*         */     var Y_1 = Y.a[0]; var Y_2 = Y.a[1]; var Y_3 = X.a[2]; var Ym = Y.a.length;
  /*         */     var X_2Xm = X.slice(1); /* X_2+X_3+...+Xm */
  /*         */     var Y_2Ym = Y.slice(1); /* Y_2+Y_3+...+Ym */
  /* 3-3-1.         ������X_1=Y_1�Ȥ��롣 */
  /* 3-3-1   */     if(eq(X_1,Y_1)){
  /* 3-3-1-1.         �⤷m= 2���� m'=2�ʤ�С�X<Y��   X_2         < Y_2��Ʊ�ͤǤ��롣            */
  /* 3-3-1-1 */       if(Xm==2 && Ym==2)     return lt(X_2         , Y_2  );
  /* 3-3-1-2.         �⤷m= 2���� m'>2�ʤ�С�X<Y��   X_2         < Y_2+...+Y_{m'}��Ʊ�ͤǤ��롣 */
  /* 3-3-1-2 */       if(Xm==2 && Ym> 2)     return lt(X_2         , Y_2Ym);
  /* 3-3-1-3.         �⤷m> 2���� m'=2�ʤ�С�X<Y��   X_2+...+X_m < Y_2��Ʊ�ͤǤ��롣            */
  /* 3-3-1-3 */       if(Xm> 2 && Ym==2)     return lt(X_2Xm       , Y_2  );
  /* 3-3-1-4.         �⤷m> 2���� m'>2�ʤ�С�X<Y��   X_2+...+X_m < Y_2+...+Y_{m'}��Ʊ�ͤǤ��롣 */
  /* 3-3-1-4 */       if(Xm> 2 && Ym> 2)     return lt(X_2Xm       , Y_2Ym);
  /*         */     }
  /* 3-3-2.         �⤷   X_1��Y_1�ʤ�С�X<Y��   X_1<Y_1��Ʊ�ͤǤ��롣 */
  /* 3-3-2   */     if(!eq(X_1 ,Y_1))    return lt(X_1,Y_1);
  /*         */   }
  /*         */ }
}

/* ������ */
/* �����Ǥϡ��������Ȥ�����ǰ��������롣 */
WeakKkk.prototype.dom=function(){
  var dom = function(A){return A.dom();};
  var lt = WeakKkk.lt;
  var kw = WeakKkk.kw;
  var k0 = WeakKkk.k0;
  var X  = this;
  /* 1.      �⤷  X=0�ʤ�С�dom(X) = 0�Ǥ��롣 */
  /* 1       */ if(X.iszero()) return k0;
  /* 2.         ������X=��_{X_1}(X_2,X_3)��������X_1,X_2,X_3��T��¸�ߤ���Ȥ��롣 */
  /* 2       */ if(X.isPT  ()){
  /*         */   var X_1 = X.a[0]; var X_2 = X.a[1]; var X_3 = X.a[2];
  /* 2-1.         ������dom(X_3)=0�Ȥ��롣 */
  /* 2-1     */   if(   dom(X_3).iszero()){
  /* 2-1-1.        ������dom(X_2)=0�Ȥ��롣 */
  /* 2-1-1   */     if(  dom(X_2).iszero()){
  /* 2-1-1-1.         �⤷dom(X_1)=0    �ޤ��� dom(X_1)=$1�ʤ�С�dom(X)=X�Ǥ��롣 */
  /* 2-1-1-1 */       if( dom(X_1).iszero() || dom(X_1).isone())  return X ;
  /* 2-1-1-2.         �⤷dom(X_1)��0        ,          $1�ʤ�С�dom(X)=dom(X_1)�Ǥ��롣 */
  /* 2-1-1-2 */       if(!dom(X_1).iszero() &&!dom(X_1).isone())  return dom(X_1);
                    }
  /* 2-1-2.         �⤷dom(X_2)=$1�ʤ�С�dom(X)=X�Ǥ��롣 */
                    if( dom(X_2).isone()) return  X;
  /* 2-1-3.         ������dom(X_2)��0       ,            $1�Ȥ��롣 */
  /* 2-1-3   */     if(  !dom(X_2).iszero() && !dom(X_2).isone()){
  /* 2-1-3-1.         �⤷  dom(X_2)<X�ʤ�С�dom(X)=dom(X_2)�Ǥ��롣 */
  /* 2-1-3-1 */       if(lt(dom(X_2),X))      return dom(X_2);
  /* 2-1-3-2.         �����Ǥʤ��ʤ�С�      dom(X)=$�ؤǤ��롣 */
  /* 2-1-3-2 */       else                    return kw;
  /*         */     }
  /*         */   }
  /* 2-2.         �⤷dom(X_3)=$1   �ޤ���dom(X_3)=$�ؤʤ�С�dom(X)=$�ؤǤ��롣 */
  /* 2-2     */   if( dom(X_3).isone() || dom(X_3).isw())     return kw;
  /* 2-3.             dom(X_3)��0       ,            $1      ,            $�ؤȤ��롣 */
  /* 2-3     */   if(!dom(X_3).iszero() && !dom(X_3).isone() && !dom(X_3).isw()){
  /* 2-3-1.         �⤷  dom(X_3)<X�ʤ�С�dom(X)=dom(X_3)�Ǥ��롣 */
  /* 2-3-1   */     if(lt(dom(X_3),X))return       dom(X_3);
  /* 2-3-2.         �����Ǥʤ��ʤ�С�dom(X)=$�ؤǤ��롣 */
  /* 2-3-2   */     else              return kw;
  /*         */   }
  /*         */ }
  /* 3.         �⤷X=X_1+...+X_m��������X_1,...,X_m��PT (2��m<��)��¸�ߤ���ʤ�С�*/
  /* 3       */ if(X.isadd()){
  /*              dom(X)= dom(X_  m            )�Ǥ��롣 */
                  return  dom(X.a[X.a.length-1]);
                }
  throw new Error("You Died");
  return null;
}

/* ������ */
/* �����Ǥϡ�������Ȥ�����ǰ���������������������Ѥ���������롣 */
WeakKkk.prototype.expand=function(Y){
  if(!Y instanceof WeakKkk) throw new Error("Y is not WeakKkk object.");
  var dom = function(A){return A.dom();};
  var lt = WeakKkk.lt;
  var k0 = WeakKkk.k0;
  var kw = WeakKkk.kw;
  var X  = this;
  var newk = function(X_1,X_2,X_3){return new WeakKkk(",",[X_1,X_2,X_3]);};
  /* 1.            �⤷X=0�ʤ�С�    X[Y]=0�Ǥ��롣 */
                    if(X.iszero()) return k0;
  /* 2. ������X=��_{X_1}(X_2,X_3)��������X_1,X_2,X_3��T��¸�ߤ���Ȥ��롣 */
  /* 2           */ else if(X.isPT  ()){
  /*             */   var X_1 = X.a[0]; var X_2 = X.a[1]; var X_3 = X.a[2];
  /* 2-1.             ������dom(X_3)=0�Ȥ��롣 */
  /* 2-1         */   if(   dom(X_3).iszero()){
  /* 2-1-1.             ������dom(X_2)=0�Ȥ��롣 */
  /* 2-1-1       */     if(   dom(X_2).iszero()){
  /* 2-1-1-1.             �⤷dom(X_1)=0�ʤ�С� X[Y]   =0�Ǥ��롣 */
  /* 2-1-1-1     */       if( dom(X_1).iszero()) return k0;
  /* 2-1-1-2.             �⤷dom(X_1)=$1�ʤ�С�X[Y]  = Y�Ǥ��롣 */
  /* 2-1-1-2     */       if( dom(X_1).isone ()) return  Y;
  /* 2-1-1-3.             �⤷dom(X_1)��0       ,          $1�ʤ�С�   X[Y]=��_{X_1 [      Y]}(X_2,X_3)�Ǥ��롣 */
  /* 2-1-1-3     */       if(!dom(X_1).iszero()&&!dom(X_1).isone())  return newk(X_1.expand(Y), X_2,X_3);
  /*             */     }
  /* 2-1-2.             �⤷dom(X_2)=$1�ʤ�С�X[Y]  =Y�Ǥ��롣 */
  /* 2-1-2       */     if(   dom(X_2).isone ()) return Y;
  /* 2-1-3.             ������dom(X_2)��0       ,          $1�Ȥ��롣 */
  /* 2-1-3       */     if(  !dom(X_2).iszero()&&!dom(X_2).isone()){
  /* 2-1-3-1.             �⤷  dom(X_2)<X�ʤ�С�X[Y]=��_{X_1}(X_2[       Y],X_3)�Ǥ��롣 */
  /* 2-1-3-1     */       if(lt(dom(X_2),X))   return newk(X_1, X_2.expand(Y),X_3);
  /* 2-1-3-2.             �����Ǥʤ��ʤ�С�dom(X_2)=��_{P}(Q,0) (P,Q��T)�Ȥ����� */
  /* 2-1-3-2     */       else{
  /*             */         var P=dom(X_2).a[0]; 
  /*             */         var Q=dom(X_2).a[1];
  /* 2-1-3-2-1.             ������Q=0�Ȥ��롣 */
  /* 2-1-3-2-1   */         if(   Q.iszero()){
  /* 2-1-3-2-1-1.             �⤷Y=$h (1��h<��)���� X[Y[0]]=��_{X_1}(��,X_3)�Ȥʤ릣��T����դ�¸�ߤ���ʤ�С�*/
  /* 2-1-3-2-1-1 */           if(!Y.iszero() && Y.isfinite()){
  /*             */             var Gamma=X.expand(Y.expand(k0)).a[1];
  /* ?????                    X[Y]=��_{X_1}(X_2[        ��_{P       [ 0]}(��   ,  0)],X_3)�Ǥ��롣 */
  /*             */             return newk(X_1, X_2.expand(newk(P.expand(k0), Gamma, k0)),X_3);
  /*             */           }
  /* 2-1-3-2-1-2.             �����Ǥʤ��ʤ�� */
  /*             */           else{
  /*                            X[Y]=   ��_{X_1}(X_2[        ��_{P       [ 0]}(Q    ,  0)],X_3)�Ǥ��롣 */
  /*             */             return newk(X_1, X_2.expand(newk(P.expand(k0), Q,     k0)),X_3);
  /*             */           }
  /*             */         }
  /* 2-1-3-2-2.             ������Q��0�Ȥ��롣 */
  /* 2-1-3-2-2   */         if(  !Q.iszero()){
  /* 2-1-3-2-2-1.             �⤷Y=$h (1��h<��)����*/ 
  /* 2-1-3-2-2-1 */           if(!Y.iszero() && Y.isfinite()){
  /*                            X[Y[0]]=��_{X_1}(��,X_3)�Ȥʤ릣��T����դ�¸�ߤ���ʤ�С� */
  /*             */             var Gamma=X.expand(Y.expand(k0)).a[1];
  /* ?????                 X[Y]=   ��_{X_1}(X_2       [ ��_{P}(Q[0],��)],X_3)�Ǥ��롣 */
  /*             */             return newk(X_1, X_2.expand(newk(P.expand(k0), Q, Gamma)),X_3);
  /*             */           }
  /* 2-1-3-2-2-2.             �����Ǥʤ��ʤ�С� */
  /* 2-1-3-2-2-2 */           else{
  /*                            X[Y]=   ��_{X_1}(X_2       [ ��_{P}(Q       [ 0], 0)],X_3)�Ǥ��롣*/
  /*             */             return newk(X_1, X_2.expand(newk(P, Q.expand(k0),k0)),X_3);
  /*             */           }
  /*             */         }
  /*             */       }
  /*             */     }
  /*             */   }
  /* 2-2.             ������dom(X_3)=$1�Ȥ��롣 */
  /* 2-2         */   if(   dom(X_3).isone()){
  /* 2-2-1.             �⤷Y=$1�ʤ�С�X[Y]=��_{X_1}(X_2,X_3[0])�Ǥ��롣 */
  /* 2-2-1       */     if(Y.isone()) return newk(X_1,X_2,X_3.expand(k0));
                        var k=Y.toint();
  /* 2-2-2.             �⤷Y=$k (2��k<��)�ʤ�С� */
  /* 2-2-2       */     if(2<=k && k!=-1)
  /* ???               X[Y]=   ��_{X_1}(X_2,X_3[        0])+
                              ...+��_{X_1}(X_2,X_3[        0]) (��_{X_1}(X_2,X_3[0])��k��)�Ǥ��롣 */
                          return newk(X_1, X_2,X_3.expand(k0)).mul(k);
  /* 2-2-3.             ���Τ�����Ǥ�ʤ��ʤ�С�X[Y]=0�Ǥ��롣 */
  /* 2-2-3       */     else                   return k0;
  /*             */   }
  /* 2-3.             �⤷dom(X_3)=$�ؤʤ�С�X[Y]=��_{X_1}(X_2,X_3[Y])�Ǥ��롣 */
  /* 2-3         */   if( dom(X_3).eq(kw)) return newk(X_1,X_2,X_3.expand(Y));
  /* 2-4.             ������dom(X_3)��0        ,           $1,                     $�ؤȤ��롣 */
  /* 2-4         */   if(  !dom(X_3).iszero() && !dom(X_3).isone() && !dom(X_3).eq(kw)){
  /* 2-4-1.             �⤷dom(X_3)<   X�ʤ�С�X[Y]=��_{X_1}(X_2,X_3[       Y])�Ǥ��롣 */
  /* 2-4-1       */     if( dom(X_3).lt(X)) return   newk(X_1, X_2,X_3.expand(Y));
  /* 2-4-2.             �����Ǥʤ��ʤ�С�dom(X_3)=��_{P}(Q,0) (P,Q��T)�Ȥ����� */
  /* 2-4-2       */     else{
                          var P=dom(X_3).a[0];
                          var Q=dom(X_3).a[1];
                          var h=Y.toint();
  /* 2-4-2-1.             ������Q=0�Ȥ��롣 */
  /* 2-4-2-1     */       if(Q.iszero()){
  /* 2-4-2-1-1.             �⤷Y=$h (1��h<��)����*/
  /* 2-4-2-1-1   */         if(1<=h && h!=-1){
  /* ???             ?    X[Y[0]]=��_{X_1}(X_2,��)�Ȥʤ릣��T����դ�¸�ߤ���ʤ�С� */
  /*             */           var Gamma=X.expand(Y.expand(k0)).a[2];
  /*                             X[Y]=��_{X_1}(X_2,X_3       [��_{ P       [0 ]}(��   , 0)])�Ǥ��롣 */
  /*             */           return newk(X_1, X_2,X_3.expand(newk(P.expand(k0), Gamma,k0)));
  /* 2-4-2-1-2.             �����Ǥʤ��ʤ�С�*/
  /* 2-4-2-1-2   */         }else{
  /*                          X[Y]=   ��_{X_1}(X_2,X_3       [��_{ P       [0 ]}(Q     ,0)])�Ǥ��롣 */
  /*             */           return newk(X_1, X_2,X_3.expand(newk(P.expand(k0), Q    ,k0)));
  /*             */         }
  /* 2-4-2-2.             ������Q��0�Ȥ��롣 */
  /*             */       }
  /* 2-4-2-2     */       if(!Q.iszero()){
  /*             */         var h=Y.toint();
  /* 2-4-2-2-1.             �⤷Y=$h (1��h<��)����*/
  /* 2-4-2-2-1   */         if( 1<=h && h!=-1){
  /*                          X[Y[0]]=��_{X_1}(X_2,��)�Ȥʤ릣��T����դ�¸�ߤ���ʤ�С� */
  /*             */           var Gamma=X.expand(Y.expand(k0)).a[2];
  /* ???              ?   X[Y]=   ��_{X_1}(X_2,X_3       [ ��_{P}(Q       [ 0],��    )])�Ǥ��롣 */
  /*             */           return newk(X_1, X_2,X_3.expand(newk(P, Q.expand(k0), Gamma)));
  /* 2-4-2-2-2.             �����Ǥʤ��ʤ�С�*/
  /* 2-4-2-2-2   */         }else{
  /*                          X[Y]=   ��_{X_1}(X_2,X_3[        ��_{P}(Q       [0 ],     0)])�Ǥ��롣 */
  /*             */           return newk(X_1, X_2,X_3.expand(newk(P, Q.expand(k0),    k0)));
  /*             */         }
  /*             */       }
  /*             */     }
  /*             */   }
  /*             */ }
  /* 3.             ������X=X_1+...+X_m��������X_1,...,X_m��PT (2��m<��)��¸�ߤ���Ȥ��롣 */
  /* 3           */ if(X.isadd()){
  /*             */   var m=X.a.length;
                      var X_m_Y          = X.a[m-1].expand(Y);
                      var X_1_t0__X__mm1 = X.slice(0,m-1);
  /* 3-1.             �⤷X_m[Y]=0        ����m= 2�ʤ�С�X[Y]=X_1�Ǥ��롣 */
  /* 3-1         */   if( X_m_Y .iszero() &&  m==2)     return X.a[0];
  /* 3-2.             �⤷X_m[Y]=0        ����m> 2�ʤ�С�X[Y]=X_1+...+X_{m-1}�Ǥ��롣 */
  /* 3-2         */   if( X_m_Y .iszero() &&  m> 2)     return X_1_t0__X__mm1;
  /* 3-3.             �⤷X_m[Y]��0�ʤ�С�               X[Y]=X_1+...+X_{m-1}  +        X_m[Y]�Ǥ��롣 */
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






