import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

export const LogoutIcon = ({ size, width, height, color, ...props }: IconProps) => (
  <Svg
    width={width ?? size ?? 16}
    height={height ?? size ?? 16}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path
      d="M10 4H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3"
      stroke={color ?? 'currentColor'}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14 8l4 4-4 4"
      stroke={color ?? 'currentColor'}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 12h9"
      stroke={color ?? 'currentColor'}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
