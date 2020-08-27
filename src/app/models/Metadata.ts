import { TimestampInterface } from './Common';

type CollectionType = 'group' | 'section' | 'subject' | 'entity' | 'user';

export interface MetadataInterface extends TimestampInterface {
    id: string;
    name: string;
    type: CollectionType;
    email?: string;
    phone?: string;
    description?: string;
    subscriptionStatus?: string;
    [key: string]: any;
}
