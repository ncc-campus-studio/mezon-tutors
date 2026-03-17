import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

export const StarHalfIcon = ({ size, width, height, color, ...props }: IconProps) => {
  return (
    <Svg
      width={width ?? size ?? 20}
      height={height ?? size ?? 19}
      viewBox="0 0 20 19"
      fill="none"
      {...props}
    >
      <Path
        d="M13.15 14.85L12.325 11.25L15.1 8.85L11.45 8.525L10 5.125V12.925L13.15 14.85Z"
        fill={color ?? '#1152D4'}
      />
      <Path
        d="M3.825 19L5.45 11.975L0 7.25L7.2 6.625L10 0L12.8 6.625L20 7.25L14.55 11.975L16.175 19L10 15.275L3.825 19Z"
        fill={color ?? '#1152D4'}
      />
    </Svg>
  );
};
