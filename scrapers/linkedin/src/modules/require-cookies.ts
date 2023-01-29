export default interface RequireCookies {
  get #bypassCookies(): boolean;

  /**
   * Function handles cookies
   * @param action The action for the cookies
   */
  handleCookies(action: CookieAction): Promise<void>;
}

export type CookieAction = 'accept' | 'reject' | 'accept-essentials-only';
