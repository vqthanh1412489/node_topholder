import "reflect-metadata"
import { DataSource } from "typeorm"
import { ArkhamAddressInfo } from "./entity/address_info.entity"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "root",
    database: "test",
    synchronize: true,
    logging: false,
    entities: [ArkhamAddressInfo],
    migrations: [],
    subscribers: [],
})
