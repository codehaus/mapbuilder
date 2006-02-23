$:.unshift File.join(File.dirname(__FILE__), '..', 'lib')

require 'fit/parse'
require 'fit/file_runner'

test = ARGV[0]
report = ARGV[1]
Fit::Parse.footnote_path = File.dirname(report) + File::SEPARATOR
Fit::FileRunner.new.run [test, report] if __FILE__ == $0
