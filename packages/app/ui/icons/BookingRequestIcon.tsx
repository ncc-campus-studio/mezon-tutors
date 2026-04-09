import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { IconProps } from './types';

export const BookingRequestIcon = ({ size, width, height, color, ...props }: IconProps) => {
  const stroke = color ?? '#2F7CFF';

  return (
    <Svg
      width={width ?? size ?? 20}
      height={height ?? size ?? 20}
      viewBox="0 0 20 20"
      fill="none"
      {...props}
    >
      <Path
        d="M6.1 3.3H5.4C4.07 3.3 3 4.37 3 5.7V14.4C3 15.73 4.07 16.8 5.4 16.8H10.8"
        stroke={stroke}
        strokeWidth="1.55"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <Path
        d="M11.9 3.3H12.6C13.93 3.3 15 4.37 15 5.7V9.2"
        stroke={stroke}
        strokeWidth="1.55"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <Rect
        x="6.1"
        y="2"
        width="5.8"
        height="2.8"
        rx="1.4"
        stroke={stroke}
        strokeWidth="1.55"
      />

      <Circle cx="13.2" cy="13.2" r="3.5" stroke={stroke} strokeWidth="1.55" />

      <Path
        d="M13.2 11.7V13.35L14.45 14.05"
        stroke={stroke}
        strokeWidth="1.55"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};