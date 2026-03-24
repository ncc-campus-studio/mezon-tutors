import Svg, { Circle, Path } from 'react-native-svg';
import { IconProps } from './types';

export const ClockOutlineIcon = ({ size, width, height, color, ...props }: IconProps) => (
  <Svg
    width={width ?? size ?? 22}
    height={height ?? size ?? 22}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Circle cx="12" cy="12" r="8.5" stroke={color ?? 'currentColor'} strokeWidth="1.6" />
    <Path
      d="M12 8v4.2l3 1.8"
      stroke={color ?? 'currentColor'}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
