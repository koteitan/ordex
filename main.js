/** window.onload()
  * @brief initialize window.
  * @details This function is called by loading the window.
*/
window.onload=function(){
  intext.value = "0\n1\n2\nw";
  loadlink();
  savelink();
};
var loadlink=function(){
  var query=location.search.substr(1);
  if(query.length>0){
    //get matrix
    var str = query.match(/(o=)(.*$)/)[2];
    str=str.replace(/\./g, " ");
    str=str.replace(/;/g, "\n");
    intext.value=str;
  }
}
var savelink=function(){
  var query="o=";
  var str=intext.value;
  str=str.replace(/^\n*/g, "");
  str=str.replace(/\n*$/g, "");
  str=str.replace(/^\s*/g, "");
  str=str.replace(/\s*$/g, "");
  str=str.replace(/\n\n*/g, ";");
  str=str.replace(/\s\s*/g, ".");
  str=str.replace(/;\./g, ";");
  str=str.replace(/\.;/g, ";");
  query+=str;
  document.getElementById("link").href = location.origin+location.pathname+"?"+query;
}

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
  var ystr=mstr.split("\n");
  
  outtext.value="";
  for(var y=0;y<ystr.length;y++){
    //trim
    var str=ystr[y].replace(/^\s*/g , "" );
    var str=   str.replace(/\s*$/g , "" );
    var str=   str.replace(/\s\s*/g, " ");
    if(str!=""){
      var xstr=str.split(" ");
      for(var x=0;x<Math.floor(xstr.length/2);x++){
        if(str!=""){
          //parse
          var a=Kuma3ary.parse(xstr[x*2+0]);
          var b=Kuma3ary.parse(xstr[x*2+1]);
          //out string expression
          var c;
          if     (Kuma3ary.lessthan(a,b)) c = " < ";
          else if(Kuma3ary.equal   (a,b)) c = " = ";
          else                            c = " > ";
          outtext.value+=a.toString(Kuma3ary.toSugar);
          outtext.value+=c;
          outtext.value+=b.toString(Kuma3ary.toSugar);
        }
        outtext.value+="  ";
      }//x
      if(xstr.length%2==1){
        var a=Kuma3ary.parse(xstr[xstr.length-1]);
        outtext.value+=a.toString(Kuma3ary.toSugar);
      }
    }
    outtext.value+="\n";
  }//y
};

/** dom()
  * @brief get dom() of intext and output result into outtext.
  * @details This function is called by clicking "dom" button.
*/
var dom=function(){
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
          //dom
          var o=Kuma3ary.parse(str);
          var d=o.dom();
          //out string expression
          outtext.value+=d.toString(Kuma3ary.toSugar);
          //out tree expression
        }
        outtext.value+="  ";
      }//x
    }
    outtext.value+="\n";
  }//y
};


/* Those are for debugging */
k0=new Kuma3ary("0");
k1=new Kuma3ary("1");
kw=new Kuma3ary("w");

