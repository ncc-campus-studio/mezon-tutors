export const HOME_STATS = [
  { key: 'students', value: '10,000+' },
  { key: 'tutors', value: '500+' },
  { key: 'languages', value: '50+' },
  { key: 'satisfaction', value: '98%' },
] as const;

export const HOME_FEATURES = [
  {
    id: 'evening-classes',
    iconKey: 'eveningClasses',
    titleKey: 'eveningClasses.title',
    descriptionKey: 'eveningClasses.description',
  },
  {
    id: 'flexible-weekends',
    iconKey: 'flexibleWeekends',
    titleKey: 'flexibleWeekends.title',
    descriptionKey: 'flexibleWeekends.description',
  },
  {
    id: 'learn-via-mezon',
    iconKey: 'learnViaMezon',
    titleKey: 'learnViaMezon.title',
    descriptionKey: 'learnViaMezon.description',
  },
] as const;

export type HomeFeatureItem = (typeof HOME_FEATURES)[number];
export type HomeFeatureIconKey = HomeFeatureItem['iconKey'];

export const HOME_FEATURE_ICON_COMPONENTS = {
  eveningClasses: 'FeatureEveningClassesIcon',
  flexibleWeekends: 'FeatureFlexibleWeekendsIcon',
  learnViaMezon: 'FeatureLearnViaMezonIcon',
} as const;

export const HOME_SEAMLESS_FEATURES = [
  {
    id: 'video-call',
    iconKey: 'virtualClassroom',
    titleKey: 'virtualClassroom.title',
    descriptionKey: 'virtualClassroom.description',
  },
  {
    id: 'messaging',
    iconKey: 'instantMessaging',
    titleKey: 'instantMessaging.title',
    descriptionKey: 'instantMessaging.description',
  },
] as const;

export type HomeSeamlessFeatureItem = (typeof HOME_SEAMLESS_FEATURES)[number];
export type HomeSeamlessIconKey = HomeSeamlessFeatureItem['iconKey'];

export const HOME_SEAMLESS_ICON_COMPONENTS = {
  virtualClassroom: 'SeamlessVirtualClassroomIcon',
  instantMessaging: 'SeamlessInstantMessagingIcon',
} as const;

export const HOME_BECOME_TUTOR_BENEFIT_KEYS = ['payment', 'tools', 'schedule'] as const;

export const HOME_HERO_CARD = {
  image: '/tutor.png',
  name: 'Nguyen Minh Anh, 24',
  description: 'IELTS 8.0 - Dedicated to busy learners',
  match: 95,
  rating: 4.9,
} as const;
