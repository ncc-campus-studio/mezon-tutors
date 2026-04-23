import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

export const AfternoonIcon = ({ size, width, height, color, ...props }: IconProps) => {
  return (
    <Svg
      width={width ?? size ?? 22}
      height={height ?? size ?? 22}
      viewBox="0 0 22 22"
      fill="none"
      {...props}
    >
      <Path
        d="M11 15C12.6569 15 14 13.6569 14 12C14 10.3431 12.6569 9 11 9C9.34315 9 8 10.3431 8 12C8 13.6569 9.34315 15 11 15Z"
        stroke={color ?? '#1152D4'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11 3V4M11 20V21M18 12H19M3 12H4M16.364 16.364L15.657 15.657M6.343 6.343L5.636 5.636M16.364 7.636L15.657 8.343M6.343 17.657L5.636 18.364"
        stroke={color ?? '#1152D4'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
