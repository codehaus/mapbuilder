/* navig.js
 * Role : detecte le navigateur et le systeme d'exploitation du client
 * Projet : JsLib
 * Auteur : Etienne CHEVILLARD (echevillard@users.sourceforge.net)
 * Version : 1.3
 * Creation : 05/04/2001
 * Mise a jour : 23/02/2005
 * Bogues connues : - impossible de connaitre le systeme avec Sun HotJava
 *
 * Detection du navigateur et de l'OS basee sur :
 * JavaScript Browser Sniffer
 * Eric Krok, Andy King, Michel Plungjan Jan. 31, 2002
 * see http://www.webreference.com/ for more information
 */

// --- Variables globales ---

// recupere les informations sur le navigateur
var navig_agt=navigator.userAgent.toLowerCase();
var navig_min=navig_extVer(navigator.appVersion);
var navig_maj=parseInt(navig_min);

// detecte le navigateur installe
var navig_mos=(navig_agt.indexOf("ncsa")!=-1);
var navig_omn=(navig_agt.indexOf("omniweb")!=-1);
var navig_saf=((navig_agt.indexOf("safari")!=-1) && (navig_agt.indexOf("mac")!=-1));
var navig_kqr=(navig_agt.indexOf("konqueror")!=-1);
var navig_fox=(navig_agt.indexOf("firefox")!=-1);
var navig_moz=(!navig_saf && (navig_agt.indexOf("mozilla")!=-1)
  && (navig_agt.indexOf("gecko")!=-1) && (navig_agt.indexOf("netscape")==-1));
var navig_nn=(!navig_moz && (navig_agt.indexOf("mozilla")!=-1)
  && (navig_agt.indexOf("spoofer")==-1) && (navig_agt.indexOf("compatible")==-1)
  && (navig_agt.indexOf("opera")==-1) && (navig_agt.indexOf("webtv")==-1)
  && (navig_agt.indexOf("hotjava")==-1));
var navig_nn2=(navig_nn && (navig_maj<3));
var navig_nn3=(navig_nn && (navig_maj==3));
var navig_nn4=(navig_nn && (navig_maj==4));
var navig_nn6=(navig_nn && (navig_agt.indexOf("netscape6/")!=-1));
var navig_nn7=(navig_nn && (navig_agt.indexOf("netscape/7")!=-1));
var navig_ie=((navig_agt.indexOf("msie")!=-1) && (navig_agt.indexOf("opera")==-1));
var navig_ie3=(navig_ie && (navig_maj<4));
var navig_ie4=(navig_ie && (navig_maj==4) && (navig_agt.indexOf("msie 5.")==-1)
  && (navig_agt.indexOf("msie 6.")==-1));
var navig_ie5=(navig_ie && (navig_agt.indexOf("msie 5.")!=-1));
var navig_ie6=(navig_ie && (navig_agt.indexOf("msie 6.")!=-1));
var navig_op=(navig_agt.indexOf("opera")!=-1);
var navig_op2=((navig_agt.indexOf("opera 2")!=-1) || (navig_agt.indexOf("opera/2")!=-1));
var navig_op3=((navig_agt.indexOf("opera 3")!=-1) || (navig_agt.indexOf("opera/3")!=-1));
var navig_op4=((navig_agt.indexOf("opera 4")!=-1) || (navig_agt.indexOf("opera/4")!=-1));
var navig_op5=((navig_agt.indexOf("opera 5")!=-1) || (navig_agt.indexOf("opera/5")!=-1));
var navig_op6=((navig_agt.indexOf("opera 6")!=-1) || (navig_agt.indexOf("opera/6")!=-1));
var navig_op7=((navig_agt.indexOf("opera 7")!=-1) || (navig_agt.indexOf("opera/7")!=-1));
var navig_hot=(navig_agt.indexOf("hotjava")!=-1);
var navig_hot3=(navig_hot && (navig_maj==3));

// detecte la version de Javascript
var navig_js="1.0";
if (navig_nn3 || navig_op) navig_js="1.1";
if (navig_ie4 || (navig_nn4 && (navig_min<=4.05))) navig_js="1.2";
if (navig_ie5 || navig_ie6 || navig_op5 || navig_op6 || (navig_nn4 && (navig_min>4.05))) navig_js="1.3";
if (navig_hot3 || (navig_ie5 && (navig_agt.indexOf("mac")!=-1))) navig_js="1.4";
if (navig_nn6 || navig_nn7 || navig_moz || navig_fox || navig_omn || navig_op7 || navig_saf || navig_kqr) navig_js="1.5";

