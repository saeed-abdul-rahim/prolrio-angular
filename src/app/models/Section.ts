import { CommonInterface } from './Common';

export interface SectionInterface extends CommonInterface {
    groupId?: string;
    sectionId?: string;
    parentId?: string;
    childIds?: Array<string>;
    sectionName?: string;
    subjectId?: Array<string>;
}
