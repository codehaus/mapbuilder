
var initOL = new InitOL();

function InitOL(){
    this.createScriptElement = function(srcURL) {
        var scriptElement = document.createElement("script");
        scriptElement.setAttribute("id", new Date().getTime());
        scriptElement.setAttribute("type", "text/javascript");
        scriptElement.setAttribute("src", srcURL);
        document.getElementsByTagName('head')[0].appendChild(scriptElement);
    }
        this.createScriptElement('/mapbuilder/lib/util/openlayers/OpenLayers_comp.js');
        this.createScriptElement('/mapbuilder/lib/util/openlayers/georss/src/GeoRSSmb.js');
        this.createScriptElement('/mapbuilder/lib/util/openlayers/georss/src/GeoRSSvector.js');
        this.createScriptElement('/mapbuilder/lib/util/openlayers/georss/src/GMLmb.js');
        
        
}