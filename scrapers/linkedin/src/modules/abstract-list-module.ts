import AbstractSubModule from './abstract-sub-module';
import { Page } from 'playwright-core';
import ListSelectors from '../selectors/list-selectors';
interface AbstractListModuleOptions {
  selectors: ListSelectors;
  baseURL: string;
  page: Page;
}

export default abstract class AbstractListModule<T> extends AbstractSubModule {
  protected readonly selectors: ListSelectors;

  protected constructor({ selectors, baseURL, page }: AbstractListModuleOptions) {
    super(page, baseURL);
    this.selectors = selectors;
  }

  public abstract items(): Promise<T[]>;

  protected abstract totalCount(): Promise<number>;

  public async init(): Promise<void> {
    if (this.page.url() !== this.baseURL) {
      await this.page.goto(this.baseURL);
    }
  }


}

