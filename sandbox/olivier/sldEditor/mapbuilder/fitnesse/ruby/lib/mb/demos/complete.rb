# Released under the terms of the GNU General Public License version 2 or later.
# $Id$
# $Rev$

require 'fit/fixture'
require 'mb/browser'


# Testing of Complete Demo
module Mb
  module Demos
    class Complete < Fit::Fixture
      attr_accessor :timeout
       
      def initialize
        super
        @ie       = Browser.attach( /Mapbuilder/ )
        @autoit   = Browser.automation
        @model    = Browser.model
        @timeout  = 10
      end
      
      def map_loaded
        sleep 1
        @model.map_loaded?
      end
      
      def Atlas_World_base_map
        @ie.link(:text, "Atlas World base map").click
      end
      def Demis_World_map
        @ie.link(:text, "Demis World map").click
      end
      
      def Canadian_Digital_Elevation_Data
        @ie.link(:text, /Canadian Digital Elevation Data/).click
      end
      
      def Landsat_Orthorectified_Imagery_over_Canada
        @ie.link(:text, /Landsat Orthorectified Imagery over Canada/).click
      end
   
      def Mars_landings
        @ie.link(:text, /Mars landings/ ).click
      end
      
      def MODIS_world_mosaic
        @ie.link(:text, /MODIS world mosaic/).click
      end
 
      def Radarsat_Mosaic_of_Canada
        @ie.link(:text, /Radarsat Mosaic of Canada/).click
      end
      
      def Cite_Reference_local_geoserver
        @ie.link(:text, /local geoserver/).click
      end
      
      def Cite_Reference_deegree_server
        @ie.link(:text, /deegree server/).click
      end
      
      def SLD_param_example
        @ie.link(:text, /SLD param example/).click
      end
      
      def Boston
        @ie.link(:text, /Boston/).click
      end
      
      def External_server_example
        @ie.link(:text, /External server example/).click
      end
      
    end
  end
end