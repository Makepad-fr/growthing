import { Page, errors, ElementHandle } from 'playwright-core';
import Experience from '../models/experience';
import Role from '../models/role';
import selectors from '../selectors';
import DateInterval from '../models/date-interval';
import Education from '../models/education';
import School from '../models/school';
import Certification from '../models/certification';
import { Skill } from '../models/skill';
import { User } from '../models/user';
import AbstractUserProfileModule from "./abstract-user-profile-module";
import {splitDashes} from "../helpers/string-helpers";

type StringOrNotDefined = string | null | undefined;
type ElementHandlePromiseOrStringPromiseOrString =
  | Promise<ElementHandle<SVGElement | HTMLElement> | string | null | undefined>
  | StringOrNotDefined
  | ElementHandle<SVGElement | HTMLElement>;

export interface UserProfile {
  educations?: Education[];
  experiences?: Experience[];
  certificates?: Certification[];
  fullName?: string;
  shortDescription?: string;
  about?: string;
  location?: string;
  isPremium?: boolean;
  isInfluencer?: boolean;
  skills?: Skill[];
}

export default class UserProfileModule extends AbstractUserProfileModule {
  public constructor(id: string, page: Page) {
    super({ ...selectors.user.profile.base, bio: '' }, 'https://linkedin.com/in/', id, page);
  }

  /**
   * Returns the user's short description from the user's profile
   * @returns The user's short description
   */
  public async shortDescription(): Promise<string> {
    return super.getTextualContent(selectors.user.profile.base.shortDesc);
  }

  /**
   * Returns the user's location from the user's profile
   * @returns The user's location
   */
  public async location(): Promise<string> {
    return super.getTextualContent(selectors.user.profile.base.location);
  }

  /**
   * Get the user's about text from the user's profile
   * @returns The user about text from the user's profile
   */
  public override async bio(): Promise<string> {
    await this.init();

    try {
      const ri: string = (await this.page.textContent(selectors.user.profile.base.info)) as string;
      const id: string = (await this.page.textContent(
        selectors.user.profile.base.infoTextToDelete,
      )) as string;
      return (ri.substring(0, ri.lastIndexOf(id)) + ri.substring(ri.lastIndexOf(id) + id.length)).trim();
    } catch (e) {
      if (e instanceof errors.TimeoutError) {
        return '';
      }
      throw e;
    }
  }

