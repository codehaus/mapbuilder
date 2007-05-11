require 'fit/fixture'
require 'net/http'
require 'uri'
require 'watir'
include Watir

module Mb

  class CheckPage < Fit::Fixture
  
#Accessors
    attr_accessor :url,
                  :links,
                  :arr
                   
#Initialization
    def initialize
      super
      begin
        @ie = IE.attach( :title, /Mapbuilder/i ) unless @ie
      rescue
        @ie = nil
      end
      
      if @ie == nil
        # if not create a new one
        @ie = IE.new
      end
      
      @links = 'good'
      @arr = Hash.new
     end
    
#Actions
    def check_links
      puts "Checking Page:"+@url
      @ie.goto(@url)
      @ie.links.each { |l| try_it l.href }   
    end
  
    def try_it( href )
      print "href:"+href
      STDOUT.flush
      if href.index('http') != nil
        begin
          @arr[href] = -1
          url = URI.parse(href)
          response = Net::HTTP.get_response(url)
          puts " code: #{response.code}"
          @arr[href] = response.code
          
          case response
            when Net::HTTPSuccess,Net::HTTPRedirection then 
              true
            else
              puts "**FAILED LINK: "+href
              @links = 'fail'  
          end
          
          rescue
            puts "**FAILED LINK: "+href
            @links = 'fail'  
        end
      elsif
        puts " empty"
      end
    end
    
    def all_links
      @links
    end
    
    def results
      result = ""
      puts "results"
      @arr.each { |key,value| result+= key +" code:"+value + "<br>" }
      result 
    end
  end
end