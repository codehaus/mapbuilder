
Proj4js.Proj.sterea = {
  dependsOn : 'gauss',

  init : function() {
    Proj4js.Proj['gauss'].init.apply(this);
    if (!this.rc) {
      Proj4js._reportError("sterea:init:E_ERROR_0");
      return;
    }
    this.sinc0 = Math.sin(this.phic0);
    this.cosc0 = Math.cos(this.phic0);
    this.R2 = 2.0 * this.rc;
    if (!this.title) this.title = "Oblique Stereographic Alternative";
  },

  forward : function(p) {
    Proj4js.Proj['gauss'].forward.apply(this, [p]);
    sinc = Math.sin(p.y);
    cosc = Math.cos(p.y);
    cosl = Math.cos(p.x);
    k = this.k0 * this.R2 / (1.0 + this.sinc0 * sinc + this.cosc0 * cosc * cosl);
    p.x = k * cosc * Math.sin(p.x);
    p.y = k * (this.cosc0 * sinc - this.sinc0 * cosc * cosl);
    p.x = this.a * p.x + this.x0;
    p.y = this.a * p.y + this.y0;
    return p;
  },

  inverse : function(p) {
    p.x = (p.x - this.x0) * this.a; /* descale and de-offset */
    p.y = (p.y - this.y0) * this.a;

    p.x /= this.k0;
    p.y /= this.k0;
    if ( (rho = Math.sqrt(p.x*p.x + p.y*p.y)) ) {
      c = 2.0 * Math.atan2(rho, this.R2);
      sinc = Math.sin(c);
      cosc = Math.cos(c);
      p.y = Math.asin(cosc * this.sinc0 + p.y * sinc * this.cosc0 / rho);
      p.x = Math.atan2(p.x * sinc, rho * this.cosc0 * cosc - p.y * this.sinc0 * sinc);
    } else {
      p.y = this.phic0;
      p.x = 0.;
    }
    Proj4js.Proj['gauss'].inverse.apply(this,[p]);
    return p;
  }
};

