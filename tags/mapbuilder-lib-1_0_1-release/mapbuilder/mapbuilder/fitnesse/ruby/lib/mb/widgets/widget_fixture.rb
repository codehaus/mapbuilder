# Released under the terms of the GNU General Public License version 2 or later.
# $Id$
# $Rev$

require 'mb/browser'
require 'fit/fixture'

module Mb
  module Widgets
    class WidgetFixture < Fit::Fixture
    
      def initialize
        super
        @ie = Browser.create
        @autoit = Browser.automation
        @config = Browser.config
        @model = Browser.model
        #@model.read_model
      end
      
      def tested
        false
      end
    end
  end
end