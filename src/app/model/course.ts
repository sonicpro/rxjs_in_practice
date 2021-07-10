import { Moment } from 'moment';


export interface Course {
    id: number;
    description: string;
    iconUrl: string;
    courseListIcon: string;
    longDescription: string;
    category: string;
    lessonsCount: number;
    releasedAt: Moment;
}
