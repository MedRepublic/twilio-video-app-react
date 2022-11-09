import { Sequelize } from "sequelize-typescript";

import {Room } from "../models";

const connection = new Sequelize({
  dialect: "mysql",
  host: "localhost",
  username: "root",
  password: "",
  port: 3306,
  database: "test",
  logging: false,
  models: [Room],
});

export default connection;