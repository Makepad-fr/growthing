/* eslint-disable max-len */
export default {
  login: {
    username: '//*[@id="session_key"]',
    password: '//*[@id="session_password"]',
    submit: '//button[contains(@class,"sign-in-form__submit-button")]',
  },
  user: {
    profile: {
      base: {
        fullName: "//div[contains(@class,'pv-text-details__left-panel')][1]/div[1]/h1",
        shortDesc: "//div[contains(@class,'pv-text-details__left-panel')][1]/div[2]",
        location: "//div[contains(@class,'pv-text-details__left-panel')][2]/span[1]",
        info: "//section[contains(@class,'pv-about-section')]/div",
        infoTextToDelete: "//section[contains(@class,'pv-about-section')]/div/span",
        premiumBadge: "//span[contains(@class, 'pv-member-badge')]/li-icon[@type='linkedin-bug']",
        influencerBadge: "//li-icon[@type='linkedin-influencer-color-icon']",
      },
      experience: {
        item: "//li[contains(@class,'pv-entity__position-group-role-item')]",
        group: "//section[@id='experience-section']//li[contains(@class,'pv-entity__position-group-pager')]",
        moreButton:
          "//section[@id='experience-section']//div[contains(@class,'pv-experience-section__see-more')]//li-icon[@type='chevron-down-icon']/parent::button",
        roleContainer: "//div[@class='pv-entity__role-container']",
        expandRoles:
          "//div[contains(@class,'pv-entity__paging')]//li-icon[@type='chevron-down-icon']/parent::button",
        groupTitle: "//div[contains(@class,'pv-entity__company-summary-info')]/h3/span[2]",
        groupSubTitle: "//div[contains(@class,'pv-entity__company-summary-info')]/h4/span[2]",
        roleName: "//div[contains(@class,'pv-entity__summary-info-v2')]/h3//span[2]",
        roleInfo: "//div[contains(@class,'pv-entity__summary-info-v2')]//h4//span[2]",
        contratType:
          "//div[contains(@class,'pv-entity__summary-info-v2')]/h3/following-sibling::h4[not(contains(@class,'pv-entity__location'))]",
        roleDescription:
          "//div[contains(@class,'pv-entity__extra-details')]/div[contains(@class,'inline-show-more-text')]",
        roleDescriptionMore: "/span[contains(@class,'inline-show-more-text__link-container-collapsed')]",
        summary: "//div[contains(@class,'pv-entity__summary-info')]",
        location: "//h4[contains(@class,'pv-entity__location')]/span[2]",
        description:
          "//div[contains(@class,'pv-entity__extra-details')]/div[contains(@class, 'inline-show-more-text')]",
        duration: '//h4[2]/span[2]',
        timeInterval: "//h4[contains(@class,'pv-entity__date-range')]/span[2]",
        companyName: '/p[2]',
      },
      education: {
        section: "//section[contains(@id,'education-section')]",
        elementsContainer: "/ul[contains(@class,'pv-profile-section__section-info')]",
        seeMoreButton:
          "//div[contains(@class,'pv-profile-section__actions-inline')]//li-icon[@type='chevron-down-icon']/parent::button",
        listItem: "//li[contains(@class,'pv-education-entity')]",
        schoolName: "//h3[contains(@class,'pv-entity__school-name')]",
        entitySecondaryTitle: "//p[contains(@class,'pv-entity__secondary-title')]",
        fieldName: "//p[contains(@class,'pv-entity__fos')]/span[2]",
        degreeName: "//p[contains(@class,'pv-entity__degree-name')]/span[2]",
        date: "//p[contains(@class,'pv-entity__dates')]//span[2]",
        description: "//p[contains(@class,'pv-entity__description')]/span[2]",
        activitiesAndSocieties: "//span[contains(@class,'activities-societies')]",
      },
      certifications: {
        section: "//section[contains(@class,'pv-profile-section--certifications-section')]",
        seeMore:
          "//div[contains(@class,'pv-profile-section__actions-inline')]//li-icon[@type='chevron-down-icon']/parent::button",
        item: "//li[contains(@class,'pv-certification-entity')]",
        companyURL: '//a',
        summary: "//div[contains(@class,'pv-certifications__summary-info')]",
        name: '//h3',
        companyName: '//p[1]/span[2]',
        dates: '//p[2]/span[2]',
        credential: {
          id: '//p[3]//span[2]',
          url: "//a[contains(@class,'pv-certifications-entity__credential-link')]",
        },
      },
      skills: {
        section: "//section[contains(@class, 'pv-skill-categories-section')]",
        item: "//div[contains(@class, 'pv-skill-category-entity__skill-wrapper')]",
        entityName: "//span[contains(@class, 'pv-skill-category-entity__name-text')]",
        itemDetailsLink: "//div/a[contains(@data-control-name, 'skills_endorsement_full_list')]",
        numberOfEndorsements: '/span[2]',
        assesmentBadge: "//div[contains(@class, 'pv-skill-entity__verified-icon')]",
        seeMore:
          "//button[contains(@class,' pv-skills-section__additional-skill')]//li-icon[@type='chevron-down-icon']/parent::button",
        enodorsements: {
          closeButton: "//button[contains(@aria-label, 'Dismiss')]",
          popup: "//div[contains(@class, 'pv-profile-detail__modal') and contains(@role,'dialog')]",
          entity: "//li[contains(@class, 'pv-endorsement-entity')]",
          entityName: "//span[contains(@class, 'pv-endorsement-entity__name--has-hover')]",
          entityLink: "//a[contains(@class, 'pv-endorsement-entity__link')]",
          listContainer: "//div[contains(@class, 'artdeco-modal__content')]",
        },
      },
    },
  },
};
