(function () {
  var Timer = require('../lib/timer.js').Timer;
  var mainTimer = new Timer(5000);
  var subTimer = new Timer(1000, 3);

  subTimer.addListener('timer', function () {
    console.log('sub timer', subTimer.currentCount, subTimer.repeatCount);
  });
  subTimer.addListener('timerComplete', function () {
    console.log('sub timerComplete', subTimer.currentCount, subTimer.repeatCount);
    subTimer.reset();
  });
  mainTimer.addListener('timer', function () {
    console.log('main timer', mainTimer.currentCount, mainTimer.repeatCount);
    subTimer.start();
  });
  mainTimer.start();
})();
