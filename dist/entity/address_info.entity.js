"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArkhamAddressInfo = void 0;
const typeorm_1 = require("typeorm");
let ArkhamAddressInfo = class ArkhamAddressInfo {
};
exports.ArkhamAddressInfo = ArkhamAddressInfo;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        type: 'int'
    }),
    __metadata("design:type", Number)
], ArkhamAddressInfo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ArkhamAddressInfo.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: null
    }),
    __metadata("design:type", String)
], ArkhamAddressInfo.prototype, "chain", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: null
    }),
    __metadata("design:type", String)
], ArkhamAddressInfo.prototype, "entity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: null
    }),
    __metadata("design:type", String)
], ArkhamAddressInfo.prototype, "entity_lable", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: null
    }),
    __metadata("design:type", String)
], ArkhamAddressInfo.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: 0
    }),
    __metadata("design:type", Number)
], ArkhamAddressInfo.prototype, "is_done", void 0);
exports.ArkhamAddressInfo = ArkhamAddressInfo = __decorate([
    (0, typeorm_1.Entity)()
], ArkhamAddressInfo);
//# sourceMappingURL=address_info.entity.js.map