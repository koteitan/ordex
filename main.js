window.onload=function(){ //entry point
  
  var o=new Kuma3ary("w");
  intext.value = o.toString();
};
var dothemall=function(){ //button
  //input
  var str=intext.value;
  //trim
  str=str.replace(/[\n\s]/g, "");
  //parse
  var o=Kuma3ary.parse(str);
  //out
  outtext.value=o.toString();
};
k0=new Kuma3ary("0");
k1=new Kuma3ary("1");
kw=new Kuma3ary("w");

