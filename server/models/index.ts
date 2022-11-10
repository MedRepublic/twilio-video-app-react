import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({
  timestamps: true,
  tableName: "rooms",
})
export class Room extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  roomName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  userName!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  inRoomAdded!: boolean;
}