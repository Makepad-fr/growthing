import AbstractModule, {ModuleInitializationOptions, ModuleOptions} from "./modules/abstract-module";
import {RequireAuthentication} from "./modules/require-authentication";
import {isFileExists} from "./utils/file-utils";
import selectors from "./selectors";
import {saveBrowserContext} from "./helpers/browser-helpers";
import UserProfileModule from "./modules/user-profile-module";

export default class LinkedInJS extends AbstractModule implements RequireAuthentication {
    protected static override readonly BASE_URL = 'https://linkedin.com';

    /**
     * Creates a new instance of Linkedjs by initialising browser, browsercontext and page
     * @param browser The type of the browser to use
     * @param contextOptions Context options that will be used in browsercontext
     * @param launchOptions Launch options that will be used while launching browsers
     * @param authenticatedContextPath The path to load or save the authenticated browser context
     * @returns A new onstance of Linkedjs by initialising browser, browser context
     * and creating a new page
     */
    public static async init({
                                 browser = 'firefox',
                                 launchOptions = {},
                                 contextOptions = undefined,
                                 authenticatedContextPath,
                                 disableAssets = true,
                             }: ModuleInitializationOptions): Promise<LinkedInJS> {
        const options: ModuleOptions = await super.initOptions({
            browser,
            launchOptions,
            contextOptions,
            authenticatedContextPath,
            disableAssets,
        });
        console.log('Creating linkedin js instance');
        return new LinkedInJS(options);
    }

    /**
     * Login to your LinkedIn account with username and password
     * @param username The LinkedIn username to log in
     * @param password The password used to log in
     * @param rememberMe The boolean indicating that login credentials will be remembered next time.
     */
    public async login(username: string, password: string, rememberMe: boolean = true) {
        if (isFileExists(super.authenticatedContextPath)) {
            // If the authenticated context already exists, do nothing
            return;
        }
        console.log('Login function called');
        //await this.page.waitForSelector(selectors.login.username);
        await this.page.fill(selectors.login.username, username);
        await this.page.fill(selectors.login.password, password);
        await this.page.click(selectors.login.submit);
        if (rememberMe) {
            await saveBrowserContext(this.context, this.authenticatedContextPath);
        }
    }

    /**
     * Goes to the user's profile page and returns the UserProfile instance
     * @param id The id of the user
     * @param isolated If true the user profile will be created on a new page. Defaults to true
     * @returns The UserProfile object
     */
    public async user(id: string, isolated: boolean = true): Promise<UserProfileModule> {
        const u: UserProfileModule = new UserProfileModule(
            id,
            isolated ? await super.context.newPage() : super.page,
        );
        await u.init();
        return u;
    }

    private constructor({
                            browser, context, page, authenticatedContextPath, disableAssets,
                        }: ModuleOptions) {
        super({
            browser,
            context,
            page,
            authenticatedContextPath,
            disableAssets,
            loadedFromExistingBrowserContext: false
        });
    }
}
