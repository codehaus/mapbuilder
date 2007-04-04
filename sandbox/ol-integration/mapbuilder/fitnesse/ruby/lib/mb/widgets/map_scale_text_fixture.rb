# Released under the terms of the GNU General Public License version 2 or later.
# $Id$
# $Rev$

require 'mb/widgets/widget_fixture'

# Testing of DragPan Widget

module Mb
  module Widgets

    class MapScaleTextFixture < WidgetFixture
        attr_accessor
    
      def initialize
        super
      end
      
      def bbox
        bbox = @model.bbox
        return bbox
      end
      
      
      def scale value
        text_field = @ie.text_field(:name, 'mapScale') 
        if text_field.exists? 
          puts "scale:"+ value.to_s
          text_field.set( value.to_s )
          # send a CR
          @autoit.Send "{ENTER}"
          @model.map_loaded?
        else
          puts "scale text not found"
        end
      end
      
      def reset
        button = @ie.image(:id, 'reset_image') 
        if button.exists? 
          button.click 
         end
      end
        
      def results
        true
      end
       
    end
  end
end