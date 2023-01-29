import School from './school';

export default interface Education {
  school: School;
  fieldOfStudy: string;
  degree: string;
  description: string;
  activitiesAndSocieties: string;
  date: {
    start: number;
    end: number;
  };
}
