import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

export const ChevronRightIcon = ({ size = 24, width, height, color, ...props }: IconProps) => {
  return (
    <Svg
      width={width ?? size}
      height={height ?? size}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <Path
        d="M8.59 16.59L10 18L16 12L10 6L8.59 7.41L13.17 12L8.59 16.59Z"
        fill={color ?? '#7F93BD'}
      />
    </Svg>
  );
};
