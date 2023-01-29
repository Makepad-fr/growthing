import Company from './company';
import Credential from './credential';
export default interface Certification {
  name: string;
  issuer: Company;
  issued: string;
  expiration: string;
  credential: Credential;
}
