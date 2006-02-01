# Released under the terms of the GNU General Public License version 2 or later.
# $Id$
# $Rev$

require 'open-uri'
require 'rexml/document'
require 'mb/widgets/widget_fixture'

# Testing of Reset Button Widget
module Mb
  module Widgets
    class ResetFixture < WidgetFixture
        attr_accessor :config_bbox
        
      def initialize
        super
        @config_bbox=nil
      end
      
      def reset_presence
        button = @ie.image(:id, 'reset_image') 
        button.exists? ? true : false 
      end
      
      def reset_button
        button = @ie.image(:id, 'reset_image') 
        if button.exists? 
          button.click 
          sleep 1
        end
      end
      
      def current_bbox
        bbox = @model.bbox.split(" ")
        #might need to round things up to pass test
        a=sprintf( "%d %d %d %d", bbox[0].to_i,
          bbox[1].to_i, bbox[2].to_i, bbox[3].to_i)      
        return a
        end
      
      def config_bbox
        config = @config.default_model_url
        #puts "config_bbox:"+config
        url = Browser.get_host+"/"+ Browser.get_webapp+"/"+ config
        result=URI(url).read
        doc = REXML::Document.new result
        doc.elements.each("//BoundingBox") do
         |e|
         #puts "elt:"+e.to_s  
         minx = e.attributes["minx"]
         #puts minx.to_s
         miny = e.attributes['miny']
         #puts miny
         maxx = e.attributes['maxx']
         #puts maxx
         maxy = e.attributes['maxy']
         #puts maxy
         @config_bbox = minx + " " + miny + " " + maxx + " " + maxy
         return @config_bbox
        end
        
      end
      
      def zoomin_action
        @ie.image(:id, 'zoomIn_image').click
        @autoit.MouseClick "left", 190, 350
      end
      
      def map_loaded
        @model.map_loaded?
      end
      
      # make sure we have reset the map
      def reset
        @model.map_loaded?
        if @config_bbox == nil
          config_bbox
        end
        # find the bbox from the original config file
        #config_bbox
        #puts "current:"+@model.bbox
        #puts "config:" + @config_bbox
        if current_bbox == @config_bbox
          true
        else
          false
        end
      end
    end
  end
end