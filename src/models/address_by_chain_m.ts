import { ENetwork } from '../utils/enums';

export class AddressByChainM {
  eNetwork: ENetwork;
  // eCovalenthqNetwork: ECovalenthqNetwork;
  address: string;

  constructor({
    eNetwork,
    // eCovalenthqNetwork,
    address,
  }: {
    eNetwork: ENetwork;
    // eCovalenthqNetwork: ECovalenthqNetwork;
    address: string;
  }) {
    this.eNetwork = eNetwork;
    // this.eCovalenthqNetwork = eCovalenthqNetwork;
    this.address = address;
  }

  copyWith({
    eNetwork,
    // eCovalenthqNetwork,
    address,
  }: {
    eNetwork?: ENetwork;
    // eCovalenthqNetwork?: ECovalenthqNetwork;
    address?: string;
  }) {
    return new AddressByChainM({
      eNetwork: eNetwork ?? this.eNetwork,
      // eCovalenthqNetwork: eCovalenthqNetwork ?? this.eCovalenthqNetwork,
      address: address ?? this.address,
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
