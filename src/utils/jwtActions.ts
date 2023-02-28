import jwt from "jsonwebtoken";

class jwtActions {
  generateAccessToken = (id: number, email: string, login: string) => {
    return jwt.sign({ id, email, login }, `${process.env.secret}`, {
      expiresIn: 60 * 60,
    });
  };

  generateRefreshToken = (id: number) => {
    return jwt.sign({ id }, `${process.env.secret}`, {
      expiresIn: 7 * 24 * 60 * 60,
    });
  };

  generateBothToken = (id: number, email: string, login: string) => {
    return {
      access_token: this.generateAccessToken(id, email, login),
      refresh_token: this.generateRefreshToken(id),
    };
  };

  verifyToken = (token: string) => {
    return jwt.verify(token, `${process.env.secret}`);
  };
}

export default new jwtActions();
