import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

export const ChevronLeftIcon = ({ size = 24, width, height, color, ...props }: IconProps) => {
  return (
    <Svg
      width={width ?? size}
      height={height ?? size}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <Path
        d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z"
        fill={color ?? '#7F93BD'}
      />
    </Svg>
  );
};
