# MapBuilder Acceptance Test
# $Id$
# $Rev$
require 'net/http'
require 'open-uri'
require 'rexml/document'

module Mb

# Configuration class that holds and parse the config file
  class Config
    attr_accessor :doc
    
    def initialize ( url )
      puts "config file:"+url
      #file = File.new( configFile )
      #address=URI.escape(url)
      result=URI(url).read

      @doc = REXML::Document.new result
      
      #puts "config initialized"
    end
    
    def default_model_url
      #puts "default url..."
      @doc.elements.each("//Context[@id='mainMap']/defaultModelUrl") do
       |e|  
       url = e.get_text.value.to_s
       #puts "default:"+url
       #return it
       return url
      end  
    end
    
  end
end
