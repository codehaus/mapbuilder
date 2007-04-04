# Copyright (c) 2002 Cunningham & Cunningham, Inc.
# Released under the terms of the GNU General Public License version 2 or later.

require 'test/unit'
# Make the test run location independent
$:.unshift File.join(File.dirname(__FILE__), '../../..', 'lib')
require 'mb/widgets/cursor_track'

module Mb
 module Widgets
  class CursorTrackTest < Test::Unit::TestCase
  
     def test_degree_test
        @tc =CursorTrackFixture.new
        @tc.window_title = "Ship Tracks Demo"
        @tc.pixelxy = "504 439"
        @tc.long_lat = "-79.6 26.10"
        @tc.degree_test
      end
  end
 end
end
  
