import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

export const GrowthOutlineIcon = ({ size, width, height, color, ...props }: IconProps) => (
  <Svg
    width={width ?? size ?? 22}
    height={height ?? size ?? 22}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path
      d="M5 16.5l4.5-4.5 3 3L19 8.5M14 8.5h5v5"
      stroke={color ?? 'currentColor'}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
