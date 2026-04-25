import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

export const ArrowLeftIcon = ({ size = 24, width, height, color, ...props }: IconProps) => {
  return (
    <Svg
      width={width ?? size}
      height={height ?? size}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <Path
        d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"
        fill={color ?? '#EAF1FF'}
      />
    </Svg>
  );
};
