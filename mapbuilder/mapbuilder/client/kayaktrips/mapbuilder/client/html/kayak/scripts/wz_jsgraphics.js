/* This notice must be untouched at all times.

wz_jsgraphics.js    v. 2.0
The latest version is available at
http://www.walterzorn.com
or http://www.devira.com
or http://www.walterzorn.de

Copyright (c) 2002-2003 Walter Zorn. All rights reserved.
Created 3. 11. 2002 by Walter Zorn <walter@kreuzotter.de>
Last modified: 31. 3. 2003

High Performance JavaScript Graphics Library.
Provides methods
- to draw lines, rectangles, ellipses, polygons
  with specifiable line thickness,
- to fill rectangles and ellipses
- to draw text.
NOTE: Operations, functions and branching have rather been optimized
to efficiency and speed than to shortness of source code.

This program is free software;
you can redistribute it and/or modify it under the terms of the
GNU General Public License as published by the Free Software Foundation;
either version 2 of the License, or (at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY;
without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
See the GNU General Public License
at http://www.gnu.org/copyleft/gpl.html for more details.
*/






// rs
var divnum = 0;

var jg_ihtm, jg_ie, jg_dom,
jg_n4 = (document.layers && typeof document.classes != "undefined");








function chkDHTM(x, i)
{
	jg_ie = (x && typeof x.insertAdjacentHTML != "undefined");
	jg_dom = (x && !jg_ie &&
		typeof x.appendChild != "undefined" &&
		typeof document.createRange != "undefined" &&
		typeof (i = document.createRange()).setStartBefore != "undefined" &&
		typeof i.createContextualFragment != "undefined");
	jg_ihtm = (!jg_ie && !jg_dom &&	x && typeof x.innerHTML != "undefined");
}








function pntDoc()
{
	document.write(this.htm);
	this.htm = '';
}








function pntCnv()
{
	if (!this.dhtm);
	else if (jg_dom)
	{
		var x = document.createRange();
		x.setStartBefore(this.cnv);
		x = x.createContextualFragment(this.htm);
		this.cnv.appendChild(x);
	}
	else if (jg_ie)
		this.cnv.insertAdjacentHTML("BeforeEnd", this.htm);
	else this.cnv.innerHTML += this.htm;
	this.htm = '';
}








function mkDiv(x, y, w, h)
{
	this.htm += '<div id="graphic" '+
	  'style="position:absolute;'+
		'left:' + x + 'px;'+
		'top:' + y + 'px;'+
		'width:' + w + 'px;'+
		'height:' + h + 'px;'+
		'clip:rect(0,'+w+'px,'+h+'px,0);'+
		'overflow:hidden;background-color:' + this.color + ';'+
		'"><\/div>';
  divnum++;
}








function mkLyr(x, y, w, h)
{
	this.htm += '<layer '+
		'left="' + x + '" '+
		'top="' + y + '" '+
		'width="' + w + '" '+
		'height="' + h + '" '+
		'bgcolor="' + this.color + '"><\/layer>';
}








function mkLbl(txt, x, y)
{
	this.htm += '<div style="position:absolute;white-space:nowrap;'+
		'left:' + x + 'px;'+
		'top:' + y + 'px;'+
		'font-family:' +  this.ftFam + ';'+
		'font-size:' + this.ftSz + ';'+
		'color:' + this.color + ';' + this.ftSty + '">'+
		txt +
		'<\/div>';
}








