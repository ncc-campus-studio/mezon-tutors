import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

export const ChartIcon = ({ size, width, height, color, ...props }: IconProps) => {
  return (
    <Svg
      width={width ?? size}
      height={height ?? size}
      viewBox="0 0 18 18"
      fill="none"
      {...props}
    >
      <Path
        d="M0 18V16L2 14V18H0ZM4 18V12L6 10V18H4ZM8 18V10L10 12.025V18H8ZM12 18V12.025L14 10.025V18H12ZM16 18V8L18 6V18H16ZM0 12.825V10L7 3L11 7L18 0V2.825L11 9.825L7 5.825L0 12.825Z"
        fill={color ?? '#64748B'}
      />
    </Svg>
  );
};