  /**
   * Function checks if the user has premium badge or nor
   * @returns True if the user has premium badge false if not
   */
  public async isPremium(): Promise<boolean> {
    await this.init();
    try {
      await this.page.waitForSelector(selectors.user.profile.base.premiumBadge);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Function checks if the user has the influencer badge on his/her profile
   * @returns true if the user has influencer badge, false if not
   */
  public async isInfluencer(): Promise<boolean> {
    await this.init();
    try {
      await this.page.waitForSelector(selectors.user.profile.base.influencerBadge);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Get the list of experiences listed on the user profile
   * @returns User's work experiences array
   */
  public async experiences(): Promise<Experience[]> {
    await this.init();
    try {
      await this.helpers.scrollUntilElementAppears(selectors.user.profile.experience.group);
    } catch (e) {
      return [];
    }
    await this.helpers.clickUntilElementDissapears(selectors.user.profile.experience.moreButton);
    const experienceWE: ElementHandle<SVGElement | HTMLElement>[] = await this.page.$$(
      selectors.user.profile.experience.group,
    );
    return Promise.all(
      experienceWE.map(async (experienceItem) => {
        const companyURLLink: Promise<string> = this.helpers.getAttributeSafe('//a', 'href', experienceItem);
        const roleElements: Promise<ElementHandle<SVGElement | HTMLElement>[]> = experienceItem.$$(
          selectors.user.profile.experience.roleContainer,
        );
        await this.helpers.clickUntilElementDissapears(
          selectors.user.profile.experience.expandRoles,
          experienceItem,
        );
        return Promise.all([roleElements, companyURLLink]).then(([re, curl]) => {
          console.log(`Number of role elements ${re.length}`);
          if (re.length) {
            // If there's at least one role
            return this.getExperiencesWithMultipleRoles(experienceItem, re, curl);
          }
          return this.getExperienceWithSingleRole(experienceItem, companyURLLink);
        });
      }),
    );
  }

  /**
   * Returns the list of education elements on the user's profile
   * @returns An array containing all the educations elements of the user
   */
  public async education(): Promise<Education[]> {
    await this.init();
    try {
      await this.helpers.scrollUntilElementAppears(selectors.user.profile.education.section);
    } catch (e) {
      console.warn('The user has not education information on his/her profile');
      return [];
    }
    const educationSection = (await this.page.$(selectors.user.profile.education.section)) as ElementHandle;
    await this.helpers.clickUntilElementDissapears(
      selectors.user.profile.education.seeMoreButton,
      educationSection,
    );
    // Use then instead
    return this.page.$$(selectors.user.profile.education.listItem).then((educationListItems) => Promise.all(
      educationListItems.map((educationListItem) => Promise.all([
        this.helpers.safeTextContent(selectors.user.profile.education.schoolName, educationListItem),
        this.helpers.getAttributeSafe('//a', 'href', educationListItem),
        this.helpers.safeTextContent(selectors.user.profile.education.date, educationListItem),
        this.helpers.safeTextContent(selectors.user.profile.education.fieldName, educationListItem),
        this.helpers.safeTextContent(selectors.user.profile.education.degreeName, educationListItem),
        this.helpers.safeTextContent(selectors.user.profile.education.description, educationListItem),
        this.helpers.safeTextContent(
          selectors.user.profile.education.activitiesAndSocieties,
          educationListItem,
        ),
      ]).then(
        ([
          schoolName,
          schoolURL,
          dateInterval,
          fieldOfStudy,
          degree,
          description,
          activitiesAndSocieties,
        ]) => {
          const school: School = {
            name: schoolName,
            url: schoolURL,
          };
          const di: string[] = splitDashes(dateInterval);
          return <Education>{
            school,
            fieldOfStudy,
            degree,
            description,
            activitiesAndSocieties,
            date: {
              start: parseInt(di[0] ?? '-1', 10),
              end: di.length > 1 ? parseInt(di[1]!, 10) : parseInt(di[0] ?? '-1', 10),
            },
          };
        },
      )),
    ));
  }

  /**
   * Function get the certification items from the user's profile
   * @returns The list of the certification items from user's profile
   */
  public async certifications(): Promise<Certification[]> {
    await this.init();
    try {
      await this.helpers.scrollUntilElementAppears(selectors.user.profile.certifications.section);
    } catch (e) {
      console.warn('User has no experience section on his/her profile');
      return [];
    }
    const section: ElementHandle = (await this.page.$(
      selectors.user.profile.certifications.section,
    )) as ElementHandle;
    await this.helpers.clickUntilElementDissapears(selectors.user.profile.certifications.seeMore, section);
    await this.page.waitForTimeout(5000);
    return section.$$(selectors.user.profile.certifications.item).then((certificationItems) => Promise.all(
      certificationItems.map((certificationItem) => Promise.all([
        this.helpers.getAttributeSafe(
          selectors.user.profile.certifications.companyURL,
          'href',
          certificationItem,
        ),
        this.helpers.safeTextContent(
          selectors.user.profile.certifications.companyName,
          certificationItem,
        ),
        this.helpers.safeTextContent(selectors.user.profile.certifications.name, certificationItem),
        this.helpers.safeTextContent(selectors.user.profile.certifications.dates, certificationItem),
        this.helpers.safeTextContent(
          selectors.user.profile.certifications.credential.id,
          certificationItem,
        ),
        this.helpers.getAttributeSafe(
          selectors.user.profile.certifications.credential.url,
          'href',
          certificationItem,
        ),
        // TODO: Complete with others
      ]).then(([companyUrl, companyName, certificateName, dates, credentialId, credentialURL]) => {
        /*
            TODO: Find a way to handle texts for other languages
            (ideally it should be language free matching)
           */
        const matchResult: RegExpMatchArray | null = dates.match(
          /issued\s*([^\d]*\s+[0-9]+)\s*(no)? expiration date\s*([^\d]*\s+[0-9]+)?/i,
        );
        const parsedDate: { issued: string; expiration: string } = {
          issued: '',
          expiration: '',
        };
        if (matchResult !== undefined && matchResult !== null) {
          console.log(`dates ${dates}. Math result length ${matchResult.length}`);
          parsedDate.issued = matchResult[1]!;
          console.log(`First match ${matchResult[1]}`);
          // If the second match is not undefined then the third match will be undefined
          parsedDate.expiration = matchResult[2] ? matchResult[3] ?? 'N/A' : 'N/A';
          console.log(`Second match match ${matchResult[2]}`);
          console.log(`Third match match ${matchResult[3]}`);
        }
        return <Certification>{
          name: certificateName.trim(),
          issuer: {
            name: companyName.trim(),
            linkedInURL: companyUrl.trim(),
          },
          // FIXME: Credentials not working check WHY?
          credential: {
            id: credentialId.replace(/\s*credential\s+id\s*/i, '').trim(),
            url: credentialURL.trim(),
          },
          // FIXME: We can not parse dates with dashes check WHY?
          issued: parsedDate.issued,
          expiration: parsedDate.expiration,
        };
      })),
    ));
  }

  /**
   * Get the skills and endorsements of the current user
   * @param detailed A boolean indicating that the result should contains the list
   * of users endorsed the current user's skill or just the number of endorsements
   * @returns An array of user skills and endorsements
   */
  public async skills(detailed: boolean = true): Promise<Skill[]> {
    await this.init();
    try {
      await this.helpers.scrollUntilElementAppears(selectors.user.profile.skills.section);
    } catch (e) {
      console.warn('User has no skills section');
      return [];
    }
    const section: ElementHandle = (await this.page.$(
      selectors.user.profile.skills.section,
    )) as ElementHandle;
    await this.helpers.clickUntilElementDissapears(selectors.user.profile.skills.seeMore, section);
    await this.page.waitForTimeout(5000);

    const skillItems = await this.page.$$(
      `${selectors.user.profile.skills.section}${selectors.user.profile.skills.item}`,
    );

    const result: Skill[] = [];
    console.log('HERE');

    // eslint-disable-next-line
    for (const skillItem of skillItems) {
      const [skillName, hasLinkedInAssesmentBadge, numberOfEndorsements] = [
        this.helpers.safeTextContent(selectors.user.profile.skills.entityName, skillItem),
        this.helpers.isElementPresent(selectors.user.profile.skills.assesmentBadge, skillItem),
        this.helpers.safeTextContent(
          `${selectors.user.profile.skills.itemDetailsLink}`
            + `${selectors.user.profile.skills.numberOfEndorsements}`,
          skillItem,
        ),
      ];
      // TODO: Complete the getEndorsementsFromPopup function to get the complete list of endorsements
      const nbe = parseInt(await numberOfEndorsements, 10);
      const endorsers: User[] = detailed
        ? await this.getEndorsementsFromPopup(
          await skillItem.$(selectors.user.profile.skills.itemDetailsLink),
        )
        : [];
      result.push(<Skill>{
        endorsements: endorsers,
        name: (await skillName).trim(),
        hasLinkedInAssesmentBadge: await hasLinkedInAssesmentBadge,
        numberOfEndorsements: nbe,
      });
    }
    return result;
  }

  /**
   * Get the list of users endorsed the current user for the given skill
   * @param element The link element redirects the endorsers list
   * @returns An array of Users who endorsed the current user
   */
  public async getEndorsementsFromPopup(
    element: ElementHandle<SVGElement | HTMLElement> | null,
  ): Promise<User[]> {
    await element?.click();
    await this.page.waitForSelector(selectors.user.profile.skills.enodorsements.popup);
    console.log('Pop-up appeared');
    const popupContainer = await this.page.$(selectors.user.profile.skills.enodorsements.popup);
    const listContainer = await popupContainer?.waitForSelector(
      selectors.user.profile.skills.enodorsements.listContainer,
    );
    let elementScrollCompleted: boolean = await this.helpers.elementCompletelyScrolled(listContainer!);
    // eslint-disable-next-line
    while (!elementScrollCompleted) {
      await this.helpers.scrollElement(listContainer!);
      await this.page.waitForTimeout(Math.random() * 5000 + 5000);
      elementScrollCompleted = await this.helpers.elementCompletelyScrolled(listContainer!);
    }
    const endorsers = await listContainer!.$$(selectors.user.profile.skills.enodorsements.entity);
    const users = await Promise.all(
      endorsers.map(
        async (endorser) => <User>{
          name: await this.helpers.safeTextContent(
            selectors.user.profile.skills.enodorsements.entityName,
            endorser,
          ),
          username: (
            await this.helpers.getAttributeSafe(
              selectors.user.profile.skills.enodorsements.entityLink,
              'href',
              endorser,
            )
          ).replace(/^\/in\/([^/]+)\/$/, '$1'),
        },
      ),
    );
    await (await popupContainer?.$(selectors.user.profile.skills.enodorsements.closeButton))?.click();
    // Return the set
    return users;
  }

  /**
   * Function returns work experience with multiple roles
   * @param experienceItem The element handle related to the work experience
   * @param roleElements Array of ElementHandle contains roleElements
   * @param roleContainer Selector for the role container
   * @param companyInternalURL URL of the company
   * @returns The Experience object with multiple roles
   */
  private getExperiencesWithMultipleRoles(
    experienceItem: ElementHandle,
    roleElements: ElementHandle<SVGElement | HTMLElement>[],
    companyInternalURL: string,
  ): Promise<Experience> {
    return Promise.all<Experience | Role | string | undefined>([
      this.helpers.safeTextContent(selectors.user.profile.experience.groupTitle, experienceItem),
      this.helpers.safeTextContent(selectors.user.profile.experience.groupSubTitle, experienceItem),
      ...roleElements.map(async (roleElement) => {
        const roleName: ElementHandlePromiseOrStringPromiseOrString = roleElement
          .$(selectors.user.profile.experience.roleName)
          .then((e) => e?.textContent());
        let roleInfo:
        | Promise<ElementHandle<SVGElement | HTMLElement>[]>
        | ElementHandle<SVGElement | HTMLElement>[] = roleElement.$$(
          selectors.user.profile.experience.roleInfo,
        );
        const contractType: ElementHandlePromiseOrStringPromiseOrString = this.helpers.safeTextContent(
          selectors.user.profile.experience.contratType,
          roleElement,
        );
        roleInfo = await roleInfo;
        const roleLocation: ElementHandlePromiseOrStringPromiseOrString = roleInfo.length > 2 ? roleInfo[2]!.textContent() : '';
        const ti: string[] = splitDashes((await roleInfo[0]!.textContent()) ?? '');
        return Promise.all([
          roleName,
          contractType,
          roleLocation,
          roleInfo[1]!.textContent(),
          this.helpers.filteredTextContent(
            selectors.user.profile.experience.roleDescription,
            selectors.user.profile.experience.roleDescriptionMore,
            roleElement,
          ),
        ]).then(
          ([rn, ct, rl, duration, description]) => <Role>{
            name: (rn as StringOrNotDefined) ?? '',
            location: (rl as StringOrNotDefined) ?? '',
            description: description ?? '',
            duration: (duration ?? '').trim(),
            timeInterval: {
              start: (ti[0] ?? '').trim(),
              end: ((ti.length !== 2 ? ti[0] : ti[1]) ?? '').trim(),
            },
            contractType: (ct as StringOrNotDefined) ?? '',
          },
        );
      }),
    ]).then(
      ([companyName, totalDuration, ...roles]) => <Experience>{
        company: {
          linkedInURL: companyInternalURL ?? '',
          name: companyName,
        },
        roles,
        location: '',
        totalDuration,
      },
    );
  }

  /**
   * Returns an experience object with single role
   * @param experienceItem The element handle related to the experience
   * @param companyURL Company's internal URL
   * @returns The experience object with single role
   */
  private getExperienceWithSingleRole(
    experienceItem: ElementHandle,
    companyURL: Promise<string>,
  ): Promise<Experience> {
    const companyName: string = `${selectors.user.profile.experience.summary}${selectors.user.profile.experience.companyName}`;
    const roleName: string = `${selectors.user.profile.experience.summary}//h3`;
    const timeInterval: string = `${selectors.user.profile.experience.summary}${selectors.user.profile.experience.timeInterval}`;
    const location: string = `${selectors.user.profile.experience.summary}${selectors.user.profile.experience.location}`;
    const duration: string = `${selectors.user.profile.experience.summary}${selectors.user.profile.experience.duration}`;
    const description: string = `${selectors.user.profile.experience.description}`;
    return Promise.all([
      this.helpers.safeTextContent(companyName, experienceItem),
      this.helpers.safeTextContent(timeInterval, experienceItem),
      this.helpers.safeTextContent(location, experienceItem),
      this.helpers.safeTextContent(duration, experienceItem),
      this.helpers.safeTextContent(description, experienceItem),
      this.helpers.safeTextContent(roleName, experienceItem),
      companyURL,
    ]).then(([cn, tInterval, loc, dur, desc, rn, url]) => {
      const parsedCompanyName: string[] = cn
        .split('\n')
        .filter((e) => e.length !== 0)
        .map((e) => e.trim());
      const contractType = parsedCompanyName[1] ?? '';
      const splittedTimeInterval: string[] = splitDashes(tInterval);
      const dateInterval: DateInterval = {
        start: splittedTimeInterval[0]!.trim(),
        end: (splittedTimeInterval.length === 2 ? splittedTimeInterval[1] : splittedTimeInterval[0])!.trim(),
      };
      return {
        company: {
          name: parsedCompanyName[0]!,
          linkedInURL: url,
        },
        location: loc,
        roles: [
          {
            description: desc,
            duration: dur,
            location: loc,
            name: rn,
            timeInterval: dateInterval,
            contractType,
          },
        ],
        totalDuration: dur,
      };
    });
  }
}
