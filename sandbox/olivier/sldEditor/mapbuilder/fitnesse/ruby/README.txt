= RubyFIT -- FIT for Ruby

This is RubyFIT, a Ruby port of the original Framework for Interactive
Testing written in Java by Ward Cunningham. See FIT's wiki at
http://fit.c2.com for further information.

Author:: Giulio Piancastelli <gpiancastelli@users.sourceforge.net>
Requires:: Ruby 1.8 or later
License:: RubyFIT is Copyright 2004 by Giulio Piancastelli.
          FIT is Copyright 2002 by Cunningham & Cunningham, Inc.
          Both FIT and RubyFIT are released under the terms of the GNU
          General Public License version 2 or later. See the
          license.txt file included in the distribution.

Document created on Saturday 11th December, 2004.
Last revised on Wednesday 30th March, 2005.

== Quick Start

=== Unit tests

First, you'd want to run unit tests, just to have proof that at least
something's working. Let's suppose you have Rake installed in your
Ruby environment. Then, all you have to do is just run the command
line Rake utility on the Rakefile provided in RubyFIT by typing 'rake'
at the Terminal or Command Prompt in the directory containing
RubyFIT's Rakefile.

If you don't have Rake installed, I'd strongly advise you to get it
from http://rake.rubyforge.org. You can download it and install it
following the instructions included in the package, or you can learn
about RubyGems at http://rubygems.rubyforge.org and automatically
install Rake through RubyGems. Rake plays in the Ruby world the same
role Ant plays in the Java world, so there's really no reason not to
install it. If you haven't got it, and still do not want to install
it, the simplest way to run tests is to put yourself in the RubyFIT
directory and execute the test suite named 'all_tests.rb'. To do, so
just follow these easy steps:

1. Go to the RubyFIT directory. For example, under Windows:
     D:\>cd Work\fit\imp\ruby
2. Then, run the test suite:
     D:\Work\fit\imp\ruby>ruby test\all_tests.rb
   And you should get:
     Loaded suite test/all_tests
     Started
     ......................
     Finished in 0.731 seconds.
     22 tests, 119 assertions, 0 failures, 0 errors
   Well, that's proof that at least something's working, isn't it?
  
Further details about how to install RubyFIT in the Ruby environment's
library will be provided as soon as RubyFIT will be augmented with an
automatic installer. Future work will aim at an alternative way of
installing RubyFIT, that is to provide it as a gem to be automatically
downloaded and installed by RubyGems.

=== RubyFIT from the command line

A sample command-line script is included in the bin/ subdirectory to
help you run RubyFIT tests in the most painless way. Just place
yourself in the bin/ directory, and call the script passing two
arguments: the first is the HTML file containing tables to be tested,
the second is the name of the HTML file which will be created by
RubyFIT and will contain the results of the tests. For example:

  # fit.rb $HOME/html/eg/calc.html $HOME/html/reports/calc.html

If you are running under an operating system different from Microsoft
Windows, you'd probably need to call the interpreter directly, or add
a shebang line at the beginning of the script pointing to the
interpreter location on your machine, for example:

  #!/usr/local/bin/ruby

or

  #!/usr/bin/env ruby

Note that this second option is probably not supported by every *nix
system, but it is nice nonetheless because it lets you call the Ruby
interpreter without knowing exactly where it resides on your machine.

=== RubyFIT from a web server

A sample CGI script is included in the bin/ subdirectory, just to let
you have a glance at how RubyFIT can be used behind a web server. Put
fit.cgi in the cgi-bin/ directory under your web server tree (or in an
equivalent appropriate position), then change the shebang line to
point to the location of the Ruby interpreter on your machine.
Finally, change the location to RubyFIT pointing to the directory you
have downloaded the code, and the location to your fixtures to
whatever directory you use to collect your Ruby classes derived from
Fit::Fixture.

You should now be able to use RubyFIT behind a web server. Write an
HTML page containing tables for one of your fixtures, and remember to
add a link to the fit.cgi script: serve it through the web server you
have installed fit.cgi within, then click on the fit.cgi link to run
the tests and get a result page in response.

=== RubyFIT in FitNesse

You can now run RubyFIT tests in FitNesse.  (See http://fitnesse.org
for general information on FitNesse.)  Define the command pattern like so:
"!define COMMAND_PATTERN {/path/to/ruby/ruby -I %p -I /path/to/RubyFIT/lib 
/path/to/RubyFIT/bin/FitServer.rb}" changing the paths as appropriate.

== RubyFIT Development Issues

Being Ruby a much more different language than Java, RubyFIT carries
some of those unique characteristics, sometimes bulding on them,
sometimes suffering from them. Here follows a uncomplete list of
issues in the development of RubyFIT.

==== Float Arithmetic

In arithmetic.html Ruby does math differently from Java. A workaround
is implemented in Fit::TypeAdapter#equals: if one of the object is a
Float and the other is a Numeric, equality is tested on a 1.0e-5
delta. Also, in CalculatorExample.html Ruby does Floats with much more
precision than Java, so that even a 1.0e-15 or -1.0e-17 difference is
retained. A workaround in Fit::ScientificDouble has been implemented,
so that if the precision is exactly zero, the values of two comparing
objects must be equals in a 1.0e-5 delta.

Note than in AllCombinations.html Ruby does even ScientificDouble with
much more precision than the Java version. So, another workaround in
== and <=> had to be employed, specifically to create another
ScientificDouble to compare with and to pick the precision of the less
precise of the two to make the comparison.

==== Reflection in Fit::Fixture

[INSERT REFLECTION ISSUES]

Note also that Fit::RowFixture#get_target_class has not been
implemented because in Ruby a method can be called on an object
without prior knowledge of the class that object is an instance of.

==== Class names from 'eg.AllFiles$Example' strings in Fit::Fixture

[INSERT CLASS NAMING ISSUES]

==== Method names from 'Html' in Fit::TypeAdapter

RubyFIT uses FitNesse-style "graceful nameing", modified to suit
Ruby's syntax and customs.  For example, given any of these names in a
row or column fixture:  "some_method()", "some method()", "some*method()",
"SomeMethod()", or "Some Method()", it will call the method "some_method",
expecting it to be an output method (or "getter"), or the equivelent
accessor generated by attr_reader, etc.  Given any of the above names,
with the "()" replaced by "?", such as "some method?" it will match the
same methods, but will prefer a method named "some_method?", if it exists.
Any of the above names, with the "()" removed (and no "?") will be
interpreted as an input method ("setter") and will match "some_method=(value)",
as well as mutators generated by attr_writer.

== Acknowledgements

Thanks to Ward Cunningham for creating FIT, and to Jim Shore for
coordinating the effort of porting FIT to platforms other than Java.