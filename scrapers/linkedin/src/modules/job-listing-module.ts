import AbstractSubModule from "./abstract-sub-module";
import {Page} from "playwright-core";
import {logger} from "../utils/logger";

const BASE_URL = "https://www.linkedin.com/jobs/collections";
const JOB_ANNOUNCEMENT_LIST_SELECTOR = "//ul[contains(@class,'scaffold-layout__list-container')]";
const JOB_ANNOUNCEMENT_CONTAINER_SELECTOR = "//div[contains(@class, 'jobs-search-results-list')]";
const JOB_ANNOUNCEMENT_PAGINATION_SELECTOR = "//ul[contains(@class,'artdeco-pagination__pages')]";
const JOB_ANNOUNCEMENT_LIST_ITEM_SELECTOR = "//li[contains(@class, 'jobs-search-results__list-item')]";
const JOB_ANNOUNCEMENT_PAGINATION_ITEM_SELECTOR = "//li[contains(@class, 'artdeco-pagination__indicator')]"
// TODO: Add an abstraction layer AbstractJobListingModule
export default class JobListingModule extends AbstractSubModule{

    constructor(page: Page) {
        super(page, BASE_URL);
    }

    async getJobIds() {

        await this.page.waitForSelector(JOB_ANNOUNCEMENT_LIST_SELECTOR);
        await this.page.waitForSelector(JOB_ANNOUNCEMENT_CONTAINER_SELECTOR);


        logger.info("Job announcements list appeared on the page");
        logger.debug("HELLO WORLD!!")
        const jobAnnouncementsContainerElement = await this.page.$(JOB_ANNOUNCEMENT_CONTAINER_SELECTOR);
        if (jobAnnouncementsContainerElement === undefined) {
            logger.error("Job announcement container is undefined");
            return;
        }
        const jobAnnouncementListElement  = await this.page.$(JOB_ANNOUNCEMENT_LIST_SELECTOR);
        if (jobAnnouncementListElement === undefined) {
            logger.error('Job announcement list is undefined');
            return;
        }

        while(!(await this.helpers.isElementPresent(JOB_ANNOUNCEMENT_PAGINATION_SELECTOR))) {
            logger.debug("Element is not completely scrolled");
            await this.helpers.scrollElement(jobAnnouncementsContainerElement!);
            logger.debug("Element scrolled");
        }
        logger.debug('Pagination element is present');
        const jobAnnouncementPaginationContainer = await this.page.$(JOB_ANNOUNCEMENT_PAGINATION_SELECTOR);
        if (jobAnnouncementPaginationContainer === undefined) {
            logger.error('Pagination element is undefined');
            return;
        }
        logger.info('Pagination element is present');
        // TODO: Get all ids once all jobs are scrolled
        const jobAnnouncementListItems = await jobAnnouncementListElement!.$$(JOB_ANNOUNCEMENT_LIST_ITEM_SELECTOR);
        /**
         TODO: Get details of each job announcement item. Details to get:
         - job title
         - company name
         - location
         - easy apply or not
         - is promoted
         */
        const paginationItems = await jobAnnouncementPaginationContainer!.$$(JOB_ANNOUNCEMENT_PAGINATION_ITEM_SELECTOR);
        const lastPageNumber = await paginationItems!.at(-1)!.textContent()
        logger.debug(`Last page number ${lastPageNumber?.trim()}`);
        logger.debug(`Found ${jobAnnouncementListItems.length} job announcements`);
    }

    async init() {
        // TODO: Use URL factory once there's more parameters
        if (this.page.url().startsWith(BASE_URL)) {
            logger.debug("Currently on job listing page");
            return;
        }
        await this.page.goto(BASE_URL);
        logger.debug("Navigated to the job listing URL");
    }

}
