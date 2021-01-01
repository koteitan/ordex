/* @fn Ordinal()
 * @brief Ordinal abstruct type.
 * @details
 * It requires:
 *   - definition of Originaltype("0")
 *   - definition of Originaltype("1")
 * */
Ordinal = function(_t,_a){
  this.p = null;
  // string
  if((typeof _t)!="undefined" && _t=="s"){
    var o=Ordinal.parse("s",t);
    this.t=o.t;
    this.a=o.a;
    return;
  }
  //other
  if((typeof _t)=="undefined" || (typeof _a)=="undefined"){
    this.t = "0";
    this.a = [];
    return;
  }else{
    this.t = _t;
    this.a = _a;
    return;
  }
};

/**@fn o=Ordinal.add(a,b,o)
 * @brief adds a and b to o.
 * @details
 * Ordinal.add(a,b,o)    adds a and b into o and returns o.
 * Ordinal.add(a,b,null) returns new Object added a and b.
 * Ordinal.add(a,b)      returns new Object added a and b.
 * Ordinal.add(a)        returns new Object as same as a.
 * ex.
 *  w^1+w^2+w^3+w^4+w^5+w^6 = Ordinal.add(w^1+w^2+w^3, w^4+w^5+w^6)
 *  
 * @param o Destination object. It is omitted.
 *          When o is Ordinal, this object is renewed.
 *          When o is omitted, A new Object has type of a is created.
 * @param a = Added object in . It should be object of Ordinal.
 * @param b = Added object after a. It should be object of Ordinal.
 *            This parameter can be omitted.
 * @returns o = same as o.
 */
Ordinal.add = function(a,b,o){
  
  if(o==null){
    o=new a.constructor();
    o.p=null;
    o.t="+";
  }
  
  if((typeof a) !="undefined"){
    if((a instanceof Ordinal)){
      o.t="+";
      if(a.t=="+"){
        o.a=o.a.concat(a.a);
      }else{
        o.a=o.a.concat(a); // add object a itself
      }
    }else{// not Ordinal
      throw new Error("a is not instance of Ordinal");
      return null;
    }
  }
  if((typeof b) !="undefined"){
    if((b instanceof Ordinal)){
      o.t="+";
      if(b.t=="+"){
        o.a=o.a.concat(b.a);
      }else{
        o.a=o.a.concat(b); // add object b itself
      }
    }else{// not Ordinal
      throw new Error("b is not instance of Ordinal");
      return null;
    }
  }
  return o;
}
/** @fn this=this.addright(a)
 *  @brief adds a into the right of this.
 *  @param a = Added object. It should be object of Ordinal.
 *  @returns this = same as this.
 * ex.
 * x = w^1+w^2+w^3;
 * x.addright(w^4+w^5+w^6); // x = (w^1+w^2+w^3+w^4+w^5+w^6)
 */
Ordinal.prototype.addright=function(a){
  return Ordinal.add(this, a, this);
}
/** @fn this=this.addleft(a)
 *  @brief adds a into the left of this.
 *  @param a = Added object. It should be object of Ordinal.
 *  @returns this = same as this.
 * ex.
 * x = w^4+w^5+w^6;
 * x.addleft(w^1+w^2+w^3); // x = (w^1+w^2+w^3+w^4+w^5+w^6)
 */
Ordinal.prototype.addleft=function(a){
  return Ordinal.add(a, this, this);
}

/**@fn o=Ordinal.cat(a,b,o)
 * @brief concatenates dimensions of a and b with o.
 * @details
 * Ordinal.cat(a,b,o)    concatenates a and b into o and returns o.
 * Ordinal.cat(a,b,null) returns new Object that is the concatenation of a and b.
 * Ordinal.cat(a,b)      returns new Object that is the concatenation of a and b.
 * Ordinal.cat(a)        returns new Object as same as a.
 * If a= (a0,a1,...,aN)  and b= (b0,b1,...,bN)  then o=( a0,a1,...,aN , b0,b1,...,bN ).
 * If a= (a0,a1,...,aN)  and b=[(b0,b1,...,bN)] then o=( a0,a1,...,aN ,(b0,b1,...,bN)).
 * If a=[(a0,a1,...,aN)] and b= (b0,b1,...,bN)  then o=((a0,a1,...,aN), b0,b1,...,bN ).
 * If a=[(a0,a1,...,aN)] and b=[(b0,b1,...,bN)] then o=((a0,a1,...,aN),(b0,b1,...,bN)).
 * ex.
 *  ( a,b,c , d,e)  = Ordinal.add( (a,b,c) , (d,e) ). (o will have 5 elements.)
 *  ((a,b,c), d,e)  = Ordinal.add([(a,b,c)], (d,e) ). (o will have 3 elements.)
 *  ( a,b,c ,(d,e)) = Ordinal.add( (a,b,c) ,[(d,e)]). (o will have 4 elements.)
 *  ((a,b,c),(d,e)) = Ordinal.add([(a,b,c)],[(d,e)]). (o will have 2 elements.)
 *  
 * @param o Destination object. It is omitted.
 *          When o is Ordinal, this object is renewed.
 *          When o is omitted, A new Object has type of a is created.
 * @param a = Concatenated object. It should be object of Ordinal or [Ordinal].
 *            if a is Ordinal, then the dimensions of a is expanded into the dimensions of o.
 *            if a is [Ordinal], then the o is extended in a dimension for a.
 * @param b = concatenated object after a. It should be object of Ordinal or [Ordinal].
 *            if b Ordinal, then the dimensions of b is expanded into the dimensions of o.
 *            if b is [Ordinal], then the o is extended in a dimension for b.
 * @returns o = same as o.
 */
