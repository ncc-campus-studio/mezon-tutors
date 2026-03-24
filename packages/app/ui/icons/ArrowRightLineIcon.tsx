import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

export const ArrowRightLineIcon = ({ size, width, height, color, ...props }: IconProps) => (
  <Svg
    width={width ?? size ?? 14}
    height={height ?? size ?? 14}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path
      d="M6 12h12M13 7l5 5-5 5"
      stroke={color ?? 'currentColor'}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
