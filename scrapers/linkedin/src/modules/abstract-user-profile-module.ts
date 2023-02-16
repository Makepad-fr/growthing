import { Page } from 'playwright-core';
import AbstractSubModule from './abstract-sub-module';
import UserProfileSelectors from '../selectors/user-profile-selectors';
import URLFactory from '../utils/url-factory';
import {logger} from "../utils/logger";

export default abstract class AbstractUserProfileModule extends AbstractSubModule {
  private readonly id: string;
  protected readonly urlFactory: URLFactory;
  private readonly selectors: UserProfileSelectors;
  protected constructor(selectors: UserProfileSelectors, baseURL: string, id: string, page: Page) {
    super(page, baseURL);
    this.id = id;
    this.selectors = selectors;
    this.urlFactory = new URLFactory(baseURL);
  }

  public async init() {
    const u: string = this.urlFactory.get(this.id);
    if (this.page.url() == u) {
      return;
    }
    await this.page.goto(u);
    logger.debug('Navigated to the user profile page');
  }

  /**
   * Returns the fullname of the user
   * @returns The full name of the user
   */
  public async fullName(): Promise<string> {
    return this.getTextualContent(this.selectors.fullName);
  }

  /**
   * Returns the bio of the current user
   * @returns The bio of the current user
   */
  public async bio(): Promise<string> {
    return this.getTextualContent(this.selectors.bio);
  }

  /**
   * Returns the text content of the given selector
   * @param selector The selector the get text content of
   * @returns The text cotnent of the given selector
   */
  protected async getTextualContent(selector: string): Promise<string> {
    await this.init();
    return this.page.textContent(selector) as Promise<string>;
  }
}
