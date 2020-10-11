/* ordinal abstruct object. */
Ordinal = function(){};

/* parse text as recursive parenthesis
 * and output into the fields of o.
 * o.e[i] = i th element = Ordinal or integer
 * o.b[i] = i th bracket = integer */
Ordinal.parse = function(o, text, type){
  //parse element
  switch(type){
    case "recursive paren":
      var matched=text.match(/(\()(.*)(\))/);
      if(matched!=null){
        var str = matched[0].replaceAll('(','[');
        str = str.replaceAll(')',']');
        o.s = JSON.parse(str);
      }else{//error
        return o;
      }
    break;
    default:
    break;
  }

  //parse brackets
  var r = /((\[[\[\]\d]*\])|\s)+/;
  var matched=text.match(r);
  if(matched!=null){
    o.b = JSON.parse(matched[0].replace(/\]\s*\[/g,","));
  }else{
    o.b = null; 
  }
  return o;
}
Ordinal.toString = function(o, type){
  switch(type){
    case "recursive paren":
      var outstr="(";
      for(var i=0;i<o.s.length;i++){
        var e=o.s[i];
        if(e.constructor==Ordinal){
          outstr+=e.toString();
        }else if(e.constructor==Array){
          outstr+=e.toString().replaceAll("[","(").replaceAll("]",")").replaceAll(" ","");
        }else if(Number.isFinite(e)){
          outstr+=e;
        }
        if(i<o.s.length-1)outstr+=",";
      }
      outstr+=")";
    break;
    default:
    break;
  }
  if(o.b!=null){
    for(i=0;i<o.b.length;i++){
      outstr+="["+o.b[i]+"]";
    }
  }
  return outstr;
}
