# Copyright (c) 2002 Cunningham & Cunningham, Inc.
# Released under the terms of the GNU General Public License version 2 or later.

require 'fat/string_writer'
require 'fit/column_fixture'

module Fat

  class AnnotationFixture < Fit::ColumnFixture
    attr_accessor :type, :text, :original_cell
    def initialize
      super
      @original_cell = 'text'
    end
    def output
      parse = Fit::ParseHolder.create 'td', @original_cell, nil, nil
      hack = Fit::Fixture.new
      case @type
        when 'none' then nil # do nothing
        when 'right' then hack.right(parse)
        when 'wrong' then hack.wrong(parse)
        when 'error' then return 'not implemented'
        when 'ignore' then hack.ignore(parse)
        when 'unchecked' then return 'not implemented'
        else return "unknown type: #@type"
      end
      generate_output parse
    end
    # Code smell note: copied from Fat::ParseFixture
    def generate_output parse
      result = StringWriter.new
      parse.print result
      result.to_s
    end
    private :generate_output
  end

end
