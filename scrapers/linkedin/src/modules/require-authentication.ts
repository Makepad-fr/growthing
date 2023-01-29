export interface RequireAuthentication {
  login(username: string, password: string, rememberMe: boolean): Promise<void>;
}
