require 'fit/fixture'
require 'mb/browser'
require 'mb/widgets/widget_fixture'
require 'watir/dialog'

# Bug duplication
# http://sourceforge.net/tracker/index.php?func=detail&aid=1386497&group_id=35246&atid=413775


module Mb
  module Bugs
    class Bug1386497 < Mb::Widgets::WidgetFixture
      attr_accessor :start_from, :drag_to
                    
      def initialize
        super
      end
      
      def layer_attributes
        imgs = @ie.elements_by_xpath('//img[contains(@id, "real")]')
        
        imgs.each do |img|
          #remove the url
          puts img.src
          url = img.src.split("?")
          puts url[1]
          attrs = url[1].split("&")
          map = Hash.new
          
          attrs.each do |attr|
            keyval = attr.split("=")
            puts keyval[0].to_s + "-" + keyval[1].to_s
            map[keyval[0]] = keyval[1] 
          end
          
          width = map["WIDTH"]
          height = map["HEIGHT"]
          puts width+" "+height
          if !width.include? "px"
            puts "no width px"
          
            return false
          end
          
          if !height.include? "px"
            puts "no height px"
            return false
          end
        end
        false
      end
      
      def refresh
        @ie.refresh
      end
    end
  end
end
    
 