export default interface Require2FA {
  checkFor2FA(): Promise<boolean>;
  complete2FA(code: string): Promise<void>;
}
