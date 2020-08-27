import { Role } from './Common';

export type Usage = {
    ids?: string[];
    usersNotViewed?: string[];
    usersNotDownloaded?: string[];
    usersNotWatched?: string[];
    lastSeenId?: string;
    lastOpenedTime?: number;
};

export type UsageRole = {
    [key in Role]?: Usage;
};
