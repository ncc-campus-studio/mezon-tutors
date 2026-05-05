'use client';

import { ENotificationType, NOTIFICATION_I18N_NAMESPACE } from '@mezon-tutors/shared';
import { Bell } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { type UIEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  useInfiniteNotifications,
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
  useUnreadNotificationCount,
} from '@/services/notification/notification.api';

const PAGE_SIZE = 20;

type HeaderNotificationProps = {
  enabled: boolean;
};

function typeBorderClass(type: ENotificationType): string {
  switch (type) {
    case ENotificationType.BOOKING:
      return 'border-l-blue-400';
    case ENotificationType.PAYMENT:
      return 'border-l-green-400';
    case ENotificationType.SYSTEM:
      return 'border-l-primary';
    case ENotificationType.LESSON_STARTING_SOON:
      return 'border-l-orange-400';
    default:
      return 'border-l-slate-200';
  }
}

export function HeaderNotification({ enabled }: HeaderNotificationProps) {
  const locale = useLocale();
  const t = useTranslations(NOTIFICATION_I18N_NAMESPACE);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const unreadCountQuery = useUnreadNotificationCount(enabled);
  const notificationsQuery = useInfiniteNotifications(PAGE_SIZE, enabled && open);
  const markAsReadMutation = useMarkNotificationAsReadMutation(PAGE_SIZE);
  const markAllAsReadMutation = useMarkAllNotificationsAsReadMutation(PAGE_SIZE);

  const notificationItems = useMemo(
    () => notificationsQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [notificationsQuery.data]
  );
  const unreadCount = unreadCountQuery.data?.unreadCount ?? 0;

  const fallbackByType: Record<ENotificationType, string> = {
    [ENotificationType.BOOKING]: 'Booking',
    [ENotificationType.PAYMENT]: 'Payment',
    [ENotificationType.SYSTEM]: 'System',
    [ENotificationType.LESSON_STARTING_SOON]: 'Lesson reminder',
  };

  const translateWithFallback = (
    key: string | undefined | null,
    params: Record<string, string | number | Date> | null | undefined,
    fallback: string
  ) => {
    if (!key) return fallback;
    try {
      return t(key as never, (params ?? {}) as never);
    } catch {
      return fallback;
    }
  };

  const getLabel = (
    key: string,
    fallback: string,
    params?: Record<string, string | number | Date>
  ) => translateWithFallback(key, params, fallback);

  const getNotificationTitle = (item: (typeof notificationItems)[number]) => {
    const meta = item.metadata;
    const titleKey =
      meta &&
      typeof meta === 'object' &&
      'titleI18nKey' in meta &&
      typeof meta.titleI18nKey === 'string'
        ? meta.titleI18nKey
        : null;
    const hasTitleParams =
      meta &&
      typeof meta === 'object' &&
      'titleI18nParams' in meta &&
      meta.titleI18nParams !== null &&
      typeof meta.titleI18nParams === 'object';
    const rawParams = hasTitleParams
      ? (meta.titleI18nParams as Record<string, string | number | Date>)
      : {};
    return translateWithFallback(titleKey, rawParams, item.title);
  };

  const getNotificationContent = (item: (typeof notificationItems)[number]) => {
    return translateWithFallback(item.i18nKey, item.i18nParams, item.content);
  };

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (wrapperRef.current && !wrapperRef.current.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const handleListScroll = (event: UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight;
    const clientHeight = target.clientHeight;
    const remaining = scrollHeight - scrollTop - clientHeight;
    if (
      remaining < 80 &&
      notificationsQuery.hasNextPage &&
      !notificationsQuery.isFetchingNextPage
    ) {
      void notificationsQuery.fetchNextPage();
    }
  };

  return (
    <div
      className="relative"
      ref={wrapperRef}
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-label={getLabel('openAria', 'Open notifications')}
        onClick={() => setOpen((v) => !v)}
        className="relative h-9 rounded-full border-slate-200 bg-white px-3 text-slate-800 shadow-none transition-all duration-200 ease-out hover:-translate-y-px hover:border-violet-400 hover:bg-violet-50"
      >
        <span className="relative inline-flex items-center justify-center">
          <Bell
            className="size-4 text-slate-500"
            aria-hidden
          />
          {unreadCount > 0 ? (
            <span className="absolute -top-2 -right-2.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          ) : null}
        </span>
      </Button>

      {open ? (
        <div
          className="absolute top-11 right-0 z-999 flex w-[440px] max-w-[96vw] flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"
          aria-label={getLabel('title', 'Notifications')}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-lg font-bold text-slate-900">{getLabel('title', 'Notifications')}</p>
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-[13px] text-slate-500">
                {getLabel('unreadCount', `${unreadCount} unread`, {
                  count: unreadCount,
                })}
              </span>
              <Button
                type="button"
                variant="outline"
                size="xs"
                disabled={unreadCount === 0 || markAllAsReadMutation.isPending}
                onClick={() => {
                  if (unreadCount > 0) {
                    markAllAsReadMutation.mutate();
                  }
                }}
              >
                {getLabel('markAllAsRead', 'Mark all read')}
              </Button>
            </div>
          </div>

          <div
            className="max-h-[420px] overflow-y-auto rounded-xl border border-slate-200"
            onScroll={handleListScroll}
          >
            {notificationItems.length === 0 && !notificationsQuery.isLoading ? (
              <div className="flex flex-col items-center justify-center px-6 py-10">
                <p className="text-center text-sm text-slate-500">
                  {getLabel('empty', 'No notifications yet')}
                </p>
              </div>
            ) : null}

            {notificationItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className="block w-full cursor-pointer text-left"
                onClick={() => {
                  if (!item.isRead && !markAsReadMutation.isPending) {
                    markAsReadMutation.mutate(item.id);
                  }
                }}
              >
                <div
                  className={cn(
                    'flex flex-col gap-2 border-b border-slate-200 p-3 pl-3 border-l-4',
                    typeBorderClass(item.type),
                    item.isRead ? 'bg-transparent' : 'bg-sky-50'
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p
                      className={cn(
                        'min-w-0 flex-1 leading-5',
                        item.isRead ? 'font-medium text-slate-800' : 'font-bold text-slate-900'
                      )}
                    >
                      {getNotificationTitle(item)}
                    </p>
                    {!item.isRead ? (
                      <span
                        className="mt-1.5 size-2 shrink-0 rounded-full bg-blue-600"
                        aria-hidden
                      />
                    ) : null}
                  </div>
                  <p className="text-xs font-semibold text-blue-700">
                    {getLabel(`types.${item.type}`, fallbackByType[item.type])}
                  </p>
                  <p className="text-sm leading-5 text-slate-600">{getNotificationContent(item)}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(item.createdAt).toLocaleString(locale)}
                  </p>
                </div>
              </button>
            ))}

            {notificationsQuery.isFetchingNextPage ? (
              <div className="flex justify-center px-3 py-3">
                <p className="text-sm text-slate-500">
                  {getLabel('loadingMore', 'Loading more...')}
                </p>
              </div>
            ) : null}

            {notificationsQuery.isLoading ? (
              <div className="flex justify-center px-4 py-6">
                <p className="text-sm text-slate-500">
                  {getLabel('loading', 'Loading notifications...')}
                </p>
              </div>
            ) : null}

            {notificationsQuery.isError ? (
              <div className="flex justify-center px-4 py-6">
                <p className="text-sm text-red-600">
                  {getLabel('loadError', 'Cannot load notifications. Please try again.')}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
