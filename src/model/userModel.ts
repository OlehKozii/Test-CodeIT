import sequelize from "../data-source";
import { Model, DataTypes } from "sequelize";

export default class User extends Model {
  id: number;
  email: string;
  login: string;
  realName: string;
  password: string;
  birth: string;
  country: string;
  token: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    login: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    realName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    birth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "User",
  }
);
