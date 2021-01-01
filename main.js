window.onload=function(){ //entry point
  
  intext.value = "0\n1\n2\nw";
};
var dothemall=function(){ //button
  //input
  var mstr=intext.value;
  //split
  var astr=mstr.split("\n");
  outtext.value+="";
  for(var i=0;i<astr.length;i++){
    //trim
    var str=astr[i].replace(/[\s]/g, "");
    //parse
    var o=Kuma3ary.parse(str);
    //out
    outtext.value+=o.toString(Kuma3ary.toSugar);
    outtext.value+=" = ";
    outtext.value+=o.toTree();
    outtext.value+="\n";
  }
};
k0=new Kuma3ary("0");
k1=new Kuma3ary("1");
kw=new Kuma3ary("w");

