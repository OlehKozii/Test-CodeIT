import { NextFunction, Request, Response } from "express";

import { customError } from "../middleware/errorHandlerMiddleware";
import { UserDto } from "./userConstroller.dto";
import pwdActions from "../utils/pwdActions";
import jwtActions from "../utils/jwtActions";
import User from "../model/userModel";
import { Op, ValidationError } from "sequelize";

class userController {
  signup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<UserDto | unknown> => {
    try {
      const { email, login, realName, password, birth, country } = req.body;
      if (!email || !login || !realName || !password || !birth || !country) {
        return next(customError.badRequest("Not enough data provided"));
      }
      const candidate = await User.findOne({
        where: {
          [Op.or]: [{ email }, { login }],
        },
      });
      if (candidate) {
        return next(customError.forbidden("User already exists"));
      }
      const hash = await pwdActions.hashPwd(password);
      const user: User = await User.create({
        email: email,
        login: login,
        realName: realName,
        password: hash,
        birth: birth,
        country: country,
      });
      const tokens = jwtActions.generateBothToken(user.id, email, login);
      await user.update({ token: tokens.refresh_token });
      res.cookie("refresh_token", tokens.refresh_token, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json({ access_token: tokens.access_token });
    } catch (e) {
      console.log(e);
      if (e instanceof ValidationError)
        return next(customError.badRequest("Bad data"));
      return next(customError.internal("Some problems with server"));
    }
  };

  signin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<UserDto | unknown> => {
    try {
      const { loginOrEmail, password } = req.body;
      if (!loginOrEmail || !password) {
        return next(customError.badRequest("Not enough data provided"));
      }
      const user = await User.findOne({
        where: { [Op.or]: [{ email: loginOrEmail }, { login: loginOrEmail }] },
      });

      if (!user) {
        res.clearCookie("refresh_token");
        return next(customError.notFound("No such user"));
      }
      if (!(await pwdActions.verifyPwd(password, user.password))) {
        return next(customError.forbidden("Wrong password"));
      }
      const tokens = jwtActions.generateBothToken(
        user.id,
        user.email,
        user.login
      );
      res.cookie("refresh_token", tokens.refresh_token, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      await user.update({ token: tokens.refresh_token });

      return res.json({ access_token: tokens.access_token });
    } catch (e) {
      console.log(e);
      return next(customError.internal("Some problems with server"));
    }
  };
  getOne = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<UserDto | unknown> => {
    try {
      const { id } = req.body;
      const user = await User.findOne({
        where: { id: id },
        attributes: {
          exclude: ["password", "token", "createdAt", "updatedAt"],
        },
      });
      if (!user) {
        res.clearCookie("refresh_token");
        return next(customError.forbidden("No such user"));
      }
      return res.json(user);
    } catch (e) {
      console.log(e);
      return next(customError.internal("Some problems with server"));
    }
  };
}

export default new userController();
