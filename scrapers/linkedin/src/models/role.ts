import DateInterval from './date-interval';

export default interface Role {
  name: string;
  contractType: string;
  duration: string;
  timeInterval: DateInterval;
  location: string;
  description: string;
}
