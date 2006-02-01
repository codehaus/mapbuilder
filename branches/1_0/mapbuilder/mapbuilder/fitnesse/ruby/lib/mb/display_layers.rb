# Copyright (c) 2002 Cunningham & Cunningham, Inc.
# Released under the terms of the GNU General Public License version 2 or later.

require 'fit/row_fixture'
require 'mb/browser'

module Mb
 
  class DisplayLayers < Fit::ColumnFixture
    attr_accessor :layer_name, :map, :result
    def initialize
      super
      @ie      = Browser.attach( /Mapbuilder/ )
      @pattern = 'Loading'
    end
    
    def loaded
      idstr = map+"_"+map+"Widget_"+layer_name
      # this should work but has a problem with complete demo
      #regexp = "//div[@id='"+idstr+"']/img"
      #img = @ie.element_by_xpath( regexp )
      regexp = "//div[@id='"+idstr+"']"
      div = @ie.element_by_xpath( regexp )
      if div != nil
        elt = Element.new( div.firstChild )
        @result = elt.src
        #puts regexp +" "+@result
        
        if @result.include? "Loading" 
          false
        else
          true
        end
      else
        puts "Could not find it:"+regexp
        @result = 'UNKNOWN'
        false
      end
    end
    
    def src
      @result
    end
    
  end   
  
end
