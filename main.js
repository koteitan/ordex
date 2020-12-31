window.onload=function(){ //entry point
  intext.value="(0,0,(0,0,0))[1][2]";  
};
var dothemall=function(){ //button
  var str=intext.value;
  //trimming \n
  str=str.replace(/^\n*/g, "");
  str=str.replace(/\n*$/g, "");
  str=str.replace(/\n+/g, "\n");
  //parse
  var o=new Kuma3ary();
  o.t="0";
  console.log(o.toString());
  //test
  outtext.value = o.toString();
};

