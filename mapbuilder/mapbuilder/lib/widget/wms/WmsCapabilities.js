function WMS(url, node) {

  this.url = url;

  this.node=node;

  this.wms = Sarissa.getDomDocument();

  this.wms.async = false;

  // the following two lines are needed for IE

  this.wms.setProperty("SelectionNamespaces", "xmlns:xsl='http://www.w3.org/1999/XSL/Transform'");

  this.wms.setProperty("SelectionLanguage", "XPath");

  this.wms.load(url);

  this.wmsCapabilities2Context=new XslProcessor(baseDir + "/widget/wms/WMSCapabilities2Context.xsl");

  this.paint= function() {

    var s = this.wmsCapabilities2Context.transformNode(this.wms);

    alert(s);

    prompt("context", s);

  }

}