function mkLin(x1, y1, x2, y2)
{
	if (x1>x2)
	{
		var _x2 = x2;
		var _y2 = y2;
		x2 = x1;
		y2 = y1;
		x1 = _x2;
		y1 = _y2;
	}
	var s = this.stroke,
	dx = x2-x1, dy = Math.abs(y2-y1),
	x = x1, y = y1,
	yIncr = (y1>y2)? -1 : 1;


	if (dx>=dy)
	{
		if (s && s > 1)
		{
			if (s-0x03 > 0)
			{
				var _s = (s*dx*Math.sqrt(1+dy*dy/(dx*dx))-dx-(s>>1)*dy) / dx;
				_s = (!(s-0x04)? Math.ceil(_s) : Math.round(_s)) + 1;
			}
			else var _s = s;
			var ad = Math.ceil(s/2)+1;
		}
		else var _s = 1, ad = 1;

		var pr = dy<<1,
		pru = pr - (dx<<1),
		p = pr-dx,
		ox = x;
		while ((dx--)>0)
		{
			if (p>0)
			{
				this.mkDiv(ox, y, x-ox+ad, _s);
				x++;
				y += yIncr;
				p += pru;
				ox = x;
			}
			else
			{
				x++;
				p += pr;
			}
		}
		this.mkDiv(ox, y, x2-ox+ad, _s);
	}


	else
	{
		if (s && s > 1)
		{
			if (s-0x03 > 0)
			{
				var _s = (s*dy*Math.sqrt(1+dx*dx/(dy*dy))-(s>>1)*dx-dy) / dy;
				_s = (!(s-0x04)? Math.ceil(_s) : Math.round(_s)) + 1;
			}
			else var _s = s;
			var ad = Math.round(s/2)+1;
		}
		else var _s = 1, ad = 1;

		var pr = dx<<1,
		pru = pr - (dy<<1),
		p = pr-dy,
		oy = y;
		if (y2<=y1)
		{
			while ((dy--)>0)
			{
				if (p>0)
				{
					this.mkDiv(x, y, _s, oy-y+ad);
					x++;
					y += yIncr;
					p += pru;
					oy = y;
				}
				else
				{
					y += yIncr;
					p += pr;
				}
			}
			this.mkDiv(x2, y2, _s, oy-y2+ad);
		}
		else
		{
			while ((dy--)>0)
			{
				if (p>0)
				{
					this.mkDiv(x, oy, _s, y-oy+ad);
					x++;
					y += yIncr;
					p += pru;
					oy = y;
				}
				else
				{
					y += yIncr;
					p += pr;
				}
			}
			this.mkDiv(x2, oy, _s, y2-oy+ad);
		}
	}
}