Ordinal.cat = function(a,b,o){
  
  if(o==null){
    if(a instanceof Array){
      if(a.length>0 && a[0] instanceof Ordinal){
        o=new a[0].constructor();
      }else{
        throw new Error("a[0] is not instance of Ordinal");
        return null;
      }
    }else{
      o=new a.constructor();
    }
    o.p=null;
    o.t=",";
  }
  
  if((typeof a) !="undefined"){
    if(a instanceof Ordinal && a.t==","){
      o.a=o.a.concat(a.a);
    }else{
      if(a instanceof Array && a.length>0) a=a[0]; //remove wrapping
      if(a instanceof Ordinal){
        o.a=o.a.concat(a);
      }else{
        throw new Error("a is not instance of Ordinal");
        return null;
      }
    }
  }
  if((typeof b) !="undefined"){
    if(b instanceof Ordinal && b.t==","){
      o.a=o.a.concat(b.a);
    }else{
      if(b instanceof Array && b.length>0) b=b[0]; //remove wrapping
      if(b instanceof Ordinal){
        o.a=o.a.concat(b);
      }else{
        throw new Error("b is not instance of Ordinal");
        return null;
      }
    }
  }
  return o;
}
/** @fn this=this.catright(a)
 *  @brief concatenates a into the right of this.
 *  @param a = concatenated object. It should be object of Ordinal or [Ordinal].
 *  When a= Ordinal , then a.a is expanded and added into the right of this.a.
 *  When a=[Ordinal], then Ordinal a itself is added into the right of this.a.
 *  @returns this = same as this.
 *  @details
 * ex.
 * x = ((a,b,c));
 * x.addright( (d,e,f) ); // x = (a,b,c, d,e,f )
 * x =  (a,b,c) ;
 * x.addright([(d,e,f)]); // x = (a,b,c,(d,e,f))
 *
 * If you need ((a,b,c), d,e,f) from this=(a,b,c) and (d,e,f), 
 *  use Ordinal.cat([this], (d,e,f) ,this) instead of this function.
 * If you need ((a,b,c),(d,e,f)), from this=(a,b,c) and (d,e,f),
 *  use Ordinal.cat([this],[(d,e,f)],this) instead of this function.
 */
Ordinal.prototype.catright=function(a){
  return Ordinal.cat(this, a, this);
}
/** @fn this=this.catleft(a)
 *  @brief concatenates a into the left of this.
 *  @param a = concatenated object. It should be object of Ordinal or [Ordinal].
 *  When a= Ordinal , then a.a is expanded and added into the left of this.a.
 *  When a=[Ordinal], then Ordinal a itself is added into the left of this.a.
 *  @returns this = same as this.
 * ex.
 * x = ((d,e,f));
 * x.addleft( (a,b,c) ); // x = ( a,b,c ,d,e,f)
 * x =  (a,b,c) ;
 * x.addleft([(a,b,c)]); // x = ((a,b,c),d,e,f)
 *
 * If you need ( a,b,c ,(d,e,f)) from this=(a,b,c) and (d,e,f), 
 *  use Ordinal.cat( (a,b,c) ,[this],this) instead of this fuction.
 * If you need ((a,b,c),(d,e,f)) from this=(a,b,c) and (d,e,f), 
 *  use Ordinal.cat([(a,b,c)],[this],this) instead of this fuction.
 */
Ordinal.prototype.catleft=function(a){
  return Ordinal.cat(a, this, this);
}

