# Released under the terms of the GNU General Public License version 2 or later.
# $Id$
# $Rev$

require 'mb/widgets/widget_fixture'

# Testing of Zoomout Widget
module Mb
  module Widgets
    class ZoomoutFixture < WidgetFixture
    
      def initialize
        super
      end
      
      def zoomout_presence
        button = @ie.image(:id, 'zoomOut_image') 
        button.exists? ? true : false 
      end
      
      def zoomout_button
        #puts "press zoomout"
      
        button = @ie.image(:id, 'zoomOut_image') 
        if button.exists? 
          button.click 
        end
      end
    
      def zoom_factor
        bbox = @model.bbox
        oldCoords = bbox.split(" ")
        #oldCoords.each { |coord| puts coord +" " }
        oldDeltaLong = oldCoords[0].to_f - oldCoords[2].to_f
        
        @autoit.MouseClick "left", 190, 300
        @model.map_loaded?
        newbbox = @model.bbox
        newCoords = newbbox.split(" ")
        newDeltaLong = newCoords[0].to_f - newCoords[2].to_f
        
        oldDeltaLong/newDeltaLong
      end
      
    end
  end
end