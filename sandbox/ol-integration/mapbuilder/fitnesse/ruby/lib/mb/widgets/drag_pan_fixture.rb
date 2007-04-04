# Released under the terms of the GNU General Public License version 2 or later.
# $Id$
# $Rev$

require 'mb/widgets/widget_fixture'

# Testing of DragPan Widget

module Mb
  module Widgets

    class DragPanFixture < WidgetFixture
        attr_accessor :bbox1, :bbox2, :bbox3,
          :start_from, :drag_to
    
      def initialize
        super
      end
      
      def bbox1
        #@model.map_loaded?
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
      
      def drag
        button = @ie.image(:id, 'dragPan_image') 
        if button.exists? 
          button.click 
          arr1 = @start_from.split(" ")
          arr2 = @drag_to.split(" ")
      
          @autoit.MouseClickDrag 'left', arr1[0], arr1[1], arr2[0], arr2[1]
          @model.map_loaded?
         end
      end
      
      def reset
        button = @ie.image(:id, 'reset_image') 
        if button.exists? 
          button.click 
          #if @model.map_loaded?
            return true
          #end
        end
        return false
      end
         
    end
  end
end