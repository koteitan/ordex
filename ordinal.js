/* ordinal.js ------------------------------
 * The definition for abstruct ordinal object.
 * It has built-in function for
 *   - Ordinal.parse() ... parsing string -> ordinal,
 *   - obj.toString() .... convert ordinal -> string.
 * It supports additive tree type ordinal notation like
 *   - (0,0,(0,0,0))+(0,0)+0
 *   - and so on.
 */

/* constructor -----------------------------*/

/* @fn Ordinal(t,a)
 * @brief Ordinal abstruct type.
 * @param t = {"+", ",", others} = initialize type
 *  When t = "+" and a=[a0,a1,...,aN], the object is initialized as the ordinal which indicates a0+a1+a2...aN.
 *  When t = "," and a=[a0,a1,...,aN], the object is initialized as the ordinal which indicates (a0,a1,a2,...,aN).
 *  When t is other than the above, the object is initialized by calling Originaltype(t).
 * @param a = parameter set for "+" and ",". see reference for t.
 * @details
 * It requires:
 *   - The constructors definitions of Originaltype 
 *     other than Originaltype("+") and Originaltype(",").
 *     For example, Originaltype("0") or Originaltype("1") or other sugar syntax.
 *     This function calls Originaltype(t) when the constructor is missing.
 * */
Ordinal = function(t,a){
  // string
  if((typeof t)!="undefined" && t=="s"){
    var o=Ordinal.parse("s",t);
    this.t=o.t;
    this.a=o.a;
    return;
  }
  //other
  if((typeof t)=="undefined" || (typeof a)=="undefined"){
    this.t = "0";
    this.a = [];
    return;
  }else{
    this.t = t;
    this.a = a;
    return;
  }
};

/* prototype functions -----------------------------*/

/* @fn ordinal.clone()
 * @brief create a clone of this object with deep copy.
 * */
Ordinal.prototype.clone = function(){
  Orgtype = this.constructor;
  switch(this.t){
    case "0":
    return new Orgtype("0");
    case ",":
    case "+":
      var a=new Array(this.a.length);
      for(var i=0;i<this.a.length;i++){
        a[i]=this.a[i].clone();
      }
    return new Orgtype(this.t, a);
    default:
    throw new Error("the t is not supported.");
    return;
  }
}
/* @fn ordinal.toString(sugar)
 * @brief output the string expression of the ordinal.
 * @param sugar is the function to make the string into sugar syntax.
 *  sugar can be omitted and it can be null. The normal string expression is returned in the cases.
 *  
 * */
Ordinal.prototype.toString = function(sugar){
  if(typeof(sugar)!="function") sugar=null;
  var outstr="";
  switch(this.t){
    case "0":
      outstr+="0";
    break;
    case "+":
      for(var i=0;i<this.a.length;i++){
        if(i>0)outstr+="+";
        outstr+=this.a[i].toString(sugar);
      }
    break;
    case ",":
      outstr+="(";
      for(var i=0;i<this.a.length;i++){
        if(i>0)outstr+=",";
        outstr+=this.a[i].toString(sugar);
      }
      outstr+=")";
    break;
    default:
      return "error:this.type="+this.type;
    break;
  }
  if(typeof(sugar)=="function"){
    outstr=sugar(outstr);
  }
  return outstr;
}

/* @fn ordinal.toTree()
 * @brief output the tree expression of the ordinal.
 * */
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

/* static functions -----------------------------*/

/* @fn parse(text)
 * @brief parse string into ordinal object. 
 * @param text input string.*/
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
  return Ordinal.makeobjtree(text, depth, this.prototype.constructor);
}

/* inner functions -----------------------------*/

/* @fn Ordinal.makeobjtree
 * @brief (inner function.) make an object tree of Orgtype from text and depth recursively with top down parsing.
 * @param text is input string. 
 * @param depth[i] is depth of the nest of the i th charactor of text. 
 * ex. text="(0,(0,0,0)+(0,0,0),0)",
 *    depth=[021232323212323232010]. */
Ordinal.makeobjtree = function(text,depth,Orgtype){
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
        stack.push(Ordinal.makeobjtree(subtext, subdepth, Orgtype));
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
    stack.push(Ordinal.makeobjtree(subtext, subdepth, Orgtype));
  }
  if(type==""){
    return new Orgtype(text);
  }else{
    return new Orgtype(type, stack);
  }
}
/**@fn o=Ordinal.add(a,b)
 * @brief return new object for a+b.
 * @details
 * Ordinal.add(a,b)      returns new Object added a and b.
 * ex.
 *  w^1+w^2+w^3+w^4+w^5+w^6 = Ordinal.add(w^1+w^2+w^3, w^4+w^5+w^6)
 *  
 * @param a = Added object in left  side of +. It should be object of Ordinal.
 * @param b = Added object in right side of +. It should be object of Ordinal.
 *            This parameter can be omitted.
 * @returns = a+b.
 */
Ordinal.add = function(a,b){
  if(!(a instanceof Ordinal)){
    throw new Error("a is not instance of Ordinal");
    return null;
  }

  var o=a.clone();
  return o.addright(b);
}
/** @fn this=this.addright(b)
 *  @brief renew this into this+b.
 *  @param a = Added object. It should be object of Ordinal.
 *  @returns this = same as this.
 * ex.
 * x = w^1+w^2+w^3;
 * x.addright(w^4+w^5+w^6); // x = (w^1+w^2+w^3+w^4+w^5+w^6)
 */
