/** window.onload()
  * @brief initialize window.
  * @details This function is called by loading the window.
*/
window.onload=function(){
  intext.value = "0\n1\n2\nw";
};
/** parse()
  * @brief parse intext and output result into outtext.
  * @details This function is called by clicking "parse" button.
*/
var parse=function(){
  //input
  var mstr=intext.value;
  //split
  var astr=mstr.split("\n");
  
  outtext.value="";
  for(var i=0;i<astr.length;i++){
    //trim
    var str=astr[i].replace(/[\s]/g, "");
    if(str!=""){
      //parse
      var o=Kuma3ary.parse(str);
      //out string expression
      outtext.value+=o.toString(Kuma3ary.toSugar);
      //out tree expression
      outtext.value+=" = ";
      outtext.value+=o.toTree();
    }
    outtext.value+="\n";
  }
};

/* Those are for debugging */
k0=new Kuma3ary("0");
k1=new Kuma3ary("1");
kw=new Kuma3ary("w");

