import Svg, { Circle, Path } from 'react-native-svg';
import { IconProps } from './types';

export const CompassIcon = ({ size, width, height, color, ...props }: IconProps) => (
  <Svg
    width={width ?? size ?? 18}
    height={height ?? size ?? 18}
    viewBox="0 0 18 18"
    fill="none"
    {...props}
  >
    <Circle cx="9" cy="9" r="7.5" stroke={color ?? '#1D66F2'} strokeWidth="1.8" />
    <Path
      d="M11.8 6.2L10.45 10.45L6.2 11.8L7.55 7.55L11.8 6.2Z"
      stroke={color ?? '#1D66F2'}
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <Circle cx="9" cy="9" r="1.05" fill={color ?? '#1D66F2'} />
  </Svg>
);
