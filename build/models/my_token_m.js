"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyTokenM = void 0;
class MyTokenM {
    constructor({ name, chains, minBalance, }) {
        this.name = name;
        this.chains = chains;
        this.minBalance = minBalance;
    }
    copyWith({ name, chains, minBalance, }) {
        return new MyTokenM({
            name: name !== null && name !== void 0 ? name : this.name,
            chains: chains !== null && chains !== void 0 ? chains : this.chains,
            minBalance: minBalance !== null && minBalance !== void 0 ? minBalance : this.minBalance,
        });
    }
    toJson() {
        return {
            name: this.name,
            chains: this.chains.map((x) => x.toJson()),
            min_balance: this.minBalance,
        };
    }
}
exports.MyTokenM = MyTokenM;
//# sourceMappingURL=my_token_m.js.map