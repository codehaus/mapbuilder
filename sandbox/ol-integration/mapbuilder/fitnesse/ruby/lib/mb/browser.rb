require 'mb/model'
require 'mb/config'
require 'win32ole'
require 'watir'
include Watir

module Mb

  # Singleton Mapbuilder class to be reused by all tests
  class Browser
    private_class_method :new
    @@ie = nil
    @@autoit = nil
    @@model = nil
    @@config = nil
    @@host = nil
    @@webapp = nil
    @@configFile = nil
    
    # Setters
    def Browser.config_file( name )
      @@configFile = name
    end
    def Browser.host( hostName )
      @@host = hostName
    end
    def Browser.webapp( webAppName )
      @@webapp = webAppName
    end
    # Getters
    def Browser.get_host
      @@host
    end    
    def Browser.get_webapp
      @@webapp
    end
    
    # Create new browser
    def Browser.create
      # try to attach to Browser Window to resuse it
      @@ie = Browser.attach( /Mapbuilder/i ) unless @@ie
      
      if @@ie == nil
        # if not create a new one
        @@ie = IE.new unless @@ie
      end
      
      @@ie
    end
    
    # Goto specified webapp
    def Browser.goto
      @@ie = Browser.create
      @@ie.goto( @@host + "/" + @@webapp)
    end
    
    # Attach to existing window by title
    def Browser.attach title 
      begin
        @@ie = IE.attach(:title, title)
      rescue
        puts "could not attach to window"
        @@ie = nil
      end
      return @@ie
    end
    
    # Retrieve current model or create a new one
    def Browser.model
      @@model = Model.new unless @@model
      @@model
    end
    
    # force a new model
    def Browser.set_model( myModel )
      @@model = myModel
    end
    
    def Browser.config
      file = @@host +'/'+@@webapp+'/'+@@configFile
      @@config = Config.new(file) unless @@config
      @@config
    end
    
    # Create automation controller
    def Browser.automation
      #Browser.check_autoit_installed
      @@autoit = WIN32OLE.new('AutoItX3.Control') unless @@autoit
      # mouse relative to current window
      @@autoit.Opt "MouseCoordMode", 0
      @@autoit
    end
    
    # Checks if Autoit is installed
    def Browser.check_autoit_installed
      begin
        WIN32OLE.new('AutoItX3.Control')
      rescue
        raise Watir::Exception::WatirException, "The AutoIt dll must be correctly registered for this feature to work properly"
      end
    end
    
  end
end