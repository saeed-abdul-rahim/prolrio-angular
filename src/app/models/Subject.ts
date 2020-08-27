import { CommonInterface } from './Common';

export interface SubjectInterface extends CommonInterface {
    groupId?: string;
    sectionId?: string;
    subjectId?: string;
    subjectName?: string;
    entityId?: Array<string>;
}
