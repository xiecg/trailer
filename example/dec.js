/*
class Boy {
  @speak('中文')
  run () {
    console.log('I can speak ' + this.language);
    console.log('I can run!');
  }
}

function speak (language) {
  return function (target, key, descriptor) {
    console.log(target);
    console.log(key);
    console.log(descriptor);

    target.language = language;

    return descriptor;
  }
}

const luke = new Boy();
luke.run();
*/

class Model {
  _name = 'Niko';
  @log1
  getData1() {
    setTimeout(() => {
      console.log('time');
    }, 1000);
  }
  get name() { return this._name };
  // @log2
  // getData2() {}
}

function log1(tag, name, descriptor) {
  return {
    ...descriptor,
    value(...args) {
      let start = new Date().valueOf()
      try {
        return descriptor.value.apply(this, args)
      } finally {
        let end = new Date().valueOf()
        console.log(`start: ${start} end: ${end} consume: ${end - start}`)
      }
    }
  }
}

// console.log(new Model().getData1());
console.log(new Model().name);