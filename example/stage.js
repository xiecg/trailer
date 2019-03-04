
const { readFile } = require('fs');
const EventEmitter = require('events');

class EE extends EventEmitter {};

const yy = new EE();

yy.on('event', () => {
  console.log('粗大事了!');
});

setTimeout(() => {
  console.log('0 毫秒后到期执行的定时器回调');
}, 0);

setTimeout(() => {
  console.log('100 毫秒后到期执行的定时器回调');
}, 100);

setTimeout(() => {
  console.log('200 毫秒后到期执行的定时器回调');
}, 200);


readFile('../package.json', 'utf-8', data => {
  console.log('完成文件 1 读操作的回调');
});

readFile('../README.md', 'utf-8', data => {
  console.log('完成文件 2 读操作的回调');
});

setImmediate(() => {
  console.log('immediate 立即回调');
});

process.nextTick(() => {
  console.log('process.nextTick 的回调');
});

Promise.resolve().then(() => {
    yy.emit('event');

    process.nextTick(() => {
      console.log('process.nextTick 的第 2 次回调');
    });

    console.log('Promise 的第 1 次回调');
  }).then(() => { 
    console.log('Promise 的第 2 次回调');
});


/*
// 1, 7, 8, 2, 4, 9, 11, 5, 12

setTimeout(() => {
    console.log(2)
    new Promise(resolve => {
        console.log(4)
        resolve()
    }).then(() => {
        console.log(5)
    })
})

new Promise(resolve => {
    console.log(7)
    resolve()
}).then(() => {
    console.log(8)
})

setTimeout(() => {
    console.log(9)
    new Promise(resolve => {
        console.log(11)
        resolve()
    }).then(() => {
        console.log(12)
    })
})
*/

// setTimeout(() => {
// 	console.log(1)
// }, 1)

// setTimeout(() => {
// 	console.log(2)
// }, 2)

// setTimeout(() => {
// 	console.log(0)
// }, 0)











/*
// 1, 7, 6, 8, 2, 4, 9, 11, 3, 10, 5, 12

console.log('1');

setTimeout(function() {
    console.log('2');
    process.nextTick(function() {
        console.log('3');
    })
    new Promise(function(resolve) {
        console.log('4');
        resolve();
    }).then(function() {
        console.log('5')
    })
})
process.nextTick(function() {
    console.log('6');
})
new Promise(function(resolve) {
    console.log('7');
    resolve();
}).then(function() {
    console.log('8')
})

setTimeout(function() {
    console.log('9');
    process.nextTick(function() {
        console.log('10');
    })
    new Promise(function(resolve) {
        console.log('11');
        resolve();
    }).then(function() {
        console.log('12')
    })
})
*/



/*
// 2, 1, 10, 5, 6, 8, 9, 7, 4, 3, 8, 9, 8, 9 ...

process.nextTick(() => {
    console.log('1');
});

console.log('2');

setTimeout(() => {
    console.log('3');
}, 3000);

setTimeout(() => {
    console.log('4');
}, 2500);

setTimeout(() => {
    console.log('5');
    process.nextTick(function() {
        console.log('6');
    });
    setTimeout(() => {
        console.log('7');
    }, 1200);
}, 1000);

setInterval(() => {
    console.log('8');
    process.nextTick(function() {
        console.log('9');
    });
}, 2000);

process.nextTick(() => {
    console.log('10');
});
*/


// setTimeout(() => {
// 	console.log(2)
// }, 2)

// setTimeout(() => {
// 	console.log(1)
// }, 1)

// setTimeout(() => {
// 	console.log(0)
// }, 0)


/*
// script start
// async1 start
// async2
// promise1
// script end
// async1 end
// promise2
// setTimeout


function async1() {
  console.log('async1 start')
  return Promise.resolve(async2()).then(res => {
    console.log('async1 end')
  })
}

function async2() {
  console.log('async2')
}

console.log('script start')

setTimeout(function() {
  console.log('setTimeout')
}, 0)

async1()

new Promise(function(resolve) {
  console.log('promise1')
  resolve()
}).then(function() {
  console.log('promise2')
})

console.log('script end')
*/


// setTimeout(()=>{
//     console.log('timer1')
//     Promise.resolve().then(function() {
//         console.log('promise1')
//     });
// }, 0);

// setTimeout(()=>{
//     console.log('timer2')
//     Promise.resolve().then(function() {
//         console.log('promise2')
//     });
// }, 0);


// Promise.resolve().then(()=>{
//     console.log('Promise1')  
//     setTimeout(()=>{
//       console.log('setTimeout2')
//     },0)
//   })
//   setTimeout(()=>{
//     console.log('setTimeout1')
//     Promise.resolve().then(()=>{
//       console.log('Promise2')
//     })
//   },0)


/*
// 9, 5, 8, 1, 7, 4, 3, 6, 2

setImmediate(() => {
    console.log(1)
    setTimeout(() => {
        console.log(2)
    }, 100)
    setImmediate(() => {
        console.log(3)
    })
    process.nextTick(() => {
        console.log(4)
    })
})
process.nextTick(() => {
    console.log(5)
    setTimeout(() => {
        console.log(6)
    }, 100)
    setImmediate(() => {
        console.log(7)
    })
    process.nextTick(() => {
        console.log(8)
    })
})
console.log(9)

*/


/*
setImmediate(function(){
    console.log(1);
    process.nextTick(function(){
        console.log(2);
    });
});

process.nextTick(function(){
    console.log(3);
    setImmediate(function(){
        console.log(4);
    })
});
*/


/*
setTimeout(function(){
    console.log(1);
    process.nextTick(function(){
        console.log(2);
    });
});

process.nextTick(function(){
    console.log(3);
    setTimeout(function(){
        console.log(4);
    });
});
*/
