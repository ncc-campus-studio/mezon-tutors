import Svg, { Rect, Path } from 'react-native-svg';
import { IconProps } from './types';

export const FeatureLearnViaMezonIcon = ({ size, width, height, color, primary, ...props }: IconProps) => {
  return (
    <Svg
      width={width ?? size ?? 48}
      height={height ?? size ?? 48}
      viewBox="0 0 48 48"
      fill="none"
      {...props}
    >
      <Rect width={48} height={48} rx={24} fill={color ?? '#1152D4'} fillOpacity={0.16} />
      <Path
        d="M34 34l-4-4H20c-.55 0-1.02-.196-1.413-.587A1.926 1.926 0 0118 28v-1h11c.55 0 1.02-.196 1.413-.587.391-.392.587-.863.587-1.413v-7h1c.55 0 1.02.196 1.413.587.391.392.587.863.587 1.413v14zm-18-9.825L17.175 23H27v-7H16v8.175zM14 29V16c0-.55.196-1.02.588-1.412A1.926 1.926 0 0116 14h11c.55 0 1.02.196 1.413.588.391.391.587.862.587 1.412v7c0 .55-.196 1.02-.587 1.413A1.926 1.926 0 0127 25h-9l-4 4zm2-6v-7 7z"
        fill={primary ?? '#F1F5F9'}
      />
    </Svg>
  );
};