Ordinal.prototype.addright=function(b){
  if(!(b instanceof Ordinal)){
    throw new Error("b is not instance of Ordinal");
    return null;
  }
  var left;
  if(this.t=="+"){
    left=this.clone().a;
  }else{
    left=this.clone();
  }
  var right;
  if(b.t=="+"){
    right=b.a;
  }else{
    right=b;
  }
  
  this.t = "+";
  this.a = [].concat(left).concat(right);
  return this;
}
/** @fn this=this.addleft(a)
 *  @brief renew this into a+this.
 *  @param a = Added object. It should be object of Ordinal.
 *  @returns this = same as this.
 * ex.
 * x = w^4+w^5+w^6;
 * x.addleft(w^1+w^2+w^3); // x = (w^1+w^2+w^3+w^4+w^5+w^6)
 */
Ordinal.prototype.addleft=function(a){
  if(!(b instanceof Ordinal)){
    throw new Error("b is not instance of Ordinal");
    return null;
  }
  var left;
  if(a.t=="+"){
    left=a.a;
  }else{
    left=a;
  }
  var right;
  if(this.t=="+"){
    right=this.clone().a;
  }else{
    right=this.clone();
  }
  
  this.t = "+";
  this.a = [].concat(left).concat(right);
  return this;
}

/**@fn o=Ordinal.cat(a,b,o)
 * @brief return new object which is concatenation of a and b.
 * @details
 * Ordinal.cat(a,b)      returns new Object that is the concatenation of a and b.
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
 * @param a = Concatenated object in the left side. It should be object of Ordinal.
 * @param b = concatenated object in the right side. It should be object of Ordinal.
 * @param a_wrapped When this is false or a is not , returns (a,b1,b2,...), otherwise returns (a1,a2,
 * @returns o = same as o.
 */
Ordinal.cat = function(a,b,a_wrapped,b_wrapped){
  if(typeof a_wrapped == "undefined") a_wrapped=false;
  if(typeof b_wrapped == "undefined") b_wrapped=false;
  if(!(b instanceof Ordinal)){
    throw new Error("b is not instance of Ordinal");
    return null;
  }
  var o=a.clone();
  return o.catright(b,a_wrapped,b_wrapped);
}
/** @fn this=this.catright(b)
 *  @brief make this object (a1,a2,...b) when this object=(a1,a2,...).
 *  @param b = concatenated object. It should be object of Ordinal or [Ordinal].
 *  When b= Ordinal , this will be (a1,a2,...,b).
 *  When b=[Ordinal], this will be (a1,a2,...,b1,b2,...).
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
Ordinal.prototype.catright=function(b,a_wrapped,b_wrapped){
  if(typeof a_wrapped == "undefined") a_wrapped=false;
  if(typeof b_wrapped == "undefined") b_wrapped=false;
  if(!(b instanceof Ordinal)){
    throw new Error("b is not instance of Ordinal");
    return null;
  }
  var a=this.clone();
  var left;
  if(a.t=="," && !a_wrapped){
    left=a.a;
  }else{
    left=a;
  }
  var right;
  if(b.t=="," && !b_wrapped){
    right=b.a;
  }else{
    right=b;
  }
  this.t = ",";
  this.a = [].concat(left).concat(right);
  return this;
}
/** @fn this=this.catleft(a)
 *  @brief make this object (a,b1,b2,...) when this object=(b1,b2,...).
 *  @param a = concatenated object. It should be object of Ordinal or [Ordinal].
 *  When b= Ordinal , this will be (b,a1,a2,...).
 *  When b=[Ordinal], this will be (b1,b2,...,a1,a2,...,).
 *  @returns this = same as this.
 *  @details
 * ex.
 * x = ((d,e,f));
 * x.addleft( (a,b,c) ); // x = ( a,b,c ,d,e,f)
 * x =  (a,b,c) ;
 * x.addleft([(a,b,c)]); // x = ((a,b,c),d,e,f)
 *
 * If you need ( a,b,c ,(d,e,f)) from this=(a,b,c) and (d,e,f), 
 *  use Ordinal.cat( (a,b,c) ,[this]) instead of this fuction.
 * If you need ((a,b,c),(d,e,f)) from this=(a,b,c) and (d,e,f), 
 *  use Ordinal.cat([(a,b,c)],[this]) instead of this fuction.
 */
Ordinal.prototype.catleft=function(a,a_wrapped,b_wrapped){
  if(typeof a_wrapped == "undefined") a_wrapped=false;
  if(typeof b_wrapped == "undefined") b_wrapped=false;
  if(b instanceof Array){
    b=b[0];
    b_wrapped=true;
  }
  if(!(b instanceof Ordinal)){
    throw new Error("b is not instance of Ordinal");
    return null;
  }
  var a=this.clone();
  var left;
  if(a.t=="," && !a_wrapped){
    left=a.a;
  }else{
    left=a;
  }
  var right;
  if(b.t=="," && !b_wrapped){
    right=b.a;
  }else{
    right=b;
  }
  this.t = ",";
  this.a = [].concat(left).concat(right);
  return this;
}

/** @fn Ordinal.debug 
  * @brief output text and depth and now with comment into cosole log. 
  * @param text  = text of makeobjtree ()
  * @param depth = depth of makeobjtree()
  * @param now   = current depth of the line
  * @param comment = the comment you like, which indicates place. */
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
