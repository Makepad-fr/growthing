import Company from './company';
import Role from './role';

export default interface Experience {
  company: Company;
  roles: Role[];
  totalDuration: string;
  location: String;
}
