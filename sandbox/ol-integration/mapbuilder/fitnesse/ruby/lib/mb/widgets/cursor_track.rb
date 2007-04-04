# Released under the terms of the GNU General Public License version 2 or later.
# $Id$
# $Rev$

require 'fit/fixture'
require 'win32ole'
require 'watir'
include Watir
# Testing of cursor

module Mb
  module Widgets

    class CursorTrackFixture < Fit::Fixture
      attr_accessor :pixelxy, :window_title, :long_lat
      @@autoit = nil
      @ie=nil
      
      def initialize
        super
        @@autoit = WIN32OLE.new('AutoItX3.Control') unless @@autoit
        # mouse relative to current window
        @@autoit.Opt "MouseCoordMode", 0
      end
      
      def degree_test
        attach_window
        mouse_move
        return check_lat_lon
      end
       
      def attach_window
          title_regex = Regexp.new('^'+window_title)
          @ie = IE.attach(:title, title_regex)
      end
      
      def mouse_move      
        pix = @pixelxy.split(" ")
        @@autoit.MouseMove pix[0], pix[1]
        
      end

      def check_XY
       xPix = @ie.text_field(:name, "px").value
       yPix = @ie.text_field(:name, "py").value
       return true       
    end
    
    def check_lat_lon
       loPix = @ie.text_field(:name, "longitude").value
       laPix = @ie.text_field(:name, "latitude").value
       expected_strs = @long_lat.split(" ");
       longDeg = round_text(expected_strs[0])
       latDeg = round_text(expected_strs[1])
       return (round_text(loPix) == longDeg && latDeg == round_text(laPix))
    end  
    
    def round_text str
      flt = Float( str)
      flt.round
      end
    end
  end
end    