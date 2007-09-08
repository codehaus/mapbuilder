/*
License:      LGPL as per: http://www.gnu.org/copyleft/lesser.html

$Id$
*/

// Supported languages
var supportedLanguages = new Object();
{
  supportedLanguages["en"] = "English";
  supportedLanguages["nl"] = "Nederlands";
  supportedLanguages["fr"] = "Fran\u00E7ais";
  supportedLanguages["it"] = "Italiano";
  // Also add as an example an unsupported language to show the fallback
  supportedLanguages["nonesuch"] = "unsupported language";
}
var language = "en"; // Default to English

/**
 * Set the language for a page by getting it from the page parameters
 */
function setLanguage()
{
  var parms = getParameters();
  if (parms["language"] && supportedLanguages[parms["language"]]) {
    language = parms["language"];
  }
}

/**
 * Write out the HTML with hrefs for changing the language of the page
 * @param flagsDirUrl the (relative) url of the directory containing the flag images
 */
function writeOutLanguages(flagsDirUrl)
{
  for (var i in supportedLanguages) {
    document.write("&nbsp;");
    if (language != i) {
      document.write('<a href="?language=' + i + '">');
    }
    document.write('<img src="' + flagsDirUrl + '/' + i +
      '.png" title="' + supportedLanguages[i] + '"/>');
    if (language != i) {
      document.write('</a>');
    }
  }
}

/**
 * Get the page parameters
 * @return an object with the parameter names as fields and the parameter values
 *         as the corresponding values
 */
function getParameters()
{
  var args = new Object();
  var query = location.search.substring(1);
  var pairs = query.split("&");
  for (var i in pairs) {
    var pos = pairs[i].indexOf('=');
    if (pos == -1) continue;
    var argname = pairs[i].substring(0, pos);
    var value = pairs[i].substring(pos + 1);
    args[argname] = unescape(value.replace(/\+/g, " "));
  }
  return args;
}
