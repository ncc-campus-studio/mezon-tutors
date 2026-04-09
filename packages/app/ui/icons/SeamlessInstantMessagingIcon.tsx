import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

export const SeamlessInstantMessagingIcon = ({ size, width, height, color, ...props }: IconProps) => {
  return (
    <Svg
      width={width ?? size ?? 20}
      height={height ?? size ?? 20}
      viewBox="0 0 20 20"
      fill="none"
      {...props}
    >
      <Path
        d="M6 12h6c.283 0 .52-.096.713-.287A.968.968 0 0013 11V9l2 2V5l-2 2V5a.967.967 0 00-.287-.713A.968.968 0 0012 4H6a.968.968 0 00-.713.287A.968.968 0 005 5v6c0 .283.096.52.287.713.192.191.43.287.713.287zm-6 8V2C0 1.45.196.98.588.587A1.926 1.926 0 012 0h16c.55 0 1.02.196 1.413.588C19.803.979 20 1.45 20 2v12c0 .55-.196 1.02-.587 1.412A1.926 1.926 0 0118 16H4l-4 4zm3.15-6H18V2H2v13.125L3.15 14zM2 14V2v12z"
        fill={color ?? '#1152D4'}
      />
    </Svg>
  );
};
