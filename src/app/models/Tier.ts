import { TimestampInterface } from './Common';

type Limit = {
    priceId?: string
    allowed?: number
    amount?: number
};

type Amount = {
    month?: number
    year?: number
};

export interface TierInterface extends TimestampInterface {
    tierId?: string;
    productId?: string;
    name?: string;
    user?: Limit;
    group?: Limit;
    section?: Limit;
    subject?: Limit;
    entity?: Limit;
    storage?: Limit;
    amount?: Amount;
    duration?: number;
}
