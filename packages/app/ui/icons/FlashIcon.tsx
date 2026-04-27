import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

export const FlashIcon = ({ size, width, height, ...props }: IconProps) => {
  return (
    <Svg
      width={width ?? size ?? 10}
      height={height ?? size ?? 12}
      viewBox="0 0 10 12"
      fill="none"
      {...props}
    >
      <Path
        d="M3.82 9.45l3.02-3.617H4.506l.423-3.31-2.698 3.894h2.027L3.821 9.45zm-1.487 2.217l.584-4.084H0L5.25 0h1.167l-.584 4.667h3.5l-5.833 7H2.333z"
        fill="#1152D4"
      />
    </Svg>
  );
};
