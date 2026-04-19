export type TimeSlot = {
  startTime: string;
  endTime: string;
};

export type AvailabilityData = {
  slotsByDay: Record<string, TimeSlot[]>;
};

export type AvailabilityEditorMode = 'create' | 'edit';
