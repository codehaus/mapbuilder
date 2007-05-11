require 'fit/fixture'
require 'mb/browser'


# Testing of MainButtonBar Widget
module Mb

  class Model < Fit::Fixture
    attr_accessor :url,
                  :timeout
                  
    def initialize
      super
      @ie      = Browser.attach( /Mapbuilder/ )
      @autoit  = Browser.automation
      @pattern = 'Loading'
      @timeout = 10
      Browser.set_model( self )
    end
 
    #Fixture check for loaded model
    def model_loaded
      map_loaded?
    end
    
    # Ruby checks if map reloaded properly
    def map_loaded?
      loaded = false
      imgs = @ie.elements_by_xpath('//img[contains(@id, "real")]')
         
      begin   
        status = Timeout::timeout( @timeout, e=Timeout::Error ) {
          while !loaded
            sleep 1
            loaded = true
            imgs.each do |img|
              #puts "Checking img:"+img.src
              if img.src.include? "Loading"
                loaded = false
              end
            end
          end
          puts "loaded:"+loaded.to_s
        }
        return loaded  
      rescue Exception => e
        puts "map not loaded:"
        #imgs = @ie.elements_by_xpath('//img[contains(@id, "real")]')
        #if imgs != nil
        #  imgs.each { |img| puts img.src }
        #end
        false
      end
    end
 
  end
end