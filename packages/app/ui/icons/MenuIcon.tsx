import Svg, { Path } from 'react-native-svg'

type MenuIconProps = {
  size?: number
  color?: string
}

export function MenuIcon({ size = 24, color = '#111827' }: MenuIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 12h18M3 6h18M3 18h18"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
