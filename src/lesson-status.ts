import type { Status } from '@/db';

export const statusText: Record<Status, string> = {
  new: 'Chưa học',
  review: 'Cần ôn',
  learned: 'Đã nhớ',
};
