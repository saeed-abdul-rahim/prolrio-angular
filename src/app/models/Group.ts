import { CommonInterface } from './Common';

export interface GroupInterface extends CommonInterface {
    groupId: string;
    groupName: string;
    sudo: string;
    sectionId: Array<string>;
    subjectId: Array<string>;
    accredited: string;
    city: string;
    fullLocation: string;
    sinceDate: number;
    requests: Array<string>;
    blacklist: Array<string>;
    tierId: string;
    subscriptionStatus: string;
}
