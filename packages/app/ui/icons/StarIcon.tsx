import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

export const StarIcon = ({ size, width, height, ...props }: IconProps) => {
  return (
    <Svg
      width={width ?? size ?? 13}
      height={height ?? size ?? 12}
      viewBox="0 0 13 12"
      fill="none"
      {...props}
    >
      <Path
        d="M4.118 8.845l1.893-1.01 1.776 1.217-.37-2.122 1.69-1.314-2.117-.3-.741-2.025L5.3 5.213l-2.136.077 1.543 1.498-.59 2.057zm-1.89 2.34L3.39 7.142.36 4.223l4.213-.144L6.405.305l1.43 3.945 4.174.584L8.69 7.42l.732 4.142L5.94 9.204l-3.71 1.98z"
        fill="#FACC15"
      />
    </Svg>
  );
};