function mkOv(left, top, width, height, fill)
{
	if (fill)
	{
		var a = width>>1, b = height>>1,
		wod = (width&1)+1, hod = (height&1)+1,
		cx = left+a, cy = top+b,
		x = 0, y = b,
		ox = 0, oy = b,
		aa = (a*a)<<1, bb = (b*b)<<1,
		st = (aa>>1)*(1-(b<<1)) + bb,
		tt = (bb>>1) - aa*((b<<1)-1),
		pxl, w, h;
		do
		{
			if (st<0)
			{
				st += bb*((x<<1)+0x03);
				tt += (bb<<1)*(x+1);
				x++;
			}
			else if (tt<0)
			{
				st += bb*((x<<1)+0x03) - (aa<<1)*(y-1);
				tt += (bb<<1)*(x+1) - aa*((y<<1)-0x03);
				x++;
				y--;
				pxl = cx-x+1;
				w = ((x-1)<<1)+wod;
				h = oy-y;
				this.mkDiv(pxl, cy-oy, w, h);
				this.mkDiv(pxl, cy+oy-h+hod, w, h);
				ox = x;
				oy = y;
			}
			else
			{
				st -= (aa<<1)*(y-1);
				tt -= aa*((y<<1)-0x03);
				y--;
			}
		}
		while (y>0);
		this.mkDiv(cx-a, cy-oy, width+1, (oy<<1)+hod);
		return;
	}




	var s = this.stroke || 1;
	if (s-1)
	{
		if (!(s-0x03) && (width-0x33 < 0 || height-0x33 < 0))
		{
			this.stroke = 0x02;
			this.mkOv(left, top, width+1, height+1, false);
			this.mkOv(left+1, top+1, width-1, height-1, false);
			this.stroke = s;
		}


		else
		{
			width += s-1;
			height += s-1;
			var a = width>>1, b = height>>1,
			wod = width&1, hod = (height&1)+1,
			cx = left+a, cy = top+b,
			x = 0, y = b,
			aa = (a*a)<<1, bb = (b*b)<<1,
			st = (aa>>1)*(1-(b<<1)) + bb,
			tt = (bb>>1) - aa*((b<<1)-1);


			if (s-0x04 < 0)
			{
				var ox = 0, oy = b,
				w, h,
				pxl, pxr, pxt, pxb, pxw;
				do
				{
					if (st<0)
					{
						st += bb*((x<<1)+0x03);
						tt += (bb<<1)*(x+1);
						x++;
					}
					else if (tt<0)
					{
						st += bb*((x<<1)+0x03) - (aa<<1)*(y-1);
						tt += (bb<<1)*(x+1) - aa*((y<<1)-0x03);
						x++;
						y--;
						w = x-ox;
						h = oy-y;

						if (w-1)
						{
							pxw = w+1+(s&1);
							h = s;
						}
						else if (h-1)
						{
							pxw = s;
							h += 1+(s&1);
						}
						else pxw = h = s;
						this.mkOvQds(cx, cy, -x+1, ox-pxw+w+wod, -oy, -h+oy+hod, pxw, h);
						ox = x;
						oy = y;
					}
					else
					{
						st -= (aa<<1)*(y-1);
						tt -= aa*((y<<1)-0x03);
						y--;
					}
				}
				while (y>0);
				this.mkDiv(cx-a, cy-oy, s, (oy<<1)+hod);
				this.mkDiv(cx+a+wod-s+1, cy-oy, s, (oy<<1)+hod);
			}


			else
			{
				var _a = (width-((s-1)<<1))>>1,
				_b = (height-((s-1)<<1))>>1,
				_x = 0, _y = _b,
				_aa = (_a*_a)<<1, _bb = (_b*_b)<<1,
				_st = (_aa>>1)*(1-(_b<<1)) + _bb,
				_tt = (_bb>>1) - _aa*((_b<<1)-1),

				pxl = new Array(),
				pxt = new Array(),
				_pxb = new Array();
				pxl[0] = 0;
				pxt[0] = b;
				_pxb[0] = _b-1;
				do
				{
					if (st<0)
					{
						st += bb*((x<<1)+0x03);
						tt += (bb<<1)*(x+1);
						x++;
						pxl[pxl.length] = x;
						pxt[pxt.length] = y;
					}
					else if (tt<0)
					{
						st += bb*((x<<1)+0x03) - (aa<<1)*(y-1);
						tt += (bb<<1)*(x+1) - aa*((y<<1)-0x03);
						x++;
						y--;
						pxl[pxl.length] = x;
						pxt[pxt.length] = y;
					}
					else
					{
						st -= (aa<<1)*(y-1);
						tt -= aa*((y<<1)-0x03);
						y--;
					}

					if (_y>0)
					{
						if (_st<0)
						{
							_st += _bb*((_x<<1)+0x03);
							_tt += (_bb<<1)*(_x+1);
							_x++;
							_pxb[_pxb.length] = _y-1;
						}
						else if (_tt<0)
						{
							_st += _bb*((_x<<1)+0x03) - (_aa<<1)*(_y-1);
							_tt += (_bb<<1)*(_x+1) - _aa*((_y<<1)-0x03);
							_x++;
							_y--;
							_pxb[_pxb.length] = _y-1;
						}
						else
						{
							_st -= (_aa<<1)*(_y-1);
							_tt -= _aa*((_y<<1)-0x03);
							_y--;
							_pxb[_pxb.length-1]--;
						}
					}
				}
				while (y>0);

				var ox = 0, oy = b,
				_oy = _pxb[0],
				w, h;
				for (var i = 0; i < pxl.length; i++)
				{
					if (typeof _pxb[i] != "undefined")
					{
						if (_pxb[i] < _oy || pxt[i] < oy)
						{
							x = pxl[i];
							this.mkOvQds(cx, cy, -x+1, ox+wod, -oy, _oy+hod, x-ox, oy-_oy);
							ox = x;
							oy = pxt[i];
							_oy = _pxb[i];
						}
					}
					else
					{
						x = pxl[i];
						this.mkDiv(cx-x+1, cy-oy, 1, (oy<<1)+hod);
						this.mkDiv(cx+ox+wod, cy-oy, 1, (oy<<1)+hod);
						ox = x;
						oy = pxt[i];
					}
				}
				this.mkDiv(cx-a, cy-oy, 1, (oy<<1)+hod);
				this.mkDiv(cx+ox+wod, cy-oy, 1, (oy<<1)+hod);
			}
		}
	}




	else
	{
		var a = width>>1, b = height>>1,
		wod = width&1, hod = (height&1)+1,
		cx = left+a, cy = top+b,
		x = 0, y = b,
		ox = 0, oy = b,
		aa = (a*a)<<1, bb = (b*b)<<1,
		st = (aa>>1)*(1-(b<<1)) + bb,
		tt = (bb>>1) - aa*((b<<1)-1),
		w, h;
		do
		{
			if (st<0)
			{
				st += bb*((x<<1)+0x03);
				tt += (bb<<1)*(x+1);
				x++;
			}
			else if (tt<0)
			{
				st += bb*((x<<1)+0x03) - (aa<<1)*(y-1);
				tt += (bb<<1)*(x+1) - aa*((y<<1)-0x03);
				x++;
				y--;
				w = x-ox;
				h = oy-y;
				if (w&0x02 && h&0x02)
				{
					this.mkOvQds(cx, cy, -x+1, ox+wod, -oy, oy-h+1+hod, w, 1);
					this.mkOvQds(cx, cy, -x+1, x-1+wod, -y-1, y+hod, 1, 1);
				}
				else this.mkOvQds(cx, cy, -x+1, ox+wod, -oy, oy-h+hod, w, h);
				ox = x;
				oy = y;
			}
			else
			{
				st -= (aa<<1)*(y-1);
				tt -= aa*((y<<1)-0x03);
				y--;
			}
		}
		while (y>0);
		this.mkDiv(cx-a, cy-oy, a-ox+1, (oy<<1)+hod);
		this.mkDiv(cx+ox+wod, cy-oy, a-ox+1, (oy<<1)+hod);
	}
}








