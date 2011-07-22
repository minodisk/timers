# timer.js
Simple timer, wraps setInterval and clearInterval.

## Installation
    $ npm install timerjs

## API Documentation

### Class Properties
* **TIMER** - 'timer'
* **TIMER_COMPLETE** - 'timerComplete'

### Member Properties
* **currentCount** - \[read-only\] The total number of times the timer has fired since it started at zero.
* **delay** - The delay, in milliseconds, between timer events.
* **repeatCount** - The total number of times the timer is set to run.
* **running** - \[read-only\] The timer's current state.

### Member Methods
* **new Timer(delay, repeatCount = 0)** - Constructs a new Timer object with the specified delay and repeatCount states.
* **reset()** - Stops the timer, if it is running, and sets the currentCount property back to 0.
* **start()** - Starts the timer, if it is not already running and currentCount is less than repeatCount.
* **stop()** - Stops the timer.

### Events
* **Event: 'timer'** - Emitted whenever a Timer object reaches an interval specified according to the delay property.
* **Event: 'timerComplete'** - Emitted whenever it has completed the number of requests set by repeatCount.

## Usage

### [repeat n-th time](https://github.com/minodisk/timer-js/blob/master/example/repeat_n-th_time.js)
    var Timer = require('timerjs').Timer;
    var timer = new Timer(1000, 3);

    timer.addListener('timer', function () {
      console.log('timer', timer.currentCount, timer.repeatCount);
    });
    timer.addListener('timerComplete', function () {
      console.log('timerComplete', timer.currentCount, timer.repeatCount);
    });
    timer.start();

    // [OUTPUT]
    // timer 1 3
    // timer 2 3
    // timer 3 3
    // timerComplete 3 3

### [repeat endlessly](https://github.com/minodisk/timer.js/blob/master/example/repeat_endlessly.js)
    var Timer = require('timerjs').Timer;
    var timer = new Timer(1000);

    timer.addListener('timer', function () {
      console.log('timer', timer.currentCount, timer.repeatCount);
    });
    timer.addListener('timerComplete', function () {
      console.log('timerComplete', timer.currentCount, timer.repeatCount);
    });
    timer.start();

    // [OUTPUT]
    // timer 1 0
    // timer 2 0
    // timer 3 0
    // timer 4 0
    // timer 5 0
    // ...

### [recycle](https://github.com/minodisk/timer.js/blob/master/example/recycle.js)
    var Timer = require('timerjs').Timer;
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

    // [OUTPUT]
    // main timer 1 0
    // sub timer 1 3
    // sub timer 2 3
    // sub timer 3 3
    // sub timerComplete 3 3
    // main timer 2 0
    // sub timer 1 3
    // sub timer 2 3
    // sub timer 3 3
    // sub timerComplete 3 3
    // ...

## License
Licensed under the [MIT license](https://github.com/minodisk/timer-js/raw/master/LICENSE).