// detecte le systeme installe
var navig_w23=((navig_agt.indexOf("windows nt 5.2")!=-1) || (navig_agt.indexOf("windows 2003")!=-1));
var navig_wxp=((navig_agt.indexOf("windows nt 5.1")!=-1) || (navig_agt.indexOf("windows xp")!=-1));
var navig_w2k=((navig_agt.indexOf("windows nt 5.0")!=-1) || (navig_agt.indexOf("windows 2")!=-1));
var navig_wnt=((navig_agt.indexOf("winnt")!=-1) || (navig_agt.indexOf("windows nt")!=-1));
var navig_wme=(navig_agt.indexOf("win 9x 4.90")!=-1);
var navig_w98=((navig_agt.indexOf("win98")!=-1) || (navig_agt.indexOf("windows 98")!=-1));
var navig_w95=((navig_agt.indexOf("win95")!=-1) || (navig_agt.indexOf("windows 95")!=-1)
  || (navig_agt.indexOf("win")!=-1) || (navig_agt.indexOf("32bit")!=-1));
var navig_w31=((navig_agt.indexOf("win16")!=-1) || (navig_agt.indexOf("16bit")!=-1)
  || (navig_agt.indexOf("windows 3.1")!=-1) || (navig_agt.indexOf("windows 16-bit")!=-1));
var navig_os2=((navig_agt.indexOf("os/2")!=-1) || (navig_agt.indexOf("ibm-webexplorer")!=-1)
  || (navigator.appVersion.indexOf("OS/2")!=-1));
var navig_macx=(navig_omn || (navig_agt.indexOf("mac os x")!=-1));
var navig_mac=(navig_agt.indexOf("mac")!=-1);
var navig_sun=(navig_agt.indexOf("sunos")!=-1);
var navig_irix=(navig_agt.indexOf("irix")!=-1);
var navig_hpux=(navig_agt.indexOf("hp-ux")!=-1);
var navig_aix=(navig_agt.indexOf("aix")!=-1);
var navig_linux=((navig_agt.indexOf("linux")!=-1) || (navig_agt.indexOf("x11")!=-1));
var navig_sco=((navig_agt.indexOf("sco")!=-1) || (navig_agt.indexOf("unix_sv")!=-1));
var navig_ware=((navig_agt.indexOf("unix_system_v")!=-1) || (navig_agt.indexOf("unixware")!=-1));
var navig_open=((navig_agt.indexOf("openunix")!=-1) || (navig_agt.indexOf("open unix")!=-1));
var navig_mpras=(navig_agt.indexOf("ncr")!=-1);
var navig_dec=((navig_agt.indexOf("dec")!=-1) || (navig_agt.indexOf("osf1")!=-1)
  || (navig_agt.indexOf("alpha")!=-1) || (navig_agt.indexOf("ultrix")!=-1));
var navig_tru=(navig_agt.indexOf("tru64")!=-1);
var navig_sinix=(navig_agt.indexOf("sinix")!=-1);
var navig_fbsd=(navig_agt.indexOf("freebsd")!=-1);
var navig_nbsd=(navig_agt.indexOf("netbsd")!=-1);
var navig_obsd=(navig_agt.indexOf("openbsd")!=-1);
var navig_bsd=(navig_agt.indexOf("bsd")!=-1);
var navig_beos=(navig_agt.indexOf("beos")!=-1);
var navig_qnx=(navig_agt.indexOf("qnx")!=-1);

// --- Fonctions ---

// extrait le numero de version d'une portion de texte
function navig_extVer(txt) {
  if (!txt) return "";
  var ver="";
  for(var i=0; i<txt.length; i++) {
    if ((isNaN(txt.charAt(i))) && (txt.charAt(i)!='.')) {
      if (ver.length>0) return(ver);
    } else {
      ver+=txt.charAt(i);
    }
  }
  return ver;
} // fin navig_extVer(txt)

