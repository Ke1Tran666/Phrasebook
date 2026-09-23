import type { Status } from '@/db';

export const statusText: Record<Status, string> = {
  new: 'Chưa học',
  review: 'Đã ôn',
  learned: 'Đã nhớ',
};
