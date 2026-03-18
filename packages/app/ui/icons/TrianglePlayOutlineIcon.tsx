import Svg, { Path } from 'react-native-svg'
import { IconProps } from './types'

export const TrianglePlayOutlineIcon = ({ size, width, height, color, ...props }: IconProps) => {
  const w = width ?? size ?? 28
  const h = height ?? size ?? 32

  return (
    <Svg width={w} height={h} viewBox="0 0 14 18" fill="none" {...props}>
      <Path
        d="M0 17.5V0L13.75 8.75L0 17.5ZM2.5 12.9375L9.0625 8.75L2.5 4.5625V12.9375Z"
        fill={color ?? 'white'}
      />
    </Svg>
  )
}
