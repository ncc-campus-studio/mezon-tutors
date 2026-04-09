import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

export const SeamlessVirtualClassroomIcon = ({ size, width, height, color, ...props }: IconProps) => {
  return (
    <Svg
      width={width ?? size ?? 20}
      height={height ?? size ?? 20}
      viewBox="0 0 20 20"
      fill="none"
      {...props}
    >
      <Path
        d="M4 12h8v-2H4v2zm0-3h12V7H4v2zm0-3h12V4H4v2zM0 20V2C0 1.45.196.98.588.587A1.926 1.926 0 012 0h16c.55 0 1.02.196 1.413.588C19.803.979 20 1.45 20 2v12c0 .55-.196 1.02-.587 1.412A1.926 1.926 0 0118 16H4l-4 4zm3.15-6H18V2H2v13.125L3.15 14zM2 14V2v12z"
        fill={color ?? '#1152D4'}
      />
    </Svg>
  );
};
