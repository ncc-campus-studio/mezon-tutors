import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

export const EditIcon = ({ size, width, height, color = '#6B7280', ...props }: IconProps) => {
  return (
    <Svg
      width={width ?? size ?? 20}
      height={height ?? size ?? 20}
      viewBox="0 0 20 20"
      fill="none"
      {...props}
    >
      <Path
        d="M14.166 2.5a2.357 2.357 0 013.334 3.334l-9.167 9.166-4.166.834.833-4.167L14.166 2.5z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
