# Released under the terms of the GNU General Public License version 2 or later.
# $Id$
# $Rev$

require 'fit/fixture'
require 'mb/browser'


# Testing of Time Series Demo
module Mb
  module Demos
    class TimeSeries < Fit::Fixture
      attr_accessor :timeout
       
      def initialize
        super
        @ie       = Browser.attach( /Mapbuilder/ )
        @autoit   = Browser.automation
        @model    = Browser.model
        @timeout  = 10
      end
      
      def The_BALANCE_Climate_Change_Visualization_Server
        @ie.link(:text, "The BALANCE Climate Change Visualization Server").click
      end
      
      def map_loaded
        sleep 1
        @model.map_loaded?
      end
      
      def wms_capabilities_loaded
        begin   
        
        status = Timeout::timeout( @timeout, e=Timeout::Error ) {
          while !table = @ie.table(:id, 'workspaceCanvas')
            sleep 1
          end
          return true
        }
      rescue Exception => e
        false
      end
      end
      
      def Precipitation_Anomalies
        @ie.link(:text, "Precipitation Anomalies (IRI Columbia U.)").click
      end
      
      def Estimated_Precipitation_Africa
        @ie.link(:text, "Estimated Precipitation Africa (10-day) (IRI Columbia U.)").click
      end
   
      def World_Temperature
        @ie.link(:text, "World Temperature (NASA)").click
      end
      
      def load
        @ie.link(:text, "load").click
      end
    end
  end
end