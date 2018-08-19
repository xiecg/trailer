
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;
const SALT_WORK_FACTOR = 10;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 60 * 1000;

const userSchema = new Schema({
  username: {
    unique: true,
    required: true,
    type: String
  },
  email: {
    unique: true,
    required: true,
    type: String
  },
  password: {
    unique: true,
    type: String
  },
  /* 尝试登录次数 */
  loginAttempts: {
    type: Number,
    required: true,
    default: 0
  },
  role: {
    type: String,
    default: 'user'
  },
  /* 锁定时间 */
  lockUntil: Number,
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
});

userSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

userSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now();
  } else {
    this.meta.updatedAt = Date.now();
  }
  next();
});

userSchema.pre('save', function (next) {
  // 密码是否被更改
  if (!this.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(this.password, salt, (error, hash) => {
      if (error) return next(error);
      this.password = hash;
      next();
    });
  });
});

userSchema.methods = {
  /**
   * userPassword 用户输入的密码
   * dbPassword 数据库存储加密后的密码
   */
  comparePassword(userPassword, dbPassword) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(userPassword, dbPassword, (err, isMatch) => {
        err ? reject(err) : resolve(isMatch);
      });
    });
  },
  /**
   * 判断用户的登录次数
   * @param {*} user 
   */
  incLoginAttepts(user) {
    return new Promise((resolve, reject) => {
      // 已经被锁定，但是过了有效期
      if (this.lockUntil && this.lockUntil < Date.now()) {
        this.update({
          $set: {
            loginAttempts: 1
          },
          $unset: {
            lockUntil: 1
          }
        }, (err) => {
          err ? reject(err) : resolve(true);
        })
      } else {
        let updates = {
          $inc: {
            loginAttempts: 1
          }
        }
        if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
          updates.$set = {
            lockUntil: Date.now() + LOCK_TIME
          }
        }
        this.update(updates, err => {
          err ? reject(err) : resolve(true);
        });
      }
    });
  }
}

mongoose.model('User', userSchema);
