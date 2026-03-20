import type { ReactNode } from 'react';
import { useTheme, useMedia, XStack, YStack } from 'tamagui';
import { Text } from './Text';

export type AdminTableColumn = {
  id: string;
  label: ReactNode;
  flex?: number;
  width?: number | string;
  align?: 'left' | 'right' | 'center';
};

export type AdminTableRow = {
  id: string;
  cells: ReactNode[];
  isSelected?: boolean;
  onPress?: () => void;
};

export type AdminTableProps = {
  columns: AdminTableColumn[];
  rows: AdminTableRow[];
  highlightColorToken?: string;
  headerBackgroundToken?: string;
  rowHoverBackgroundToken?: string;
  selectedBackgroundToken?: string;
  footer?: ReactNode;
};

export function AdminTable({
  columns,
  rows,
  highlightColorToken = '$appBorderEmphasis',
  rowHoverBackgroundToken = '$backgroundMuted',
  footer,
}: AdminTableProps) {
  const theme = useTheme();
  const media = useMedia();
  const selectedBackground = theme.selectedBackground?.val;
  const isNarrow = media.sm || media.xs;
  const paddingHorizontal = isNarrow ? 12 : 16;
  const paddingVerticalRow = isNarrow ? 16 : 25;

  return (
    <YStack
      borderRadius="$appCard"
      overflow="hidden"
      borderWidth={1}
      borderColor="$borderColor"
      backgroundColor="$surface"
      minWidth={0}
    >
      <XStack
        paddingVertical={10}
        paddingHorizontal={paddingHorizontal}
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
        backgroundColor="$headerBackground"
        gap={isNarrow ? 8 : 12}
      >
        {columns.map((column) => (
          <Text
            key={column.id}
            size="sm"
            style={{
              flex: column.flex,
              width: column.width,
              textAlign: column.align ?? 'left',
            }}
            variant="muted"
            fontSize={13}
            fontWeight={'700'}
          >
            {column.label}
          </Text>
        ))}
      </XStack>

      {rows.map((row, index) => {
        const isSelected = row.isSelected;

        return (
          <XStack
            key={row.id}
            paddingVertical={paddingVerticalRow}
            paddingHorizontal={paddingHorizontal}
            alignItems="center"
            gap={isNarrow ? 8 : 12}
            backgroundColor={isSelected ? selectedBackground : 'transparent'}
            borderLeftWidth={3}
            borderLeftColor={isSelected ? highlightColorToken : 'transparent'}
            borderTopWidth={index === 0 ? 0 : 1}
            borderTopColor="$borderSubtle"
            hoverStyle={{
              backgroundColor: rowHoverBackgroundToken,
            }}
            onPress={row.onPress}
          >
            {row.cells.map((cell, cellIndex) => {
              const column = columns[cellIndex];

              return (
                <YStack
                  key={column?.id ?? String(cellIndex)}
                  style={{
                    flex: column?.flex,
                    width: column?.width,
                    alignItems:
                      column?.align === 'right'
                        ? 'flex-end'
                        : column?.align === 'center'
                          ? 'center'
                          : 'flex-start',
                  }}
                >
                  {cell}
                </YStack>
              );
            })}
          </XStack>
        );
      })}

      {footer && (
        <XStack
          paddingVertical={12}
          paddingHorizontal={paddingHorizontal}
          borderTopWidth={1}
          borderTopColor="$borderColor"
        >
          {footer}
        </XStack>
      )}
    </YStack>
  );
}
