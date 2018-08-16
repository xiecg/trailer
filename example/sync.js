
const doSync = (sth, time) => new Promise(resolve => {
  setTimeout(() => {
    console.log(sth + '用了 ' + time + ' 毫秒');
    resolve();
  }, time);
});

const doAsync = (sth, time, cb) => {
  setTimeout(() => {
    console.log(sth + '用了 ' + time + ' 毫秒');
    cb && cb();
  }, time);
};

const doElse = sth => {
  console.log(sth);
};

const Scott = { doSync, doAsync };
const Meizi = { doSync, doAsync, doElse };

(async () => {
  // console.log('case 1: A 来到门口');
  // await Scott.doSync('B 刷牙', 1000);
  // console.log('啥也没干，一直等');
  // await Meizi.doSync('A 洗澡', 2000);
  // Meizi.doElse('A 去忙别的了');

  console.log('case 3: A 来到门口');
  Scott.doAsync('B 刷牙', 1000, () => {
    console.log('卫生间通知 A 来洗澡');
    Meizi.doAsync('A 洗澡', 2000);
  });
  Meizi.doElse('A 去忙别的了');
})();
