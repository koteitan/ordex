// kuma kuma 3-ary Psi
Kuma3ary = function(str){
  Ordinal.parse(this, str, "recursive paren");
};

Kuma3ary.prototype.toString = function(){
  return Ordinal.toString(this, "recursive paren");
}