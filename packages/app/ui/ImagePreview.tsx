import { Image } from 'tamagui';

export function ImagePreview({
  src,
  fallback = null,
}: {
  src?: string | null;
  fallback?: React.ReactNode;
}) {
  if (!src) return <>{fallback}</>;

  return (
    <Image
      source={{ uri: src }}
      width="100%"
      height={200}
      objectFit="cover"
      borderRadius={8}
    />
  );
}