/* parse text as recursive parenthesis */
Ordinal.parse = function(text){
  text=text.replace(/[\n\s]/g, "");
  
  /* depth analysis */
  var depth=Array(text.length);
  var now=0;
  var prevope="";
  for(var i=0;i<text.length;i++){
    var c=text[i];
    switch(c){
      case "(":
        depth[i]=now;
        now++;
      break;
      case ")":
        now--;
        for(var j=i;j>=0;j--){
          if((text[j]=="("||text[j]==",") && depth[j]<=now){
            depth[i]=depth[j];
            now=depth[j];
            break;
          }
        }
      break;
      case "+":
        var ibegin=0;
        for(var j=i;j>=0;j--){
          if(depth[j]<now){
            ibegin=j+1;
            break;
          }
        }
        Ordinal.debug(text, depth, now, "before upgrade");//debug

        if(ibegin>0 && text[ibegin-1]=="+"){ // leading +
          // already acsent -> nop
          now--;
          depth[i]=now;
          now++;
        }else{
          //acent left parameter of +
          for(var j=ibegin;j<i;j++){
            depth[j]++;
          }
          depth[i]=now;
          now++;
        }
        Ordinal.debug(text, depth, now, "after upgrade");//debug
      break;
      case ",":
        for(var j=i;j>=0;j--){
          if((text[j]=="("||text[j]==",") && depth[j]<now){
            depth[i]=depth[j];
            now=depth[j];
            break;
          }
        }
        depth[i]=now;
        now++;
      break;
      default:
        depth[i]=now;
      break;
    }
  }
  Ordinal.debug(text, depth, now, "final");//debug
  return makeobjectree(text, depth, this.prototype.constructor);
}
var makeobjectree = function(text,depth,Orgtype){
  /* make object tree */
  var childbegin=0;
  var stack=[];
  var type="";
  for(var i=0;i<text.length;i++){
    var c=text[i];
    if(depth[i]==0){
      if(i>childbegin){
        var subdepth = depth.slice(childbegin,i);
        var subtext  = text.slice(childbegin,i);
        for(var j=0;j<subdepth.length;j++)subdepth[j]--;
        stack.push(makeobjectree(subtext, subdepth, Orgtype));
        childbegin=i+1;
        switch(text[i]){
          case "+":                     type="+"; break;
          case "(": case ",": case ")": type=","; break;
          default:break;
        }
      }else{
        childbegin=1;
      }
    }
  }
  if(i>childbegin){
    var subdepth = depth.slice(childbegin,i);
    var subtext  = text.slice(childbegin,i);
    for(var j=0;j<subdepth.length;j++)subdepth[j]--;
    stack.push(makeobjectree(subtext, subdepth, Orgtype));
  }
  if(type==""){
    return new Orgtype(text);
  }else{
    return new Orgtype(type, stack);
  }
}
Ordinal.debug=function(text, depth, now, comment){
  if(0){ /* for debug */
    var depthstr="";
    var scalestr="";
    var nowstr  ="";
    for(var j=0;j<text.length;j++){
      scalestr+=(      j +"").slice(0,1);
      depthstr+=(depth[j]+"").slice(0,1);
      nowstr  +=j==now?"Vnow":" ";
    }
    console.log(" ");
    console.log(nowstr);
    console.log(scalestr+" "+comment);
    console.log(text    +" ");
    console.log(depthstr);
  }
}

Ordinal.prototype.toString = function(sugar){
  var outstr="";
  switch(this.t){
    case "0":
      outstr+="0";
    break;
    case "+":
      for(var i=0;i<this.a.length;i++){
        if(i>0)outstr+="+";
        outstr+=this.a[i].toString();
      }
    break;
    case ",":
      outstr+="(";
      for(var i=0;i<this.a.length;i++){
        if(i>0)outstr+=",";
        outstr+=this.a[i].toString();
      }
      outstr+=")";
    break;
    default:
      return "error:this.type="+this.type;
    break;
  }
  if(typeof(sugar)!="undefined"){
    outstr=sugar(outstr);
  }
  return outstr;
}

Ordinal.prototype.toTree = function(){
  var outstr="";
  switch(this.t){
    case "0":
      outstr+="0";
    break;
    case "+":
      outstr+="+^{";
      for(var i=0;i<this.a.length;i++){
        if(i>0)outstr+=",";
        outstr+=this.a[i].toTree();
      }
      outstr+="}";
    break;
    case ",":
      outstr+="psi^{";
      for(var i=0;i<this.a.length;i++){
        if(i>0)outstr+=",";
        outstr+=this.a[i].toTree();
      }
      outstr+="}";
    break;
    default:
      return "error:this.type="+this.type;
    break;
  }
  return outstr;
}

