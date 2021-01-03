/** window.onload()
  * @brief initialize window.
  * @details This function is called by loading the window.
*/
window.onload=function(){
  intext.value = " 0  1 \n w 1 \n w 3 \n w+w 3 \n (0,0,w) 3 \n (0,0,(0,W,0)) 3";
  loadlink();
  makelink();
  window.onresize();
};
window.onresize = function(){
  var clientWidth  = document.documentElement.clientWidth;
  var clientHeight = document.documentElement.clientHeight;
  var fixedWidth   = clientWidth /4;
  var fixedHeight  = clientHeight*0.1;
  document.getElementById("inputtd" ).width  = Math.floor((clientWidth -fixedWidth )/2*0.99);
  document.getElementById("outputtd").width  = Math.floor((clientWidth -fixedWidth )/2*0.99);
  document.getElementById("inputtd" ).height = Math.floor( clientHeight-fixedHeight)*0.5;
  document.getElementById("outputtd").height = Math.floor( clientHeight-fixedHeight)*0.5;
//  document.getElementById("intext").width = "100%"
//  document.getElementById("outtext").width = "100%"
}    
var loadlink=function(){
  var query=location.search.substr(1);
  if(query.length>0){
    //get matrix
    var str = query.match(/(o=)(.*$)/)[2];
    str=str.replace(/\./g, " ");
    str=str.replace(/;/g, "\n");
    str=str.replace(/_/g, "");
    intext.value=str;
  }
}
var makelink=function(){
  var query="o=";
  var str=intext.value;
  str=str.replace(/\n/g, ";");
  str=str.replace(/\s/g, ".");
  query+=str+"_";
  var url = location.origin+location.pathname+"?"+query;
  document.getElementById("link").href = url;
  document.title=str;
  return url;
}
var prevurl="";
var autosave=function(){
  if(autosavecheck.value){
    var url = makelink();
    if(prevurl!=url){
      history.pushState(null,null,url);
    }
    prevurl=url;
  }
}
var lastcommand=function(){/* nop */};
var redraw=function(){
  lastcommand();
}
var mainsugar = function(str){
  /* programmer memo: Define conversion from the object to the suger syntax here. */
  switch(str){
    case "(0)": case "(0,0)": case "(0,0,0)":
    if(!sugar1check.checked)break;
    return "1";
    
    case "(1)": case "(0,1)": case "(0,0,1)":
    case "(0,0,0)": case "(0,(0,0,0))": case "(0,0,(0,0,0))":
    if(!sugarwcheck.checked)break;
    return "w";
    
    case "(1,0)": case "(0,1,0)":
    case "((0,0,0),0)": case "(0,(0,0,0),0)":
    if(!sugarWcheck.checked)break;
    return "W";
    
    case "(0,W)": case "(0,0,W)":
    case "(0,(0,1,0))": case "(0,0,(0,1,0))":
    case "(0,(0,(0,0,0),0))": case "(0,0,(0,(0,0,0),0))":
    if(!sugarecheck.checked)break;
    return "e";
    
    case "(0,(0,1,W))": case "(0,0,(0,1,W))":
    case "(0,(0,(0,0,0),W))": case "(0,0,(0,(0,0,0),W))":
    case "(0,(0,1,(0,1,0)))": case "(0,0,(0,1,(0,1,0)))":
    case "(0,(0,(0,0,0),(0,(0,0,0),0)))": case "(0,0,(0,(0,0,0),(0,(0,0,0),0)))":
    if(!sugarzcheck.checked)break;
    return "z";
    
    case "(0,(0,1,(0,1,W)))": case "(0,0,(0,1,(0,1,W)))":
    case "(0,(0,1,(0,1,(0,1,0))))": case "(0,0,(0,1,(0,1,(0,1,0))))":
    case "(0,(0,(0,0,0),(0,(0,0,0),W)))": case "(0,0,(0,(0,0,0),(0,(0,0,0),W)))":
    case "(0,(0,(0,0,0),(0,(0,0,0),(0,(0,0,0),0))))": case "(0,0,(0,(0,0,0),(0,(0,0,0),(0,(0,0,0),0))))":
    if(!sugarGcheck.checked)break;
    return "G";
  }

  if(sugarNcheck.checked){
    if(str.match(/^1(\+1)+$/g)!=null){
      str = str.match(/1/g).length+"";
    }
    else if(str.match(/^\(0,0,0\)(\+\(0,0,0\))*$/g)!=null){
      str = str.match(/\(0,0,0\)/g).length+"";
    }
  }
  return str;
}

var doclear=function(){
  intext.value ="";
  outtext.value="";
  var url=makelink();
  if(url.match(/^https:\/\//) || url.match(/^http:\/\//)){
    url=url.replace(/\/[^\/]*$/,"/");
  }else{
    url=url.replace(/\/[^\/]*$/,"/index.html");
  }
  history.pushState(null,null,url);
}
/** parse()
  * @brief parse intext and output result into outtext.
  * @details This function is called by clicking "parse" button.
*/
var parse=function(){
  autosave();
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
          outtext.value+=o.toString(mainsugar);
          //out tree expression
        }
        outtext.value+="  ";
      }//x
    }
    outtext.value+="\n";
  }//y
  lastcommand=parse;
};

/** drawtree()
  * @brief parse intext and output tree structure into outtext.
  * @details This function is called by clicking "tree" button.
*/
var drawtree=function(){
  autosave();
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
  lastcommand=drawtree;
};
/** compare()
  * @brief parse intext and output result into outtext.
  * @details This function is called by clicking "compare" button.
*/
var compare=function(){
  autosave();
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
          if     (Kuma3ary.lt(a,b)) c = " < ";
          else if(Kuma3ary.eq(a,b)) c = " = ";
          else                            c = " > ";
          outtext.value+=a.toString(mainsugar);
          outtext.value+=c;
          outtext.value+=b.toString(mainsugar);
        }
        outtext.value+="  ";
      }//x
      if(xstr.length%2==1){
        var a=Kuma3ary.parse(xstr[xstr.length-1]);
        outtext.value+=a.toString(mainsugar);
      }
    }
    outtext.value+="\n";
  }//y
  lastcommand=compare;
};
/** dom()
  * @brief get dom() of intext and output result into outtext.
  * @details This function is called by clicking "dom" button.
*/
var dom=function(){
  autosave();
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
          outtext.value+=d.toString(mainsugar);
          //out tree expression
        }
        outtext.value+="  ";
      }//x
    }
    outtext.value+="\n";
  }//y
  lastcommand =dom;
};
/** expand()
  * @brief expand intext X Y and output result X[Y] into outtext.
  * @details This function is called by clicking "expand" button.
*/
var expand=function(){
  autosave();
  //input
  var mstr=intext.value;
  //split
  var ystr=mstr.split("\n");
  
  var outstr="";
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
          outstr += a.expand(b).toString(mainsugar);
        }
        outstr+="  ";
        outtext.value = outstr;
      }//x
      if(xstr.length%2==1){
        var a=Kuma3ary.parse(xstr[xstr.length-1]);
        outstr+=a.toString(mainsugar);
      }
    }
    outstr+="\n";
  }//y
  outtext.value = outstr;
  lastcommand=expand;
};



/* Those are for debugging */
k0=new Kuma3ary("0");
k1=new Kuma3ary("1");
kw=new Kuma3ary("w");
kW=new Kuma3ary("W");
ke=new Kuma3ary("w");
kz=new Kuma3ary("z");

