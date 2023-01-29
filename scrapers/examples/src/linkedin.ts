import LinkedInJS from '@makepad/linkedinjs';

const LINKEDIN_USERNAME = process.env['LINKEDIN_USERNAME'];
const LINKEDIN_PASSWORD = process.env['LINKEDIN_PASSWORD'];

async function main() {

    if (LINKEDIN_USERNAME !== undefined && LINKEDIN_PASSWORD !== undefined) {
        const scraper = await LinkedInJS.init({
            browser: 'firefox',
            launchOptions: {
                headless: false
            },
            contextOptions: undefined,
            authenticatedContextPath: './cookies.json',
            disableAssets: true
        });

        await scraper.login(LINKEDIN_USERNAME, LINKEDIN_PASSWORD)
    } {
        console.error('Environment variables LINKEDIN_USERNAME and LINKEDIN_PASSWORD are required');
    }
}

main().then();