function jsGraphicsFt()
{
	this.PLAIN = '';
	this.BOLD = 'font-weight:bold;';
	this.ITALIC = 'font-style:italic;';
	this.ITALIC_BOLD = this.ITALIC + this.BOLD;
	this.BOLD_ITALIC = this.ITALIC_BOLD;
}
var Font = new jsGraphicsFt();








function jsGraphics(id)
{
	this.setStroke = new Function('arg', 'this.stroke = arg;');




	this.setColor = new Function('arg', 'this.color = arg;');




	this.setFont = function(fam, sz, sty)
	{
		this.ftFam = fam;
		this.ftSz = sz;
		if (sty) this.ftSty = sty;
	}




	this.drawLine = function(x1, y1, x2, y2)
	{
		this.mkLin(x1, y1, x2, y2);
	}




	this.drawPolyline = function(x, y, s)
	{
		var z = 0; while (z < x.length-1)
			this.mkLin(x[z], y[z], x[++z], y[z]);
	}




	this.drawPolyLine = this.drawPolyline;




	this.drawRect = function(x, y, w, h)
	{
		var s = this.stroke || 1;
		this.mkDiv(x, y, w, s);
		this.mkDiv(x+w, y, s, h);
		this.mkDiv(x, y+h, w+s, s);
		this.mkDiv(x, y, s, h);
	}




	this.fillRect = function(x, y, w, h)
	{
		this.mkDiv(x, y, w, h);
	}




	this.drawPolygon = function(x, y)
	{
		this.drawPolyline(x, y);
		this.mkLin(x[x.length-1], y[x.length-1], x[0], y[0]);
	}




	this.drawEllipse = function(x, y, w, h)
	{
		this.mkOv(x, y, w, h, false);
	}




	this.drawOval = this.drawEllipse;




	this.fillEllipse = function(x, y, w, h)
	{
		this.mkOv(x, y, w-1, h-1, true)
	}




	this.fillOval = this.fillEllipse;




	this.drawString = mkLbl;




	this.clear = function()
	{
		this.htm = "";
		if (!this.dhtm) return;
		this.cnv.innerHTML = this.defhtm;
	}




	this.mkDiv = jg_n4? mkLyr : mkDiv;


	this.mkLin = mkLin;


	this.mkOv = mkOv;


	this.mkOvQds = function(cx, cy, xl, xr, yt, yb, w, h)
	{
		this.mkDiv(xr+cx, yt+cy, w, h);
		this.mkDiv(xr+cx, yb+cy, w, h);
		this.mkDiv(xl+cx, yb+cy, w, h);
		this.mkDiv(xl+cx, yt+cy, w, h);
	}


	this.stroke = 0;
	this.color = '#000000';
	this.ftFam = 'verdana,geneva,helvetica,sans-serif';
	this.ftSz = String.fromCharCode(0x31, 0x32, 0x70, 0x78);
	this.ftSty = Font.PLAIN;
	this.htm = '';


	if (id == document) this.paint = pntDoc;
	else
	{
		this.paint = pntCnv;
		this.cnv = document.all? (document.all[id] || null)
			: document.getElementById? (document.getElementById(id) || null)
			: null;
		this.defhtm = (this.cnv && this.cnv.innerHTML)? this.cnv.innerHTML : '';
		if (!(jg_ie || jg_dom || jg_ihtm)) chkDHTM(this.cnv);
		this.dhtm = (this.cnv && (jg_ie || jg_dom || jg_ihtm));
	}
}
