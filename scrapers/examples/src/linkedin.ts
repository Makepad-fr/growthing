import LinkedInJS from '@makepad/linkedinjs';

const LINKEDIN_USERNAME = process.env['LINKEDIN_USERNAME'];
const LINKEDIN_PASSWORD = process.env['LINKEDIN_PASSWORD'];
const AUTHENTICATION_CONTEXT_PATH = "./cookies.json";

async function main() {


    const scraper = await LinkedInJS.init({
        browser: 'firefox',
        launchOptions: {
            headless: false
        },
        contextOptions: undefined,
        authenticatedContextPath: AUTHENTICATION_CONTEXT_PATH,
        disableAssets: true
    });
    if (!scraper.loadedFromExistingAuthenticationContext) {
        // If browser is not loaded the existing authentication context need to login manually
        if (LINKEDIN_USERNAME !== undefined && LINKEDIN_PASSWORD !== undefined) {

            await scraper.login(LINKEDIN_USERNAME, LINKEDIN_PASSWORD)
            return;
        }
        console.error('Environment variables LINKEDIN_USERNAME and LINKEDIN_PASSWORD are required');
    }
}

main().then();
