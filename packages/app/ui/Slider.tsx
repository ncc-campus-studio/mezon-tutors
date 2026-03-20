import { Slider as TamaguiSlider, SliderProps } from 'tamagui'

export function Slider({ ...props }: SliderProps) {
  const thumbValues = props.value ?? props.defaultValue ?? []
  return (
    <TamaguiSlider {...props}>
      <TamaguiSlider.Track backgroundColor="$gray2">
        <TamaguiSlider.TrackActive backgroundColor="$appPrimary" />
      </TamaguiSlider.Track>
      {thumbValues.map((_, index) => (
        <TamaguiSlider.Thumb
          circular
          key={index}
          index={index}
          size={20}
          backgroundColor="$appPrimary"
        />
      ))}
    </TamaguiSlider>
  )
}
