# $Id$
# $Rev$

require 'fit/fixture'
require 'mb/browser'

module Mb

  class Setup < Fit::Fixture
     
    def initialize 
      super
    end
    
    def host(name)
      Browser.host(name)
    end
    
    def webapp(name)
      Browser.webapp(name)
    end
    
    def config_file(name)
      Browser.config_file(name)
    end
   
    def goto_it
      Browser.goto
    end
  end
end
