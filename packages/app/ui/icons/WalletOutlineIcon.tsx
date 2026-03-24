import Svg, { Path, Rect } from 'react-native-svg';
import { IconProps } from './types';

export const WalletOutlineIcon = ({ size, width, height, color, ...props }: IconProps) => (
  <Svg
    width={width ?? size ?? 22}
    height={height ?? size ?? 22}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Rect
      x="3.5"
      y="6.5"
      width="17"
      height="11"
      rx="2.5"
      stroke={color ?? 'currentColor'}
      strokeWidth="1.6"
    />
    <Path
      d="M3.5 10.5h17M8 14h4"
      stroke={color ?? 'currentColor'}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </Svg>
);
