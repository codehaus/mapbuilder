# Released under the terms of the GNU General Public License version 2 or later.
# $Id$
# $Rev$

require 'mb/widgets/widget_fixture'

# Testing of SetAOI Widget
module Mb
  module Widgets
    class SetaoiFixture < WidgetFixture
      attr_accessor :coords
    
      def initialize
        super
      end
      
      def aoi_button
        puts "check aoi button"
        button = @ie.image(:id, 'setAoi_image') 
        button.exists? ? true : false 
      end
      
      # check that the aoi form is there
      def aoi_html_form
        puts "check aoi html form"
        form = @ie.form(:name, /AoiForm/)
        #puts form.to_s
        form.exists? ? true : false
        true
      end
      
      def set_aoi
        button = @ie.image(:id, 'setAoi_image') 
        if button.exists? 
          puts "press set aoi"
          button.click 
          arr = coords.split(" ")
          #arr.each { |c| puts "pix:"+c }
          @autoit.MouseClickDrag 'left', arr[0], arr[1], arr[2], arr[3]
        end
      end
    
      def values

        north = @ie.hidden(:name, "northCoord").value
        west  = @ie.hidden(:name, "westCoord").value
        south = @ie.hidden(:name, "southCoord").value
        east  = @ie.hidden(:name, "eastCoord").value
        
        bbox  = north.to_s + " " + west.to_s + " " + south.to_s + " " + east.to_s
      end
      
    end
  end
end