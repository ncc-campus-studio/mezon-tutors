import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

export const GridIcon = ({ size, width, height, color, ...props }: IconProps) => {
  return (
    <Svg
      width={width ?? size}
      height={height ?? size}
      viewBox="0 0 18 18"
      fill="none"
      {...props}
    >
      <Path
        d="M10 6V0H18V6H10ZM0 10V0H8V10H0ZM10 18V8H18V18H10ZM0 18V12H8V18H0ZM2 8H6V2H2V8ZM12 16H16V10H12V16ZM12 4H16V2H12V4ZM2 16H6V14H2V16Z"
        fill={color ?? '#64748B'}
      />
    </Svg>
  );
};
