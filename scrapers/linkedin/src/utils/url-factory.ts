export default class URLFactory {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public get(path: string): string {
    return encodeURI(`${this.baseUrl}/${path}`);
  }
}
