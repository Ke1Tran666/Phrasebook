import Modal from '@/components/Modal';
import { ui } from '@/styles/ui';
import { Check, LoaderCircle, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type ConfirmDialogProps = {
  open: boolean;
  label: string;
  title: string;
  description: ReactNode;
  icon: LucideIcon;
  iconTone?: 'blue' | 'red';
  confirmLabel: string;
  cancelLabel: string;
  pending?: boolean;
  destructive?: boolean;
  preview?: ReactNode;
  onClose: () => void;
  onConfirm: () => void;
};

const ConfirmDialog = ({
  open,
  label,
  title,
  description,
  icon: Icon,
  iconTone = 'blue',
  confirmLabel,
  cancelLabel,
  pending = false,
  destructive = false,
  preview,
  onClose,
  onConfirm,
}: ConfirmDialogProps) => (
  <Modal open={open} label={label} onClose={onClose}>
    <div className={ui('confirm-content')}>
      <span className={ui(`stat-icon ${iconTone}`)}>
        <Icon />
      </span>
      <h2>{title}</h2>
      {preview}
      {description}
      <div className={ui('confirm-actions')}>
        <button
          className={ui('button secondary')}
          disabled={pending}
          onClick={onClose}
        >
          {cancelLabel}
        </button>
        <button
          className={ui(
            destructive ? 'button danger-button' : 'button primary',
          )}
          disabled={pending}
          onClick={onConfirm}
        >
          {pending ? (
            <LoaderCircle className={ui('spin')} size={16} />
          ) : (
            !destructive && <Check size={16} />
          )}{' '}
          {confirmLabel}
        </button>
      </div>
    </div>
  </Modal>
);

export default ConfirmDialog;
