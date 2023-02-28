import argon2 from "argon2";

class pwdActions {
  async hashPwd(Pwd: string) {
    try {
      return await argon2.hash(Pwd, { type: argon2.argon2d });
    } catch (e) {
      console.log(e);
    }
  }

  async verifyPwd(candPwd: string, hashPwd: string) {
    try {
      return await argon2.verify(hashPwd, candPwd, {
        type: argon2.argon2d,
      });
    } catch (e) {
      console.log(e);
    }
  }
}

export default new pwdActions();
