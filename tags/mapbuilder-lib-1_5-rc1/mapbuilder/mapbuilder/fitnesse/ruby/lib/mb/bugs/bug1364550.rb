require 'fit/fixture'
require 'mb/browser'
require 'mb/widgets/widget_fixture'
require 'watir/dialog'

# Bug duplication
# http://sourceforge.net/tracker/index.php?func=detail&aid=1364550&group_id=35246&atid=413775


module Mb
  module Bugs
    class Bug1364550 < Mb::Widgets::WidgetFixture
      attr_accessor :url
                    
      def initialize
        super
      end
      
      def hide_precipitation_layer
        @ie.eval_in_spawned_process <<-END
          checkbox(:id, "legend_est_prcp").click
        END
        sleep 2
      end
      
      # Error dialog appear if there is a problem
      # raise error and close dialog
      def dialog_appear
        exist = dialog.exists?
        @autoit.Send "{ENTER}"
        return exist
      end
      
    end
  end
end
    
 