# Released under the terms of the GNU General Public License version 2 or later.
# $Id$
# $Rev$

require 'mb/widgets/widget_fixture'

# Testing of Model Switcher Widget

module Mb
  module Widgets

    class ModelSwitcherFixture < WidgetFixture
        attr_accessor :bbox1, :bbox2
    
      def initialize
        super    
      end
      
      def bbox1
        @bbox1 = @model.bbox
        return @bbox1
      end
      
      def bbox2
        @bbox2 = @model.bbox
        return @bbox2
      end
      
      def same_bbox
        if @bbox1 == @bbox2
          true
        else
          false
        end
      end
      
      def map_loaded
        @model.map_loaded?
      end
      
      def world
        @ie.button(:value, "World").click
        sleep 1
        @model=Model.new
      end
      
      def usa_streets
        @ie.button(:value, "USA Streets").click
        sleep 1
        @model=Model.new
      end
      
      def satellite
        @ie.button(:value, "Satellite").click
        sleep 1
        @model=Model.new
      end
      
      def refresh
        @ie.refresh
      end
      
    end
    
  end
end
 