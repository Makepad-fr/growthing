import { Page } from 'playwright-core';
import BrowserHelpers from '../helpers/browser-helpers';

export default abstract class AbstractSubModule {
  protected readonly baseURL: string;

  protected page: Page;

  protected readonly helpers: BrowserHelpers;

  protected constructor(page: Page, baseURL: string) {
    this.page = page;
    this.helpers = new BrowserHelpers(this.page);
    this.baseURL = baseURL;
  }

  protected async close() {
    await this.page.close();
  }

  public abstract init(): Promise<void>;
}
