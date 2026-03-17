import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

export const TrianglePlayIcon = ({ size, width, height, color, ...props }: IconProps) => {
  const w = width ?? size ?? 28;
  const h = height ?? size ?? 32;
  return (
    <Svg width={w} height={h} viewBox="0 0 28 32" fill="none" {...props}>
      <Path
        d="M26.25 13.4019C28.25 14.5566 28.25 17.4434 26.25 18.5981L5.25 30.7277C3.25 31.8824 0.75 30.439 0.75 28.1296L0.75 3.87039C0.75 1.561 3.25 0.1176 5.25 1.2723L26.25 13.4019Z"
        fill={color ?? 'white'}
      />
    </Svg>
  );
};
