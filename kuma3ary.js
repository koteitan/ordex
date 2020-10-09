// kuma kuma 3-ary Psi
Kuma3ary = function(){
};

Kuma3ary.parse = function(str){
  return Ordinal.parse_md_paren_bracket(new Kuma3ary(), str);
}
