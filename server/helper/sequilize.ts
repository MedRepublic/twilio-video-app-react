import { Sequelize } from "sequelize-typescript";

import {Room } from "../models";

const connection = new Sequelize({
  dialect: "postgres",
  host: "localhost",
  username: "postgres",
  password: "root",
  port: 5432,
  database: "pulse",
  logging: false,
  models: [Room],
});

export default connection;