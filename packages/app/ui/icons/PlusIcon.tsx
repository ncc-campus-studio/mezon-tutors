import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

export const PlusIcon = ({ size, width, height, color, ...props }: IconProps) => {
  return (
    <Svg
      width={width ?? size}
      height={height ?? size}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <Path
        d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"
        fill={color ?? '#64748B'}
      />
    </Svg>
  );
};
