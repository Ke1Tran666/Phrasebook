import { ui } from '@/styles/ui';
import { useEffect, useRef, type ReactNode } from 'react';

const Modal = ({
  open,
  onClose,
  children,
  label,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  label: string;
  wide?: boolean;
}) => {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (open && !ref.current?.open) ref.current?.showModal();
    else if (!open && ref.current?.open) ref.current?.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={ui(wide ? 'modal wide' : 'modal')}
      aria-label={label}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={ui('modal-content')}>{children}</div>
    </dialog>
  );
};

export default Modal;
