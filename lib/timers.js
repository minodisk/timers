/*!
 * timer.js v0.0.7
 * https://github.com/minodisk/timer-js
 * Author: Daisuke MINO
 * Licensed under the MIT license.
 * https://github.com/minodisk/timer-js/raw/master/LICENSE
 */
(function () {
  var events = require('events');
  var util = require('util');

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
    var isEndless = (this._repeatCount === 0);
    var isComplete = (this._currentCount >= this._repeatCount);
    if (!isEndless && isComplete) {
      this.stop();
    }
  });

  Timer.prototype.__defineGetter__('currentCount', function () {
    return this._currentCount;
  });

  Timer.prototype.__defineGetter__('running', function () {
    return this._running;
  });


  Timer.prototype._constructor = function (delay, repeatCount/* = 0 */) {
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
    var isEndless = (this._repeatCount === 0);
    var isComplete = (this._currentCount >= this._repeatCount);
    if (!this._running && (isEndless || !isComplete)) {
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
      this._intervalId = null;
    }
  };


  Timer.prototype._onInterval = function (that) {
    var isEndless = (that._repeatCount === 0);
    var isComplete = (++that._currentCount >= that._repeatCount);
    that.emit(Timer.TIMER);
    if (!isEndless && isComplete) {
      that.stop();
      that.emit(Timer.TIMER_COMPLETE);
    }
  };


  if (typeof exports !== 'undefined') {
    // Node.js
    exports.Timer = Timer;
  }
})();