# Released under the terms of the GNU General Public License version 2 or later.
# $Id$
# $Rev$

require 'mb/widgets/widget_fixture'

# Testing of Zoomin Widget
module Mb
  module Widgets
    class ZoominFixture < WidgetFixture
    
      def initialize
        super
      end
      
      def zoomin_presence
        button = @ie.image(:id, 'zoomIn_image') 
        button.exists? ? true : false 
      end
      
      def zoomin_button
        #puts "press zoomin"
        button = @ie.image(:id, 'zoomIn_image') 
        if button.exists? 
          button.click 
        end
      end
    
      def zoom_factor
        #@model.map_loaded?
        bbox = @model.bbox
        oldCoords = bbox.split(" ")
        oldCoords.each { |coord| puts coord +" " }
        oldDeltaLong = oldCoords[0].to_f - oldCoords[2].to_f
        
        @autoit.MouseClick "left", 190, 350
        @model.map_loaded?
        newbbox = @model.bbox
        newCoords = newbbox.split(" ")
        newDeltaLong = newCoords[0].to_f - newCoords[2].to_f
        
        oldDeltaLong/newDeltaLong
      end
      
    end
  end
end