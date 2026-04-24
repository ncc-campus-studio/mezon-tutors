import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

export const ChevronDownIcon = ({ size, width, height, color, ...props }: IconProps) => {
  return (
    <Svg
      width={width ?? size ?? 12}
      height={height ?? size ?? 8}
      viewBox="0 0 12 8"
      fill="none"
      {...props}
    >
      <Path
        d="M1 1.5L6 6.5L11 1.5"
        stroke={color ?? '#666'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
