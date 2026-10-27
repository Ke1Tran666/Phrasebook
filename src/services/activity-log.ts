import type { AppView } from '@/navigation';

export type ActivityType =
  | 'lesson_added'
  | 'lesson_updated'
  | 'lesson_deleted'
  | 'review_completed'
  | 'backup_exported'
  | 'backup_imported';

export type ActivityItem = {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string; // ISO string
  view?: AppView;
  linkText?: string;
};

const STORAGE_KEY = 'phrasebook_activity_log';
const MAX_ACTIVITIES = 15;

export const getActivities = (): ActivityItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const logActivity = (
  item: Omit<ActivityItem, 'id' | 'timestamp'>,
): ActivityItem | null => {
  try {
    const current = getActivities();
    const newActivity: ActivityItem = {
      ...item,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    const updated = [newActivity, ...current].slice(0, MAX_ACTIVITIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Bắn event để NotificationMenu tự động cập nhật thời gian thực
    window.dispatchEvent(new CustomEvent('phrasebook_activity_logged'));
    return newActivity;
  } catch {
    return null;
  }
};

export const clearActivities = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('phrasebook_activity_logged'));
  } catch {
    // ignore
  }
};

export const formatRelativeTime = (isoString: string): string => {
  try {
    const diff = Date.now() - new Date(isoString).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Hôm qua';
    return `${days} ngày trước`;
  } catch {
    return '';
  }
};
