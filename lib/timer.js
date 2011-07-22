/*!
 * timer.js v0.0.4
 * https://github.com/minodisk/timer-js/lib/timer.js
 *
 * Author: Daisuke MINO
 * 
 * Licensed under the MIT license.
 * https://github.com/minodisk/timer-js/raw/master/LICENSE
 */
(function () {
  var events = require('events'),
    util = require('util');

  function Timer(delay, repeatCount) {
    this._constructor.apply(this, arguments);
  }


  Timer.TIMER = 'timer';
  Timer.TIMER_COMPLETE = 'timerComplete';


  Timer.prototype = new events.EventEmitter();


  /*Timer.prototype._delay;
   Timer.prototype._repeatCount;
   Timer.prototype._running;
   Timer.prototype._currentCount;
   Timer.prototype._intervalId;*/


  Timer.prototype.__defineGetter__('delay', function () {
    return this._delay;
  });

  Timer.prototype.__defineSetter__('delay', function (value) {
    var running = this._running;
    this.stop();
    this._delay = value;
    if (running) {
      this.start();
    }
  });

  Timer.prototype.__defineGetter__('repeatCount', function () {
    return this._repeatCount;
  });

  Timer.prototype.__defineSetter__('repeatCount', function (value) {
    this._repeatCount = value;
    var notEndless = (this._repeatCount !== 0);
    var finished = (this._currentCount >= this._repeatCount);
    if (notEndless && finished) {
      this.stop();
    }
  });

  Timer.prototype.__defineGetter__('currentCount', function () {
    return this._currentCount;
  });

  Timer.prototype.__defineGetter__('running', function () {
    return this._running;
  });


  Timer.prototype._constructor = function (delay, repeatCount/*=0*/) {
    delay = Number(delay);
    if (isNaN(delay)) {
      throw new Error('Timer constructor requires delay as Number.');
    }
    repeatCount = Number(repeatCount);
    repeatCount = (isNaN(repeatCount)) ? 0 : repeatCount;

    this._delay = delay;
    this._repeatCount = repeatCount;
    this.reset();
  };


  Timer.prototype.reset = function () {
    this.stop();
    this._currentCount = 0;
  };

  Timer.prototype.start = function () {
    var endless = (this._repeatCount === 0);
    var notFinished = (this._currentCount < this._repeatCount);
    if (!this._running && (endless || notFinished)) {
      if (this._intervalId) {
        clearInterval(this._intervalId);
      }
      this._running = true;
      this._intervalId = setInterval(this._onInterval, this._delay, this);
    }
  };

  Timer.prototype.stop = function () {
    this._running = false;
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalID = null;
    }
  };


  Timer.prototype._onInterval = function (that) {
    that._currentCount++;
    that.emit('timer');
    var notEndless = (that._repeatCount !== 0);
    var finished = (that._currentCount >= that._repeatCount);
    if (notEndless && finished) {
      that.stop();
      that.emit('timerComplete');
    }
  };


  if (typeof exports !== 'undefined') {
    // export to NodeJS
    exports.Timer = Timer;
  }


})();