function WMS(url) {

  this.url = url;

  this.wmsCapabilities2Context=new XslProcessor(baseDir + "/widget/wms/WMSCapabilities2Context.xsl");

  this.paint= function() {

    var s = this.wmsCapabilities2Context.transformNode(this.url);

    alert(s);

  }

}

