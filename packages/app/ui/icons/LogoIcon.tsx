import Svg, { Rect, Path } from 'react-native-svg';
import { IconProps } from './types';

export const LogoIcon = ({ size, width, height, ...props }: IconProps) => {
  return (
    <Svg
      width={width ?? size ?? 34}
      height={height ?? size ?? 30}
      viewBox="0 0 34 30"
      fill="none"
      {...props}
    >
      <Rect width={34} height={30} rx={15} fill="#1152D4" />
      <Path
        d="M17 24l-7-3.8v-6L6 12l11-6 11 6v8h-2v-6.9l-2 1.1v6L17 24zm0-8.3l6.85-3.7L17 8.3 10.15 12 17 15.7zm0 6.025l5-2.7V15.25L17 18l-5-2.75v3.775l5 2.7z"
        fill="#fff"
      />
    </Svg>
  );
};