/* ordinal object. */
Ordinal = function(){};
/* parse text and output into the fields of o.
 * o.m = memory
 * o.b[i] = bracket list */
Ordinal.prototype.parse = function(o, text){
  //parse memory
  var m=[[]];
  //              1  2   3   4
  var r = /\(?[\s\d,()]*\)?/;
  var matched=text.match(r);
  matched=matched.replaceAll("\(","[");
  matched=matched.replaceAll("\)","]");
  var m=JSON.parse(matched);
  while(m.length==1) m=m[0]; //defrate no-width dimension
  o.m = m;

  //parse brackets
  var ci=0;
  var r = /((\[[\s\d]*\])|\s)+/;
  var matched=text.match(r);
  if(matched!=null){
    o.b = JSON.parse(matched.replace(/\]\s*\[/g,","));
  }else{
    o.b = null; 
  }
}
