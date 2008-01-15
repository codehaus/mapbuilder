/* Copyright (c) 2006-2007 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * Namespace: OpenLayers.Tween
 */
OpenLayers.Tween = OpenLayers.Class({
    
    /**
     * Constant: INTERVAL
     * Interval in milliseconds between 2 steps
     */
    INTERVAL: 10,
    
    /**
     * 
     * Params:
     * easing - {<OpenLayers.Easing>(Function)} easing function method to use
     */ 
    initialize: function(easing) {
        this.easing = easing;
    },
    
    /**
     * APIMethod: start
     * Plays the Tween, and calls the callback method on each step
     * 
     * begin - {Object} begin value 
     * finish - {Object} finish value (should have the same properties as begin)
     * duration - {int} duration of the tween (number of steps)
     * callback - {Object} callbacks (start, eachStep, done)
     */
    start: function(begin, finish, duration, callbacks) {
        this.begin = begin;
        this.finish = finish;
        this.duration = duration;
        this.time = 0;
        if (this.interval) {
            window.clearInterval(this.interval);
            this.interval = null;
        }
        if (callbacks.start) {
            callbacks.start.call(this, value);
        }
        this.interval = window.setInterval(
            OpenLayers.Function.bind(this.ease, this, callbacks), this.INTERVAL);
    },
    
    /**
     * Method: ease
     * Calls the appropriate easing method
     * 
     * callbacks - {Object} callbacks
     */
    ease: function(callbacks) {
        if (this.time >= this.duration) {
            if (callbacks.done) {
                callbacks.done.call(this, value);
            }
            window.clearInterval(this.interval);
            this.interval = null;
        }
        
        var value = {};
        for (var i in this.begin) {
            var b = this.begin[i];
            var f = this.finish[i];
            if (b == null || f == null || isNaN(b) || isNaN(f)) {
                OpenLayers.Console.error('invalid value for Tween');
            }
            
            var c = f - b;
            value[i] = this.easing.apply(this, [this.time, b, c, this.duration]);
        }
        this.time++;
        
        if (callbacks.eachStep) {
            callbacks.eachStep.call(this, value);
        }
    },
    
    /**
     * Create empty functions for all easing methods.
     */
    CLASS_NAME: "OpenLayers.Tween"
});

/**
 * Namespace: OpenLayers.Easing
 * 
 * Credits:
 *      Easing Equations by Robert Penner, <http://www.robertpenner.com/easing/>
 */
OpenLayers.Easing = {
    /**
     * Create empty functions for all easing methods.
     */
    CLASS_NAME: "OpenLayers.Easing"
}

/**
 * Namespace: OpenLayers.Easing.Linear
 */
OpenLayers.Easing.Linear = {
    
    /**
     * APIFunction: easeIn
     * 
     * Parameters:
     * t - {Float} time
     * b - {Float} beginning position
     * c - {Float} total change
     * d - {Float} duration of the transition
     */
    easeIn: function(t, b, c, d) {
        return c*t/d + b;
    },
    
    /**
     * APIFunction: easeOut
     * 
     * Parameters:
     * t - {Float} time
     * b - {Float} beginning position
     * c - {Float} total change
     * d - {Float} duration of the transition
     */
	easeOut: function(t, b, c, d) {
		return c*t/d + b;
	},
    
	/**
     * APIFunction: easeInOut
     * 
     * Parameters:
     * t - {Float} time
     * b - {Float} beginning position
     * c - {Float} total change
     * d - {Float} duration of the transition
     */
    easeInOut: function(t, b, c, d) {
		return c*t/d + b;
	},

    CLASS_NAME: "OpenLayers.Easing.Linear"
};

/**
 * Namespace: OpenLayers.Easing.Expo
 */
OpenLayers.Easing.Expo = {
    
    /**
     * APIFunction: easeIn
     * 
     * Parameters:
     * t - {Float} time
     * b - {Float} beginning position
     * c - {Float} total change
     * d - {Float} duration of the transition
     */
    easeIn: function(t, b, c, d) {
        return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
    },
    
    /**
     * APIFunction: easeOut
     * 
     * Parameters:
     * t - {Float} time
     * b - {Float} beginning position
     * c - {Float} total change
     * d - {Float} duration of the transition
     */
	easeOut: function(t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
    
	/**
     * APIFunction: easeInOut
     * 
     * Parameters:
     * t - {Float} time
     * b - {Float} beginning position
     * c - {Float} total change
     * d - {Float} duration of the transition
     */
    easeInOut: function(t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},

    CLASS_NAME: "OpenLayers.Easing.Expo"
};