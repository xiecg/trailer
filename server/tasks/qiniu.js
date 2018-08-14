
const qiniu = require('qiniu');
const nanoid = require('nanoid');
const config = require('../config');

const { bucket, AK, SK } = config.qiniu;
const mac = new qiniu.auth.digest.Mac(AK, SK);
const cfg = new qiniu.conf.Config();
const client = new qiniu.rs.BucketManager(mac, cfg);

const uploadToQiniu = async (url, key) => {
  return new Promise((resolve, reject) => {
    client.fetch(url, bucket, key, (err, ret, info) => {
      if (err) {
        reject(err);
      } else {
        if (info.statusCode === 200) {
          resolve({ key });
        } else {
          reject(info);
        }
      }
    });
  });
}


(async() => {

  const movies = [{
    video: 'http://vt1.doubanio.com/201808142156/2c98203d5f39cd64bcd5c67c38ca306a/view/movie/M/302190491.mp4',
    doubanId: 26739551,
    cover: 'https://img1.doubanio.com/img/trailer/medium/2493603388.jpg?',
    poster: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2504474084.webp',
  }];

  movies.map(async (movie) => {
    if (movie.video && !movie.videoKey) {
      try {
        console.log('开始传 video')
        let videoData = await uploadToQiniu(movie.video, nanoid() + '.mp4');
        console.log('开始传 cover')
        let coverData = await uploadToQiniu(movie.cover, nanoid() + '.png');
        console.log('开始传 poster')
        let posterData = await uploadToQiniu(movie.poster, nanoid() + '.png');

        if (videoData.key) {
          movie.videoKey = videoData.key;
        }
        if (coverData.key) {
          movie.coverKey = coverData.key;
        }
        if (posterData.key) {
          movie.posterKey = posterData.key;
        }
        console.log(movie)
        // await movie.save();
      } catch (err) {
        console.log(err)
      }
    }
  });

})();