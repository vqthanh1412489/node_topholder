export interface ArkhamAddressInfoM {
    address?: string;
    chain?: string;
    arkhamEntity?: Entity;
    arkhamLabel?: ArkhamLabel;
    predictedEntity?: Entity;
    contract?: boolean;
    populatedTags?: PopulatedTag[];
}

interface Entity {
    name?: string;
    note?: string;
    id?: string;
    type?: string;
    populatedTags?: PopulatedTag[];
}

interface PopulatedTag {
    id?: string;
    label?: string;
    rank?: number;
    chain?: string;
}

interface ArkhamLabel {
    name?: string;
    address?: string;
    chainType?: string;
}





























































