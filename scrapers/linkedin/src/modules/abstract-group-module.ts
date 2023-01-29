import AbstractSubModule from './abstract-sub-module';
import URLFactory from '../utils/url-factory';
import { Logger } from '../utils/logger';
import { Page } from 'playwright-core';
import GroupSelectors from '../selectors/group-selectors';
import UserProfile from '../models/user-profile';
import Post from "../models/post";

interface AbstractGroupModuleOptions {
  selectors: GroupSelectors;
  baseURL: string;
  id: string;
  page: Page;
}
export default abstract class AbstractGroupModule extends AbstractSubModule {
  readonly id: string;
  protected readonly urlFactory: URLFactory;
  private static logger: Logger = new Logger('AbstractGroupModule');
  protected readonly selectors: GroupSelectors;

  protected constructor({ selectors, baseURL, id, page }: AbstractGroupModuleOptions) {
    super(page, baseURL);
    this.id = id;
    this.selectors = selectors;
    this.urlFactory = new URLFactory(baseURL);
  }

  public async init() {
    console.log('HELLO WORLD FROM INIT FUNCTION');
    AbstractGroupModule.logger.log('Init function called');
    const u: string = this.urlFactory.get(this.id);
    AbstractGroupModule.logger.log(`URL: ${u}`);
    if (this.page.url() === u) {
      return;
    }
    AbstractGroupModule.logger.log('Navigating to url');
    await this.page.goto(u);
    AbstractGroupModule.logger.log('Navigated to the group page');
  }

  /**
   * Get the name of the group
   * @return A promise containing the name of the group if exists, null if not
   */
  public async name(): Promise<string | null> {
    return this.page.textContent(this.selectors.name);
  }

  /**
   * Get members of the group
   * @return A promise contains the list of members of the group
   */
  public abstract members(): Promise<UserProfile[]>;
  public abstract posts(): Promise<Post[]>;

  /**
   *
   */
  /*  public async posts(): Promise<IterableIterator<GroupPost>> {
        await this.init()
        await this.page.waitForSelector(this.selectors.groupName);

    }*/
  //TODO: Get posts (finish it with yield not return)
  //TODO: Get group members
}
