# Released under the terms of the GNU General Public License version 2 or later.
# $Id$
# $Rev$

require 'mb/widgets/widget_fixture'

# Testing of Back Widget

module Mb
  module Widgets

    class BackFixture < WidgetFixture
        attr_accessor :bbox1, :bbox2, :bbox3
    
      def initialize
        super
      end
      
      def bbox1
        @model.map_loaded?
        @bbox1 = @model.bbox
        return @bbox1
      end
      
      def bbox2
        @bbox2 = @model.bbox
        return @bbox2
      end
      
      def bbox3
        @bbox3 = @model.bbox
        return @bbox3
      end
      
      def zoomin
        button = @ie.image(:id, 'zoomIn_image') 
        if button.exists? 
          button.click 
          @autoit.MouseClick "left", 190, 350
          @model.map_loaded?
         end
      end
      
      def back
        button = @ie.image(:id, 'back_image') 
        if button.exists? 
          button.click 
          @model.map_loaded?
         end
      end
      
      def reset
        button = @ie.image(:id, 'reset_image') 
        if button.exists? 
          button.click 
         end
      end
      
      def back_to_bbox2
        bbox = @model.bbox
        bbox == @bbox2 ? true : false
         
      end
      
      def back_to_bbox1
        bbox = @model.bbox
        bbox == @bbox1 ? true : false
      end
         
    end
  end
end