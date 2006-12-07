# Released under the terms of the GNU General Public License version 2 or later.
# $Id$
# $Rev$

require 'mb/widgets/widget_fixture'

# Testing of GetFeatureInfo Widget
module Mb
  module Widgets
    class GetFeatureInfo < WidgetFixture
      attr_accessor :button_present, :x, :y
 
      def initialize
        super
        @button_present = false
      end
      
      def info_presence
        button = @ie.image(:id, 'getFeatureInfo_image') 
        button.exists? ? @button_present = true : @button_present = false
        @button_present 
      end
      
      def info_button
        #puts "press info"
        if @button_present
          button = @ie.image(:id, 'getFeatureInfo_image') 
          if button.exists? 
            button.click 
          end
        else
          puts "button not present"
        end
      end
    
      def click_map
        @autoit.MouseClick "left", @x, @y
      end
      
      def info
        false
      end
      
    end
  end
end