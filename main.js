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
  var ystr=mstr.split("\n");
  
  outtext.value="";
  for(var y=0;y<ystr.length;y++){
    //trim
    var str=ystr[y].replace(/\s\s*/g, " ");
    str=str.replace(/^\s*/g, "");
    str=str.replace(/\s*$/g, "");
    if(str!=""){
      var xstr=str.split(" ");
      for(var x=0;x<xstr.length;x++){
        str=xstr[x];
        if(str!=""){
          //parse
          var o=Kuma3ary.parse(str);
          //out string expression
          outtext.value+=o.toString(Kuma3ary.toSugar);
          //out tree expression
        }
        outtext.value+="  ";
      }//x
    }
    outtext.value+="\n";
  }//y
};

var drawtree=function(){
  //input
  var mstr=intext.value;
  //split
  var ystr=mstr.split("\n");
  
  outtext.value="";
  for(var y=0;y<ystr.length;y++){
    //trim
    var str=ystr[y].replace(/\s\s*/g, " ");
    str=str.replace(/^\s*/g, "");
    str=str.replace(/\s*$/g, "");
    if(str!=""){
      var xstr=str.split(" ");
      for(var x=0;x<xstr.length;x++){
        str=xstr[x];
        if(str!=""){
          //parse
          var o=Kuma3ary.parse(str);
          //out string expression
          outtext.value+=o.toTree();
          //out tree expression
        }
        outtext.value+="  ";
      }//x
    }
    outtext.value+="\n";
  }//y
};
/** compare()
  * @brief parse intext and output result into outtext.
  * @details This function is called by clicking "parse" button.
*/
var compare=function(){
  //input
  var mstr=intext.value;
  //split
  var astr=mstr.split("\n");
  
  outtext.value="";
  for(var i=0;i<astr.length;i++){
    //trim
    var str2=astr[i].replace(/^\s*/g , "" );
    var str2=   str2.replace(/\s*$/g , "" );
    var str2=   str2.replace(/\s\s*/g, " ");
    if(str2!=""){
      var astr2=str2.split(" ");
      //parse
      if(astr2.length>=2){
        var x=Kuma3ary.parse(astr2[0]);
        var y=Kuma3ary.parse(astr2[1]);
        //out string expression
        var c;
        if     (Kuma3ary.lessthan(x,y)) c = " < ";
        else if(Kuma3ary.equal   (x,y)) c = " = ";
        else                            c = " > ";
        outtext.value+=x.toString(Kuma3ary.toSugar);
        outtext.value+=c;
        outtext.value+=y.toString(Kuma3ary.toSugar);
      }else{
        var x=Kuma3ary.parse(astr2[0]);
        outtext.value+=x.toString(Kuma3ary.toSugar);
      }
    }
    outtext.value+="\n";
  }
};

/* Those are for debugging */
k0=new Kuma3ary("0");
k1=new Kuma3ary("1");
kw=new Kuma3ary("w");

