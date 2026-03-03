import { themes } from './../theme/theme';
import { tokens } from './../theme/token';
import { defaultConfig } from '@tamagui/config/v4';
import { createTamagui } from 'tamagui';
import { bodyFont, headingFont } from './fonts';
import { animations } from './animations';

const shorthands = {
  ai: 'alignItems',
  jc: 'justifyContent',
  f: 'flex',
  w: 'width',
  h: 'height',
  p: 'padding',
  px: 'paddingHorizontal',
  py: 'paddingVertical',
  pt: 'paddingTop',
  pb: 'paddingBottom',
  pl: 'paddingLeft',
  pr: 'paddingRight',
  m: 'margin',
  mx: 'marginHorizontal',
  my: 'marginVertical',
  mt: 'marginTop',
  mb: 'marginBottom',
  ml: 'marginLeft',
  mr: 'marginRight',
  bg: 'backgroundColor',
  bc: 'backgroundColor',
  zi: 'zIndex',
  br: 'borderRadius',
  bw: 'borderWidth',
  bs: 'borderStyle',
  ov: 'overflow',
} as const;

export const config = createTamagui({
  ...defaultConfig,
  shorthands,
  animations,
  fonts: {
    body: bodyFont,
    heading: headingFont,
  },
  tokens,
  media: {
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  },
  settings: {
    ...defaultConfig.settings,
    onlyAllowShorthands: false,
  },
  themes,
});
