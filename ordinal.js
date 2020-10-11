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
        var elemlist = matched[2].split(",");
        o.s = new Array(elemlist.length);
        for(i=0;i<elemlist.length;i++){
          var e = elemlist[i];
          if(e.match(/(\()(.*)(\))/) != null){ // recparen
            o.s[i] = new Ordinal();
            Ordinal.parse(o.s[pi], e, type);
          }else if(e.match(/\d*/) != null){ //digit
            o.s[i] = parseInt(e);
          }
        }
      }else{//error
        return o;
      }
    break;
    default:
    break;
  }

  //parse brackets
  var r = /((\[[\\d]*\])|\s)+/;
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
      var str="(";
      for(var i=0;i<o.length;i++){
        var e=o.s[i];
        if(e.constructor==Ordinal){
          str+=e.toString();
        }else if(Number.isFinite(e)){
          str+=e;
        }
        if(i<=o.length)str+=",";
      }
      return str+")";
    break;
    default:
    break;
  }
}
