
function Attribute(name,type,min,max,enumeration){
  this.name=name;
  this.type=type; // "text", "number", "date", "geometry"
  this.min=min; // for numeric attributes, minimum value
  this.max=max; // for numeric attributes, maximum value
  this.enumeration=enumeration; // for attributes limited to an enumeration, acceptable values
  this.childs=null; // for complex elements, child attributes, which would themselves be of type new Attribute()
}
