Bms = function(){
};

Bms.parse = function(str){
  return Ordinal.parse_md_paren_bracket(new Bms(), str);
}
