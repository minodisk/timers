(function () {
  var nodeunit = require('nodeunit');
  var events = require('events');
  var Timer = require('../lib/timers').Timer;

  var _case = {};

  _case.setUp = function (next) {
    next();
  };

  _case['start -> complete'] = function (test) {
    var counter = 0;
    var from = new Date();
    var timer = new Timer(1000, 3);
    test.strictEqual(timer instanceof events.EventEmitter, true);
    timer.addListener(Timer.TIMER, function () {
      counter++;

      test.strictEqual(timer.currentCount, counter);
      test.strictEqual(timer.currentCount <= timer.repeatCount, true);
      test.strictEqual(timer.delay, 1000);
      test.strictEqual(timer.repeatCount, 3);
      test.strictEqual(timer.running, true);
      test.strictEqual(_getTime(from), 1000 * timer.currentCount);
    });
    timer.addListener(Timer.TIMER_COMPLETE, function () {
      test.strictEqual(timer.currentCount, timer.repeatCount);
      test.strictEqual(timer.delay, 1000);
      test.strictEqual(timer.repeatCount, 3);
      test.strictEqual(timer.running, false);
      test.strictEqual(_getTime(from), 3000);

      test.done();
    });
    timer.start();
  };

  _case['start -> start -> complete'] = function (test) {
    var counter = 0;
    var from = new Date();
    var timer = new Timer(1000, 3);
    test.strictEqual(timer instanceof events.EventEmitter, true);
    timer.addListener(Timer.TIMER, function () {
      counter++;

      test.strictEqual(timer.currentCount, counter);
      test.strictEqual(timer.currentCount <= timer.repeatCount, true);
      test.strictEqual(timer.repeatCount, 3);
      test.strictEqual(timer.delay, 1000);
      test.strictEqual(timer.running, true);
      test.strictEqual(_getTime(from), 1000 * timer.currentCount);
    });
    timer.addListener(Timer.TIMER_COMPLETE, function () {
      test.strictEqual(timer.currentCount, timer.repeatCount);
      test.strictEqual(timer.repeatCount, 3);
      test.strictEqual(timer.delay, 1000);
      test.strictEqual(timer.running, false);
      test.strictEqual(_getTime(from), 3000);

      test.done();
    });
    timer.start();

    setTimeout(function () {
      timer.start();
    }, 2500);
  };

  _case['start -> complete -> start'] = function (test) {
    var counter = 0;
    var from = new Date();
    var timer = new Timer(1000, 3);
    test.strictEqual(timer instanceof events.EventEmitter, true);
    timer.addListener(Timer.TIMER, function () {
      counter++;

      test.strictEqual(timer.currentCount, counter);
      test.strictEqual(timer.currentCount <= timer.repeatCount, true);
      test.strictEqual(timer.repeatCount, 3);
      test.strictEqual(timer.delay, 1000);
      test.strictEqual(timer.running, true);
      test.strictEqual(_getTime(from), 1000 * timer.currentCount);
    });
    timer.addListener(Timer.TIMER_COMPLETE, function () {
      test.strictEqual(timer.currentCount, timer.repeatCount);
      test.strictEqual(timer.repeatCount, 3);
      test.strictEqual(timer.delay, 1000);
      test.strictEqual(timer.running, false);
      test.strictEqual(_getTime(from), 3000);

      timer.start();
    });
    timer.start();

    setTimeout(function () {
      test.done();
    }, 7000);
  };

  _case['start -> stop -> start -> complete'] = function (test) {
    var counter = 0;
    var from = new Date();
    var timer = new Timer(1000, 3);
    timer.addListener(Timer.TIMER, function () {
      counter++;

      test.strictEqual(timer.currentCount, counter);
      test.strictEqual(timer.currentCount <= timer.repeatCount, true);
      test.strictEqual(timer.repeatCount, 3);
      test.strictEqual(timer.delay, 1000);
      test.strictEqual(timer.running, true);
      if (timer.currentCount !== timer.repeatCount) {
        test.strictEqual(_getTime(from), 1000 * timer.currentCount);
      } else {
        test.strictEqual(_getTime(from), 3500);
      }
    });
    timer.addListener(Timer.TIMER_COMPLETE, function () {
      test.strictEqual(timer.currentCount, timer.repeatCount);
      test.strictEqual(timer.repeatCount, 3);
      test.strictEqual(timer.delay, 1000);
      test.strictEqual(timer.running, false);
      test.strictEqual(_getTime(from), 3500);

      test.done();
    });
    timer.start();
    setTimeout(function () {
      timer.stop();
      timer.start();
    }, 2500);
  };

  _case['start -> reset -> start -> complete'] = function (test) {
    var counter = 0;
    var from = new Date();
    var timer = new Timer(1000, 3);
    timer.addListener(Timer.TIMER, function () {
      counter++;

      test.strictEqual(timer.currentCount <= timer.repeatCount, true);
      test.strictEqual(timer.repeatCount, 3);
      test.strictEqual(timer.delay, 1000);
      test.strictEqual(timer.running, true);
      if (counter <= 2) {
        test.strictEqual(timer.currentCount, counter);
        test.strictEqual(_getTime(from), 1000 * timer.currentCount);
      } else {
        test.strictEqual(timer.currentCount, counter - 2);
        test.strictEqual(_getTime(from), 2500 + 1000 * timer.currentCount);
      }
    });
    timer.addListener(Timer.TIMER_COMPLETE, function () {
      test.strictEqual(timer.currentCount, timer.repeatCount);
      test.strictEqual(timer.repeatCount, 3);
      test.strictEqual(timer.delay, 1000);
      test.strictEqual(timer.running, false);
      test.strictEqual(_getTime(from), 5500);

      test.done();
    });
    timer.start();
    setTimeout(function () {
      timer.reset();
      timer.start();
    }, 2500);
  };

  _case['start -> complete -> set delay -> reset -> start -> complete'] = function (test) {
    var counter = 0;
    var from = new Date();
    var timer = new Timer(1000, 3);
    timer.addListener(Timer.TIMER_COMPLETE, function () {
      counter++;

      test.strictEqual(timer.currentCount, timer.repeatCount);
      test.strictEqual(timer.repeatCount, 3);
      test.strictEqual(timer.running, false);
      if (counter === 1) {
        test.strictEqual(timer.delay, 1000);
        test.strictEqual(_getTime(from), 3000);

        timer.delay = 900;
        timer.reset();
        timer.start();
      } else {
        test.strictEqual(timer.delay, 900);
        test.strictEqual(_getTime(from), 3000 + 2700);

        test.done();
      }
    });
    timer.start();
  };

  _case['start -> set delay -> complete'] = function (test) {
    var counter = 0;
    var from = new Date();
    var timer = new Timer(1000, 3);
    timer.addListener(Timer.TIMER, function () {
      counter++;

      test.strictEqual(timer.currentCount, counter);
      test.strictEqual(timer.currentCount <= timer.repeatCount, true);
      test.strictEqual(timer.repeatCount, 3);
      test.strictEqual(timer.running, true);
      if (counter <= 2) {
        test.strictEqual(timer.delay, 1000);
        test.strictEqual(_getTime(from), 1000 * timer.currentCount);
      } else {
        test.strictEqual(timer.delay, 900);
        test.strictEqual(_getTime(from), 3400);
      }
    });
    timer.addListener(Timer.TIMER_COMPLETE, function () {
      test.strictEqual(timer.currentCount, timer.repeatCount);
      test.strictEqual(timer.repeatCount, 3);
      test.strictEqual(timer.delay, 900);
      test.strictEqual(timer.running, false);
      test.strictEqual(_getTime(from), 3400);

      test.done();
    });
    timer.start();

    setTimeout(function () {
      timer.delay = 900;
    }, 2500);
  };

  _case['start -> set repeatCount(>currentCount) -> complete'] = function (test) {
    var counter = 0;
    var from = new Date();
    var timer = new Timer(1000, 3);
    timer.addListener(Timer.TIMER, function () {
      counter++;

      test.strictEqual(timer.currentCount, counter);
      test.strictEqual(timer.currentCount <= timer.repeatCount, true);
      test.strictEqual(timer.delay, 1000);
      test.strictEqual(timer.running, true);
      test.strictEqual(_getTime(from), 1000 * timer.currentCount);
      if (counter <= 2) {
        test.strictEqual(timer.repeatCount, 3);
      } else {
        test.strictEqual(timer.repeatCount, 5);
      }
    });
    timer.addListener(Timer.TIMER_COMPLETE, function () {
      test.strictEqual(timer.currentCount, timer.repeatCount);
      test.strictEqual(timer.delay, 1000);
      test.strictEqual(timer.repeatCount, 5);
      test.strictEqual(timer.running, false);
      test.strictEqual(_getTime(from), 5000);

      test.done();
    });
    timer.start();
    setTimeout(function () {
      timer.repeatCount = 5;
    }, 2500);
  };

  _case['start -> set repeatCount(<=currentCount)'] = function (test) {
    var counter = 0;
    var from = new Date();
    var timer = new Timer(1000, 3);
    timer.addListener(Timer.TIMER, function () {
      counter++;

      test.strictEqual(timer.currentCount, counter);
      test.strictEqual(timer.currentCount <= timer.repeatCount, true);
      test.strictEqual(timer.repeatCount, 3);
      test.strictEqual(timer.delay, 1000);
      test.strictEqual(timer.running, true);
      test.strictEqual(_getTime(from), 1000 * timer.currentCount);
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
    return Math.floor(((new Date()).getTime() - from.getTime()) / 100) * 100;
  }

  module.exports = nodeunit.testCase(_case);

})();