# Released under the terms of the GNU General Public License version 2 or later.
# $Id$
# $Rev$

require 'mb/widgets/widget_fixture'

# Testing of Layer Control Widget for the Complete demo
module Mb
  module Widgets
    class Language < WidgetFixture
      attr_accessor :lang
 
      def initialize
        super
      end
      
      def francais
        @lang = "fr"
        @ie.link(:href, /language=fr/).click
        @model.map_loaded?
        @doc = @ie.rexml_document_object
       end
      
      def english
        @lang = "en"
        puts "en"
        @ie.link(:href, /language=en/).click
        @model.map_loaded?
        @doc = @ie.rexml_document_object
      end
      
      def legend
        regexp = "//td[@id='legend']/table/tbody/tr/th"
        case @lang
          when "en"       
            @doc.elements.each(regexp) do |element| 
              puts "th:"+element.to_s
              if element.to_s.include? "Map Layers"
                return true
              end
            end
            false
            
          when "fr"
            @doc.elements.each(regexp) do |element| 
              puts "th:"+element.to_s
              if element.to_s.include? "Couches de la carte"
                return true
              end
            end
            false
            
          else
            puts "Invalid langage"
            false
        end
      end
      
      def model_url_input
        regexp = "//td[@id='urlInput']/div/form"
        case @lang
          when "en"       
            @doc.elements.each(regexp) do |element| 
              puts "th:"+element.to_s
              if element.to_s.include? "load"
                return true
              end
            end
            false
            
          when "fr"
            @doc.elements.each(regexp) do |element| 
              puts "th:"+element.to_s
              if element.to_s.include? "téléchargez"
                return true
              end
            end
            false
            
          else
            puts "Invalid langage"
            false
        end
      end
      
      def aoi_form
       regexp = "//td[@id='aoiForm']/div/form/table/tbody/tr/th"
        case @lang
          when "en"       
            @doc.elements.each(regexp) do |element| 
              puts "th:"+element.to_s
              if element.to_s.include? "Area of interest coordinates"
                return true
              end
            end
            false
            
          when "fr"
            @doc.elements.each(regexp) do |element| 
              puts "th:"+element.to_s
              if element.to_s.include? "Coordonées de la région d`intéret"
                return true
              end
            end
            false
            
          else
            puts "Invalid langage"
            false
        end
      end
      
      def nts_lookup_service_form
        regexp = "//td[@id='ntsLookupForm']/div/form/table/tbody/tr/th"
        case @lang
          when "en"       
            @doc.elements.each(regexp) do |element| 
              puts "th:"+element.to_s
              if element.to_s.include? "NTS Lookup web service"
                return true
              end
            end
            false
            
          when "fr"
            @doc.elements.each(regexp) do |element| 
              puts "th:"+element.to_s
              if element.to_s.include? "Service de recherche par SNRC"
                return true
              end
            end
            false
            
          else
            puts "Invalid langage"
            false
        end
     end
     
    end
  end
end
 