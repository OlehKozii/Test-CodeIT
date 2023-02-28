import { Sequelize } from "sequelize";

const sequelize = new Sequelize(`${process.env.sequelizeURL}`);

export default sequelize;
