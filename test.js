
console.log('111');

process.nextTick(function () {
  console.log('下一次Event Loop即将开始!');
});


setTimeout(function () {
  console.log('已经到了下一轮Event Loop！');
}, 0);

console.log('222');