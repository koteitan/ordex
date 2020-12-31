/*Kuma3ary = Initialize this object in T for kuma kuma 3-ary Psi by p and septype.
  (psi_a(b,c) is denoted with "(a,b,c)" in this document.)
  
  ex. new Kuma3ary("p",0); // means 0
  ex. new Kuma3ary("+",[Kuma3ary("p",0),Kuma3ary("p",0)]); // means 0+0
  ex. new Kuma3ary(",",[Kuma3ary("p",0),Kuma3ary("p",0),Kuma3ary("p",0)]); // means (0,0,0)
  ex. new Kuma3ary("s","(0,0,(0,0,0))+(0,0,0)"); // means (0,0,(0,0,0))+(0,0,0)
  
  type = {
    "p":primitive,
    "+":additive,
    ",":(a,b,c)
    "s":string to be parsed
  }.
  p is...
    if type == "p":
      if p == 0:
        The object will be 0.
      else if p>0:
        The object will be (0,0,0)+(0,0,0)+...(p times(0,0,0))...+(0,0,0).
      else if p == "w":
        the object will be (0,0,1).
    else if type == "str"
      the object will be created by string p.
    else if type == "+":
     the object will be p[0]+p[1]+p[2]....
    else if type == ",":
     the object will be (p[0],p[1],p[2]).
 */
Kuma3ary = function(){
  Ordinal.call(this);
}
Kuma3ary.prototype = Object.create(Ordinal.prototype);
