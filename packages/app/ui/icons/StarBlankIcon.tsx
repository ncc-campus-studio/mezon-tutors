import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

export const StarBlankIcon = ({ size, width, height, color, ...props }: IconProps) => {
  return (
    <Svg
      width={width ?? size ?? 18}
      height={height ?? size ?? 18}
      viewBox="0 0 18 18"
      fill="none"
      {...props}
    >
      <Path
        d="M6.165 13.3425L9 11.6325L11.835 13.365L11.0925 10.125L13.59 7.965L10.305 7.6725L9 4.6125L7.695 7.65L4.41 7.9425L6.9075 10.125L6.165 13.3425ZM3.4425 17.1L4.905 10.7775L0 6.525L6.48 5.9625L9 0L11.52 5.9625L18 6.525L13.095 10.7775L14.5575 17.1L9 13.7475L3.4425 17.1Z"
        fill={color ?? '#1152D4'}
      />
    </Svg>
  );
};
