/* ordinal abstruct object. */
Ordinal = function(){};

/* parse text as Multi-Dimensional parenthesis and bracket 
 * and output into the fields of o.
 * o.m = memory
 * o.b[i] = bracket list */
Ordinal.parse_md_paren_bracket = function(o, text){
  //parse memory
  //              1  2   3   4
  var r = /\(?[\s\d,()]*\)?/;
  var matched=text.match(r);
  if(matched!=null){
    matched=matched[0].replaceAll("\(","[");
    matched=matched.replaceAll("\)","]");
    o.m=JSON.parse(matched);
    while(o.m.length==1) o.m=o.m[0]; //defrate no-width dimension
  }

  //parse brackets
  var r = /((\[[\s\d]*\])|\s)+/;
  var matched=text.match(r);
  if(matched!=null){
    o.b = JSON.parse(matched[0].replace(/\]\s*\[/g,","));
  }else{
    o.b = null; 
  }
  return o;
}
Ordinal.toString_md_paren_bracket = function(o){
  var str="";
  for(var x=0;x<o.length;x++){
    str+="(";
    for(var y=0;y<o[x].length;y++){
      str+=o[x][y];
      if(y<o[x].length-1) str+=",";
    }
  }
  return str;
}
