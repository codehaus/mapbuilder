# Released under the terms of the GNU General Public License version 2 or later.
# $Id$
# $Rev$

require 'fit/fixture'
require 'mb/browser'


# Testing of ContextEditor Demo
module Mb
  module Demos
    class ContextEditor < Fit::Fixture
      attr_accessor 
      
      def initialize
        super
        @ie      = Browser.attach( /Mapbuilder/ )
        @autoit  = Browser.automation
        @model = Browser.model
      end
      
      def Map_Collection
        #click on Map Collection link
        @ie.link(:text, "Map collection").click
      end
      
      def map_loaded
        sleep 1
        @model.map_loaded?
      end
      
      def Demis_World_map
        @ie.link(:text, "Demis World map").click
      end
      
      def Atlas_World_base_map
        @ie.link(:text, "Atlas World base map").click
      end
      
    end
  end
end