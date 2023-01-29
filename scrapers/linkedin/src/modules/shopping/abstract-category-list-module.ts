import AbstractSubModule from '../abstract-sub-module';
import { Page } from 'playwright-core';
import AbstractCategory from '../../models/abstract-category';

export default abstract class AbstractCategoryListModule extends AbstractSubModule {
  protected constructor(page: Page, baseURL: string) {
    super(page, baseURL);
  }

  public abstract getAll(): Promise<AbstractCategory[]>;
}