// retourne le nom du navigateur
function nomNavig() {
  if (navig_mos) return ("NCSA Mosaic");
  else if (navig_omn) return ("OmniWeb");
  else if (navig_kqr) return ("Konqueror");
  else if (navig_saf) return ("Apple Safari");
  else if (navig_ie) return ("Microsoft Internet Explorer");
  else if (navig_op) return ("Opera");
  else if (navig_hot) return ("Sun HotJava");
  else if (navig_fox) return ("Mozilla Firefox");
  else if (navig_moz) return ("Mozilla");
  else if (navig_nn6 || navig_nn7) return ("Netscape");
  else if (navig_nn) return ("Netscape Navigator");
  else return ("inconnu");
} // fin nomNavig()

// retourne le nom du systeme d'exploitation
function nomSysteme() {
  if (navig_w23) return ("Microsoft Windows Server 2003");
  else if (navig_wxp) return ("Microsoft Windows XP");
  else if (navig_w2k) return ("Microsoft Windows 2000");
  else if (navig_wnt) return ("Microsoft Windows NT 4.0");
  else if (navig_wme) return ("Microsoft Windows Me");
  else if (navig_w98) return ("Microsoft Windows 98");
  else if (navig_w95) return ("Microsoft Windows 95");
  else if (navig_w31) return ("Microsoft Windows 3.1");
  else if (navig_os2) return ("IBM OS/2");
  else if (navig_macx) return ("Apple MacOS X");
  else if (navig_mac) return ("Apple MacOS");
  else if (navig_sun) return ("Sun Solaris (SunOS)");
  else if (navig_irix) return ("SGI Irix");
  else if (navig_hpux) return ("HP-UX");
  else if (navig_aix) return ("IBM AIX");
  else if (navig_linux) return ("GNU/Linux");
  else if (navig_sco) return ("SCO UNIX");
  else if (navig_ware) return ("UNIXware");
  else if (navig_open) return ("Caldera Open UNIX");
  else if (navig_mpras) return ("NCR UNIX MPRAS");
  else if (navig_dec) return ("Digital UNIX");
  else if (navig_tru) return ("HP Tru64 UNIX");
  else if (navig_sinix) return ("Siemens SINIX");
  else if (navig_fbsd) return ("FreeBSD");
  else if (navig_nbsd) return ("NetBSD");
  else if (navig_obsd) return ("OpenBSD");
  else if (navig_bsd) return ("BSD/OS");
  else if (navig_beos) return ("BeOS");
  else if (navig_qnx) return ("QNX");
  else return ("inconnu");
} // fin nomSysteme()

// retourne le nom et la version du navigateur
function nomVersionNavig() {
  if (nomNavig()=="inconnu") {
    return (nomNavig());
  } else {
    return (nomNavig()+" "+versionNavig());
  }
} // fin nomVersionNavig()

// retourne la version de Javascript prise en charge par le navigateur
function versionJavascript() {
  return (navig_js);
} // fin versionJavascript()

// retourne la version du navigateur
function versionNavig() {
  var tmp;
  if (navig_ie3 && (navig_maj<3)) {
    return ("3.0");
  } else if (navig_ie5 || navig_ie6) {
    tmp=navig_agt.indexOf("msie");
    return(navig_extVer(navig_agt.substring(tmp+5)));
  } else if (navig_saf) {
  	tmp=parseInt(navig_agt.substring(navig_agt.indexOf("safari/")+7));
		if (tmp==100) return ("1.1");
		else if (tmp==125) return ("1.2");
		else if (tmp==146) return ("1.3");
		else if (tmp>146) return ("2.0");
		else return ("1.0");
  } else if (navig_kqr) {
    tmp=navig_agt.indexOf("konqueror/");
    return(navig_extVer(navig_agt.substring(tmp+10)));
  } else if (navig_omn) {
    tmp=navig_agt.indexOf("omniweb/");
    return(navig_extVer(navig_agt.substring(tmp+8)));
  } else if (navig_fox) {
    tmp=navig_agt.indexOf("firefox/");
    return(navig_extVer(navig_agt.substring(tmp+8)));
  } else if (navig_moz) {
    tmp=navig_agt.indexOf("rv:");
    return(navig_extVer(navig_agt.substring(tmp+3)));
  } else if (navig_nn6) {
    tmp=navig_agt.indexOf("netscape6/");
    return(navig_extVer(navig_agt.substring(tmp+10)));
  } else if (navig_nn7) {
    tmp=navig_agt.indexOf("netscape/");
    return(navig_extVer(navig_agt.substring(tmp+9)));
  } else if (nomNavig()=="inconnu") {
    return ("inconnu");
  } else {
    return (navig_min);
  }
} // fin versionNavig()
