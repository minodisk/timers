(function () {
  var Timer = require('../lib/timer.js').Timer;
  var timer = new Timer(1000, 3);

  timer.addListener('timer', function () {
    console.log('timer', timer.currentCount, timer.repeatCount);
  });
  timer.addListener('timerComplete', function () {
    console.log('timerComplete', timer.currentCount, timer.repeatCount);
  });
  timer.start();
})();
