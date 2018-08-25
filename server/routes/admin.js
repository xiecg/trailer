
const { controller, get, post, del, auth, admin, required } = require('../lib/decorator');
const { checkPassword } = require('../service/user');
const { getAllMovies, findAndRemove } = require('../service/movie');

@controller('/admin')
export class adminController {
  async login (ctx, next) {
    const { email, password } = ctx.request.body;
    const matchData = await checkPassword(email, password);

    if (!matchData.user) {
      return (ctx.body = {
        success: false,
        err: '用户不存在'
      });
    }

    if (matchData.match) {
      ctx.session.user = {
        _id: matchData.user._id,
        email: matchData.user.email,
        role: matchData.user.role,
        username: matchData.user.username
      }

      return (ctx.body = {
        success: true
      });
    }

    return (ctx.body = {
      success: false,
      err: '密码不正确'
    });

  }
}