/**
* @author	Frédéric Saunier - www.tekool.net
* @since	2006/02/08
* @description :
*			The class *AjaxClassLoader* is intended to 
*			help you to import Javascript files as
*			single classes files as	you could do it in
*			Actionscript 2 and 3, C#, Java, etc…
*
* @license :
*
* Copyright (C) 2006 Frédéric Saunier
* 
* This library is free software; you can redistribute it and/or
* modify it under the terms of the GNU Lesser General Public
* License as published by the Free Software Foundation; either
* version 2.1 of the License, or (at your option) any later version.
* 
* This library is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
* Lesser General Public License for more details.
* 
* You should have received a copy of the GNU Lesser General Public
* License along with this library; if not, write to the Free Software
* Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
* 
*/
if(typeof AjaxClassLoader == 'undefined')
{
	AjaxClassLoader = function(){};

	/**
	* Singleton pattern implementation.
	*/
	AjaxClassLoader.instance = null;
	AjaxClassLoader.getInstance = function()
	{
		if(AjaxClassLoader.instance == null)
			return AjaxClassLoader.instance = new AjaxClassLoader();
		
		return AjaxClassLoader.instance;
	}

	AjaxClassLoader.prototype.__classPathBase = '';

	/**
	* Sets the location of the Javascript classes folder.
	* You can use relative or absolute URL. The URL is relative to the
	* HTML page that loads the AjaxClassLoader.js file.
	*
	* @param	url		The URL of the folder. 
	*
	* @public
	*/
	AjaxClassLoader.setClassFolder = function(url)
	{
		var sUrl = url;
		if(sUrl.charAt(-1) != '/')
			sUrl += '/';
		
		AjaxClassLoader.getInstance().__classPathBase = sUrl;
	}

	/**
	* Retrieves or creates a classPath object.
	*
	* @param	path	The path of the object.
	*			eg. : AjaxClassLoader.getClassPathObject('com.mywebsite.myclasspath')
	*
	* @public
	*/
	AjaxClassLoader.getClassPathObject = function(path)
	{
		var arr = path.split('.');
		var obj = window;
		for(var i=0; i<arr.length; i++)
		{
			if(typeof obj[arr[i]] == 'undefined')
				obj[arr[i]] = {};
			obj = obj[arr[i]];
		}
		return obj;
	}

	/**
	* Retrieves an instance of the Ajax object compatible with the browser.
	*
	* @private
	*/
	AjaxClassLoader.getXMLHttpRequest = function()
	{
		try
		{
			if(typeof XMLHttpRequest != 'undefined')
				return new XMLHttpRequest();
			else
			if(typeof ActiveXObject != 'undefined')
				return new ActiveXObject("Microsoft.XMLHTTP");
		}
		catch(error){return null}
	}

	/**
	* Loads a Javascript class file identified by its classpath and evaluate
	* the code that it contains to declare the class.
	*
	* @param	path	The fully qualified classPath of the class.
	*			eg. : AjaxClassLoader.getClassPathObject('com.mywebsite.myclasspath.MyClass') 
	*
	* @public
	*/
	AjaxClassLoader.load = function(path)
	{
		try{var oPath = eval(path)}catch(error){}
		
		if(typeof oPath != 'undefined')
			return oPath;
		
		var sClassPathUrl = path.split('.').join('/');
		var sFilePath = AjaxClassLoader.getInstance().__classPathBase + sClassPathUrl + '.js';
		
		var xmlHttpRequest = AjaxClassLoader.getXMLHttpRequest();
		if(xmlHttpRequest == null)
			return null;

		xmlHttpRequest.open("GET", sFilePath, false);

		try{xmlHttpRequest.send(null);}
		catch(error)
		{
			//Mainly means that the file to load has not been found
			return null;
		}
		
		/**
		* Evaluates the code the that the Javascript file contains.
		*/
		document.write('<script type="text/javascript"><!--\n' + xmlHttpRequest.responseText + '\n--></script>');

		//return eval('window.' + path);
	}
}