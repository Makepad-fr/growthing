import { User } from './user';

export interface Skill {
  name: string;
  endorsements: User[];
  hasLinkedInAssesmentBadge: boolean;
  numberOfEndorsements: number;
}
