import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface ConsoleNav {
    text: string;
    icon: IconDefinition;
    link?: string;
    function?: () => void;
}

export interface Url {
    label: string;
    url: string;
}
