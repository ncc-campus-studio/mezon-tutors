import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

export const TrendDownIcon = ({ size, width, height, color, ...props }: IconProps) => {
  return (
    <Svg
      width={width ?? size}
      height={height ?? size}
      viewBox="0 0 12 7"
      fill="none"
      {...props}
    >
      <Path
        d="M8.16667 7V5.83333H9.68333L6.65 2.82917L4.31667 5.1625L0 0.816667L0.816667 0L4.31667 3.5L6.65 1.16667L10.5 5.01667V3.5H11.6667V7H8.16667Z"
        fill={color ?? '#F43F5E'}
      />
    </Svg>
  );
};
