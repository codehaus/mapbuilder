#!/usr/bin/ruby

require 'fileutils';
require 'find'

# 5.times { print "Odelay!" }
# ['toast', 'cheese', 'wine'].each { |food| print food.capitalize }

wd = Dir.getwd
print "Current Working Directory: \n[" + wd + "]\n\n";

mapbuilderDir=wd + "/mapbuilder";
mapbuilderLibDir = mapbuilderDir + "/lib";

print "Community MapBuilder base dir: \n[" + mapbuilderDir + "]\n\n";
# targetDir= mapbuilderDir + "/compressBuild";
# print "Target Dir: \n[" + targetDir + "]\n\n";

Compressed_Filename = "MapbuilderCompressed.js";


Compressed_File_Path = mapbuilderDir + "/" + Compressed_Filename;
print "Compressed File Path [" + Compressed_File_Path + "]\n";

if FileTest.exist?(Compressed_File_Path)
  print "Unlinking [" + Compressed_File_Path + "]\n";
  FileUtils.rm(Compressed_File_Path);  
else
  print "[" + Compressed_File_Path + "] does not exist. Moving on.\n";  
end

# TODO  Compress XSL Here
# 

mainFiles =  ['Mapbuilder.js','RELEASE.js','widget/ButtonBase.js','widget/EditLine.js'];
mainFiles.each {
  |fileName|
  uncompressedFilePath = mapbuilderLibDir + "/" + fileName;
  print "Compressing [" + uncompressedFilePath + "]\n";
  system("java -jar " + mapbuilderDir + "/lib/util/custom_rhino.jar -c " + uncompressedFilePath + " >> " + Compressed_File_Path + " 2>&1")  
}

Find.find(mapbuilderLibDir + "/**/*.js") do |f| p f end
