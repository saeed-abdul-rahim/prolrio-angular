import { CommonInterface } from './Common';

export type ContentType = 'video' | 'image' | 'document' | '';

export interface EntityInterface extends CommonInterface {
    id?: string;
    entityId?: string;
    subjectId?: string;
    subjectName?: string;
    author?: string;
    divider?: boolean;
    seenBy?: Array<string>;
    rating?: number;
    title?: string;
    description?: string;
    contentName?: string;
    contentUrl?: string;
    contentType?: ContentType;
    contentSize?: number;
    thumbnailName?: string;
    thumbnailImageUrl?: string;
    otherUrls?: Array<string>;
    order?: number;
}
