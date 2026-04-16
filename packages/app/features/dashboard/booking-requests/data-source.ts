import { getMockBookingRequests } from './mock-data';
import type { BookingRequestFilter, BookingRequestsViewData } from './types';

export async function getTutorBookingRequestsByMezonUserId(
  tutorMezonUserId?: string,
  options?: {
    filter?: BookingRequestFilter;
    page?: number;
    pageSize?: number;
  }
): Promise<BookingRequestsViewData> {
  if (!tutorMezonUserId) {
    return {
      requests: [],
      metrics: [],
      total: 0,
      page: options?.page ?? 1,
      pageSize: options?.pageSize ?? 5,
      totalPages: 1,
    };
  }

  try {
    const data = await getMockBookingRequests({
      tutorId: tutorMezonUserId,
      status: options?.filter && options.filter !== 'all' ? options.filter : undefined,
      page: options?.page,
      pageSize: options?.pageSize,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });

    return data;
  } catch (error) {
    console.error('Error fetching booking requests:', error);
    return {
      requests: [],
      metrics: [],
      total: 0,
      page: options?.page ?? 1,
      pageSize: options?.pageSize ?? 5,
      totalPages: 1,
    };
  }
}
