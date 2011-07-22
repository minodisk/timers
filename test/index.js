(function () {
  var nodeunit = require('nodeunit');
  var events = require('events');
  var Timer = require('../lib/timer.js').Timer;

  var _case = {};

  _case.setUp = function (next) {
    next();
  };

  _case['start -> complete'] = function (test) {
    var counter, time, timer;

    counter = 0;
    time = (new Date()).getTime();
    timer = new Timer(1000, 3);
    test.strictEqual(timer instanceof events.EventEmitter, true);
    timer.addListener(Timer.TIMER, function () {
      var t;

      counter++;
      t = (((new Date()).getTime() - time) / 10 >> 0) * 10;

      test.strictEqual(timer.currentCount, counter);
      test.strictEqual(timer.currentCount <= timer.repeatCount, true);
      test.strictEqual(timer.delay, 1000);
      test.strictEqual(timer.repeatCount, 3);
      test.strictEqual(timer.running, true);
      test.strictEqual(t, 1000 * timer.currentCount);
    });
    timer.addListener(Timer.TIMER_COMPLETE, function () {
      var t;

      t = (((new Date()).getTime() - time) / 10 >> 0) * 10;

      test.strictEqual(timer.currentCount, timer.repeatCount);
      test.strictEqual(timer.delay, 1000);
      test.strictEqual(timer.repeatCount, 3);
      test.strictEqual(timer.running, false);
      test.strictEqual(t, 3000);

      test.done();
    });
    timer.start();
  };

  _case['start -> start -> complete'] = function (test) {
    var counter, time, timer;

    counter = 0;
    time = (new Date()).getTime();
    timer = new Timer(1000, 3);
    test.strictEqual(timer instanceof events.EventEmitter, true);
    timer.addListener(Timer.TIMER, function () {
      var t;

      counter++;
      t = (((new Date()).getTime() - time) / 10 >> 0) * 10;

      test.strictEqual(timer.currentCount, counter);
      test.strictEqual(timer.currentCount <= timer.repeatCount, true);
      test.strictEqual(timer.repeatCount, 3);
      test.strictEqual(timer.delay, 1000);
      test.strictEqual(timer.running, true);
      test.strictEqual(t, 1000 * timer.currentCount);
    });
    timer.addListener(Timer.TIMER_COMPLETE, function () {
      var t;

      t = (((new Date()).getTime() - time) / 10 >> 0) * 10;

      test.strictEqual(timer.currentCount, timer.repeatCount);
      test.strictEqual(timer.repeatCount, 3);
      test.strictEqual(timer.delay, 1000);
      test.strictEqual(timer.running, false);
      test.strictEqual(t, 3000);
      test.done();
    });
    timer.start();

    setTimeout(function () {
      timer.start();
    }, 2500);
  };

  _case['start -> complete -> start'] = function (test) {
    var counter, time, timer;

    counter = 0;
    time = (new Date()).getTime();
    timer = new Timer(1000, 3);
    test.strictEqual(timer instanceof events.EventEmitter, true);
    timer.addListener(Timer.TIMER, function () {
      var t;

      counter++;
      t = (((new Date()).getTime() - time) / 10 >> 0) * 10;

      test.strictEqual(timer.currentCount, counter);
      test.strictEqual(timer.currentCount <= timer.repeatCount, true);
      test.strictEqual(timer.repeatCount, 3);
      test.strictEqual(timer.delay, 1000);
      test.strictEqual(timer.running, true);
      test.strictEqual(t, 1000 * timer.currentCount);
    });
    timer.addListener(Timer.TIMER_COMPLETE, function () {
      var t;

      t = (((new Date()).getTime() - time) / 10 >> 0) * 10;

      test.strictEqual(timer.currentCount, timer.repeatCount);
      test.strictEqual(timer.repeatCount, 3);
      test.strictEqual(timer.delay, 1000);
      test.strictEqual(timer.running, false);
      test.strictEqual(t, 3000);

      timer.start();
    });
    timer.start();

    setTimeout(function () {
      test.done();
    }, 7000);
  };

  _case['start -> stop -> start -> complete'] = function (test) {
    var counter, time, timer;

    counter = 0;
    time = (new Date()).getTime();
    timer = new Timer(1000, 3);
    timer.addListener(Timer.TIMER, function () {
      var t;

      counter++;
      t = (((new Date()).getTime() - time) / 10 >> 0) * 10;

      test.strictEqual(timer.currentCount, counter);
      test.strictEqual(timer.currentCount <= timer.repeatCount, true);
      test.strictEqual(timer.repeatCount, 3);
      test.strictEqual(timer.delay, 1000);
      test.strictEqual(timer.running, true);
      if (timer.currentCount !== timer.repeatCount) {
        test.strictEqual(t, 1000 * timer.currentCount);
      } else {
        test.strictEqual(t, 3500);
      }
    });
    timer.addListener(Timer.TIMER_COMPLETE, function () {
      var t;

      t = (((new Date()).getTime() - time) / 10 >> 0) * 10;

      test.strictEqual(timer.currentCount, timer.repeatCount);
      test.strictEqual(timer.repeatCount, 3);
      test.strictEqual(timer.delay, 1000);
      test.strictEqual(timer.running, false);
      test.strictEqual(t, 3500);

      test.done();
    });
    timer.start();
    setTimeout(function () {
      timer.stop();
      timer.start();
    }, 2500);
  };

  _case['start -> reset -> start -> complete'] = function (test) {
    var counter, time, timer;

    counter = 0;
    time = (new Date()).getTime();
    timer = new Timer(1000, 3);
    timer.addListener(Timer.TIMER, function () {
      var t;

      counter++;
      t = (((new Date()).getTime() - time) / 10 >> 0) * 10;

      test.strictEqual(timer.currentCount <= timer.repeatCount, true);
      test.strictEqual(timer.repeatCount, 3);
      test.strictEqual(timer.delay, 1000);
      test.strictEqual(timer.running, true);
      if (counter <= 2) {
        test.strictEqual(timer.currentCount, counter);
        test.strictEqual(t, 1000 * timer.currentCount);
      } else {
        test.strictEqual(timer.currentCount, counter - 2);
        test.strictEqual(t, 2500 + 1000 * timer.currentCount);
      }
    });
    timer.addListener(Timer.TIMER_COMPLETE, function () {
      var t;

      t = (((new Date()).getTime() - time) / 10 >> 0) * 10;

      test.strictEqual(timer.currentCount, timer.repeatCount);
      test.strictEqual(timer.repeatCount, 3);
      test.strictEqual(timer.delay, 1000);
      test.strictEqual(timer.running, false);
      test.strictEqual(t, 5500);

      test.done();
    });
    timer.start();
    setTimeout(function () {
      timer.reset();
      timer.start();
    }, 2500);
  };

  _case['start -> complete -> set delay -> reset -> start -> complete'] = function (test) {
    var counter, time, timer;

    counter = 0;
    time = (new Date()).getTime();
    timer = new Timer(1000, 3);
    timer.addListener(Timer.TIMER_COMPLETE, function () {
      var t;

      counter++;
      t = (((new Date()).getTime() - time) / 10 >> 0) * 10;

      test.strictEqual(timer.currentCount, timer.repeatCount);
      test.strictEqual(timer.repeatCount, 3);
      test.strictEqual(timer.running, false);
      if (counter === 1) {
        test.strictEqual(timer.delay, 1000);
        test.strictEqual(t, 3000);

        timer.delay = 900;
        timer.reset();
        timer.start();
      } else {
        test.strictEqual(timer.delay, 900);
        test.strictEqual(t, 3000 + 2700);

        test.done();
      }
    });
    timer.start();
  };

  _case['start -> set delay -> complete'] = function (test) {
    var counter, time, timer;

    counter = 0;
    time = (new Date()).getTime();
    timer = new Timer(1000, 3);
    timer.addListener(Timer.TIMER, function () {
      var t;

      counter++;
      t = (((new Date()).getTime() - time) / 10 >> 0) * 10;

      test.strictEqual(timer.currentCount, counter);
      test.strictEqual(timer.currentCount <= timer.repeatCount, true);
      test.strictEqual(timer.repeatCount, 3);
      test.strictEqual(timer.running, true);
      if (counter <= 2) {
        test.strictEqual(timer.delay, 1000);
        test.strictEqual(t, 1000 * timer.currentCount);
      } else {
        test.strictEqual(timer.delay, 900);
        test.strictEqual(t, 3400);
      }
    });
    timer.addListener(Timer.TIMER_COMPLETE, function () {
      var t;

      t = (((new Date()).getTime() - time) / 10 >> 0) * 10;

      test.strictEqual(timer.currentCount, timer.repeatCount);
      test.strictEqual(timer.repeatCount, 3);
      test.strictEqual(timer.delay, 900);
      test.strictEqual(timer.running, false);
      test.strictEqual(t, 3400);

      test.done();
    });
    timer.start();

    setTimeout(function () {

      timer.delay = 900;
    }, 2500);
  };

  _case['start -> set repeatCount(>currentCount) -> complete'] = function (test) {
    var counter, time, timer;

    counter = 0;
    time = (new Date()).getTime();
    timer = new Timer(1000, 3);
    timer.addListener(Timer.TIMER, function () {
      var t;

      counter++;
      t = (((new Date()).getTime() - time) / 10 >> 0) * 10;

      test.strictEqual(timer.currentCount, counter);
      test.strictEqual(timer.currentCount <= timer.repeatCount, true);
      test.strictEqual(timer.delay, 1000);
      test.strictEqual(timer.running, true);
      test.strictEqual(t, 1000 * timer.currentCount);
      if (counter <= 2) {
        test.strictEqual(timer.repeatCount, 3);
      } else {
        test.strictEqual(timer.repeatCount, 5);
      }
    });
    timer.addListener(Timer.TIMER_COMPLETE, function () {
      var t;

      t = (((new Date()).getTime() - time) / 10 >> 0) * 10;

      test.strictEqual(timer.currentCount, timer.repeatCount);
      test.strictEqual(timer.delay, 1000);
      test.strictEqual(timer.repeatCount, 5);
      test.strictEqual(timer.running, false);
      test.strictEqual(t, 5000);

      test.done();
    });
    timer.start();
    setTimeout(function () {
      timer.repeatCount = 5;
    }, 2500);
  };

  _case['start -> set repeatCount(<=currentCount)'] = function (test) {
    var counter, time, timer;

    counter = 0;
    time = (new Date()).getTime();
    timer = new Timer(1000, 3);
    timer.addListener(Timer.TIMER, function () {
      var t;

      counter++;
      t = (((new Date()).getTime() - time) / 10 >> 0) * 10;

      test.strictEqual(timer.currentCount, counter);
      test.strictEqual(timer.currentCount <= timer.repeatCount, true);
      test.strictEqual(timer.repeatCount, 3);
      test.strictEqual(timer.delay, 1000);
      test.strictEqual(timer.running, true);
      test.strictEqual(t, 1000 * timer.currentCount);
    });
    timer.addListener(Timer.TIMER_COMPLETE, function () {
      test.strictEqual('failure: complete', '');
    });
    timer.start();
    setTimeout(function () {
      timer.repeatCount = 2;
    }, 2500);
    setTimeout(function () {
      test.strictEqual(timer.currentCount, timer.repeatCount);
      test.strictEqual(timer.repeatCount, 2);
      test.strictEqual(timer.delay, 1000);
      test.strictEqual(timer.running, false);
      test.done();
    }, 5000);
  };

  function _getTime(from) {
    return Math.round(((new Date()).getTime() - from.getTime()) / 10) * 10;
  }

  module.exports = nodeunit.testCase(_case);

})();
