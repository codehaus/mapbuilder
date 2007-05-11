# Released under the terms of the GNU General Public License version 2 or later.
# $Id$
# $Rev$

require 'open-uri'
require 'rexml/document'
require 'mb/widgets/widget_fixture'

# Testing of ModelUrlInput Widget
module Mb
  module Widgets
    class ModelUrlInputFixture < WidgetFixture
        attr_accessor :url
        
      def field_present
        @button = @ie.text_field(:name, 'defaultUrl')
        @button.exists? ? true : false
      end
      
      def load
        @button.set(url)
        link = @ie.link(:text, /load/)
        if link.exists?
          link.click
          # reloading new model
          sleep 2
          @model = Model.new
          Browser.set_model(@model)
        else
          puts "load link does not exist"
        end
      end
      
      def model_loaded
        @model.map_loaded?
      end
      
      # hit browser back button to go back and refresh
      # back to previous model
      def go_back
        @ie.back
        true
      end
      
    end
  end
end