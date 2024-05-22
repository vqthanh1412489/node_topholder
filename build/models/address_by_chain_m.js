"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressByChainM = void 0;
class AddressByChainM {
    constructor({ eNetwork, 
    // eCovalenthqNetwork,
    address, }) {
        this.eNetwork = eNetwork;
        // this.eCovalenthqNetwork = eCovalenthqNetwork;
        this.address = address;
    }
    copyWith({ eNetwork, 
    // eCovalenthqNetwork,
    address, }) {
        return new AddressByChainM({
            eNetwork: eNetwork !== null && eNetwork !== void 0 ? eNetwork : this.eNetwork,
            // eCovalenthqNetwork: eCovalenthqNetwork ?? this.eCovalenthqNetwork,
            address: address !== null && address !== void 0 ? address : this.address,
        });
    }
    toJson() {
        return {
            eNetwork: this.eNetwork,
            // eCovalenthqNetwork: this.eCovalenthqNetwork,
            address: this.address,
        };
    }
}
exports.AddressByChainM = AddressByChainM;
//# sourceMappingURL=address_by_chain_m.js.map