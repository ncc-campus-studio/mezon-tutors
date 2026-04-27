import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

export const StarFilledIcon = ({ size, width, height, color = '#FACC15', ...props }: IconProps) => {
  return (
    <Svg
      width={width ?? size ?? 20}
      height={height ?? size ?? 19}
      viewBox="0 0 20 19"
      fill="none"
      {...props}
    >
      <Path
        d="M10 0l2.939 6.015L20 7.255l-5 4.91 1.18 6.98L10 15.77l-6.18 3.375L5 12.165 0 7.255l7.061-1.24L10 0z"
        fill={color}
      />
    </Svg>
  );
};
