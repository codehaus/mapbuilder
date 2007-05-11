# Released under the terms of the GNU General Public License version 2 or later.
# $Id$
# $Rev$

require 'mb/widgets/widget_fixture'

# Testing of Layer Control Widget for the Complete demo
module Mb
  module Widgets
    class LayerControl < WidgetFixture
      attr_accessor :present
 
      def initialize
        super
      end
      
      def Bathymetry_off
        layer_off "Bathymetry"
      end
      
      def Bathymetry_on
        layer_on "Bathymetry"
      end
      
      def bathymetry_visible
        layer_visible "Bathymetry"
      end
      
      def Bathymetry_delete
        layer_delete "Bathymetry"
      end
      
      def bathymetry_deleted
        layer_present "Bathymetry"
      end
      
      def Countries_off
        layer_off "Countries"
      end
      
      def Countries_on
        layer_on "Countries"
      end
      
      def countries_visible
        layer_visible "Countries"
      end
      
      def Countries_delete
        layer_delete "Countries"     
      end
      
      def countries_deleted
        layer_present "Countries"
      end
      
      
      def Hillshading_off
        layer_off "Hillshading"
      end
      
      def Hillshading_on
        layer_on "Hillshading"
      end
      
      def hillshading_visible
        layer_visible "Hillshading"
      end
      
      def Hillshading_delete
        layer_delete "Hillshading"     
      end
      
      def hillshading_deleted
         layer_present "Hillshading"     
     end
      
      def Topography_off
        layer_off "Topography"
      end
      
      def Topography_on
        layer_on "Topography"
      end
      
      def topography_visible
        layer_visible "Topography"
      end
      
      def Topography_delete
        layer_delete "Topography"     
      end
      
      def topography_deleted
        layer_present "Topography"
      end
      
      def layer_on name
        @ie.checkbox(:id,"vis_"+name).set
      end
      def layer_off name
        @ie.checkbox(:id,"vis_"+name).clear
      end
      
      def layer_visible name
        idstr = "mainMap_mainMapWidget_"+name
        regexp = "//div[@id='"+idstr+"']"
        
        # This shoudl work with Watir 1.5 but not now
        #div = @ie.div(:xpath, regexp)
        #div = @ie.div(:id, idstr)
        #visibility = div.ole_element.style.visibility
        #puts "vis:"+visibility
        
        doc = @ie.rexml_document_object
        style = Hash.new
        doc.elements.each(regexp) do |element| 
          styleArr = element.attributes["style"].split(";")
          #puts "element:"+ element.to_s
          styleArr.each do |attr| 
            key,value = attr.split(":")
            style[key.strip]=value.strip
            #puts ">"+key + "--" + value+"<"
          end
          #style.each { |key,value| puts key +"-"+value}
        end
        #puts style['VISIBILITY']
        if style['VISIBILITY'] == 'hidden'
          return false
        else
          return true
        end
      end
      
      def layer_delete name
        #pattern = "/'deleteLayer','"+name+"'/"
        pattern = "/"+name+"/"
        link = @ie.link(:href, eval("/'deleteLayer','"+name+"'/") ).click
      end
      
      def layer_present name
        idstr = "mainMap_mainMapWidget_"+name
        div = @ie.div(:id, idstr)
        div.exists?
      end
      
      def thumbnail_visible
        img = @ie.image(:id,"previewImage")
        if( img.hasLoaded? )
          puts "img loaded:"
          return true
        else
          puts "img not loaded"
          return false
        end
      end
      
      def refresh
        @ie.refresh
      end
      
    end
  end
end