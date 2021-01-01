/* @fn new Kuma3ary(t,a)
 * @brief initialize a new object for kuma kuma 3-ary Psi by t and a.
 * @param t = {"0", "1", "2", ... , "9", "w","+",","} = initialize type
 *  When t = "0" -- "9", the object is initialized as the natural number.
 *  When t = "w"       , the object is initialized as the first transfinite ordinal.
 *  When t = "+" and a=[a0,a1,...,aN], the object is initialized as the ordinal which indicates a0+a1+a2...aN.
 *  When t = "," and a=[a0,a1,...,aN], the object is initialized as the ordinal which indicates (a0,a1,a2,...,aN).
 * @param a = parameter set for "+" and ",". see reference for t.
 */
Kuma3ary = function(t,a){
  /* programmer memo: Define conversion from suger syntax to the object here. */
  switch(t){
    case "0":
      this.t="0";
      this.a=null;
    return;
    case "1":
      this.t=",";
      this.a=[new Kuma3ary("0"),new Kuma3ary("0"),new Kuma3ary("0")];
    return;
    case "w": //omega
      this.t=",";
      this.a=[new Kuma3ary("0"), new Kuma3ary("0"), new Kuma3ary("1")];
    return;
    default:
    break;
  }
  if(t!="" && isFinite(t)){ //nat
    this.t="+";
    this.a=new Array(parseInt(t));
    for(var i=0;i<this.a.length;i++){
      this.a[i]=new Kuma3ary("1");
    }
    return;
  }
  
  /* programmer memo:  "+", "," can be parsed by Ordinal built-in function. */
  Ordinal.call(this,t,a);
}

/* @fn Kuma3ary.toSugar
 * @brief Callback for sugar for toString(sugar). 
 * @detail When you use kuma.toString(), if you add the function for the parameter of toString() like kuma.toString(Kuma3ary.toSugar), toString will become to use the sugar syntax defined in the function. 
 * @param str = input string from toString().
 * @returns str = modified string which is finally output by toString(). */
Kuma3ary.toSugar = function(str){
  /* programmer memo: Define conversion from the object to the suger syntax here. */
  switch(str){
    case "(0)": case "(0,0)": case "(0,0,0)":
    return "1";
    case "(1)": case "(0,0,1)": case "(0,0,1)":
    return "w";
  }
  return str;
}

/* programmer memo: Please put the code as following to make the type Kuma3ary the extension of the type Ordinal. */
/* ------------------0---------------------------------- begin */
Kuma3ary.prototype = Object.create(Ordinal.prototype);
Object.defineProperty(Kuma3ary.prototype, 'constructor', 
  {value:Kuma3ary, enumerable:false, writable:true});
Kuma3ary.parse = Ordinal.parse;
/* ----------------------------------------------------- end */

