/* ordinal abstruct object. */
Ordinal = function(){
  this.t = "0";
  this.a = [];
  this.p = null;
};

Ordinal.prototype.add = function(added){
  
}
/* parse text as recursive parenthesis
 * and output into the fields of o.
 * o.e[i] = i th element = Ordinal or integer
 * o.b[i] = i th bracket = integer */
Ordinal.prototype.parse = function(text){
}
Ordinal.prototype.toString = function(){
  var outstr="";
  switch(this.t){
    case "0":
      outstr+="0";
    break;
    case "+":
      for(var i=0;i<this.a.length;i++){
        if(i>0)outstr+="+";
        outstr+=this.a[i].toString();
      }
    break;
    case ",":
      outstr+="(";
      for(var i=0;i<this.a.length;i++){
        if(i>0)outstr+=",";
        outstr+=this.a[i].toString();
      }
      outstr+=")";
    break;
    default:
      return "error:this.type="+this.type;
    break;
  }
  return outstr;
}
