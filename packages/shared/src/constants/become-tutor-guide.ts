export const GUIDE_STEPS = [
  {
    id: 'sign_up_step',
    number: '01',
    titleKey: 'steps.signUp.title',
    descriptionKey: 'steps.signUp.description',
  },
  {
    id: 'get_approved_step',
    number: '02',
    titleKey: 'steps.getApproved.title',
    descriptionKey: 'steps.getApproved.description',
  },
  {
    id: 'start_earning_step',
    number: '03',
    titleKey: 'steps.startEarning.title',
    descriptionKey: 'steps.startEarning.description',
  },
] as const;

export const GUIDE_HIGHLIGHTS = [
  {
    id: 'set_rate_highlight',
    iconKey: 'setOwnRate',
    titleKey: 'highlights.setOwnRate.title',
    descriptionKey: 'highlights.setOwnRate.description',
    tagKey: 'highlights.setOwnRate.tag',
  },
  {
    id: 'teach_anytime_highlight',
    iconKey: 'teachAnytime',
    titleKey: 'highlights.teachAnytime.title',
    descriptionKey: 'highlights.teachAnytime.description',
    tagKey: 'highlights.teachAnytime.tag',
  },
  {
    id: 'grow_professionally_highlight',
    iconKey: 'growProfessionally',
    titleKey: 'highlights.growProfessionally.title',
    descriptionKey: 'highlights.growProfessionally.description',
    tagKey: 'highlights.growProfessionally.tag',
  },
] as const;

export type GuideStep = (typeof GUIDE_STEPS)[number];
export type GuideHighlight = (typeof GUIDE_HIGHLIGHTS)[number];
export type GuideHighlightIconKey = GuideHighlight['iconKey'];
