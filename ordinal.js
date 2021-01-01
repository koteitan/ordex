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
  this.p = null;
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
