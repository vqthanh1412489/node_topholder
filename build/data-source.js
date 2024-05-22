"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const address_info_entity_1 = require("./entity/address_info.entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "root",
    database: "test",
    synchronize: true,
    logging: false,
    entities: [address_info_entity_1.ArkhamAddressInfo],
    migrations: [],
    subscribers: [],
});
//# sourceMappingURL=data-source.js.map