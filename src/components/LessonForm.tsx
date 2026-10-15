import Editor from '@/components/Editor';
import Modal from '@/components/Modal';
import type { Lesson } from '@/db';
import { useLanguage } from '@/language';

type LessonFormProps = {
  lesson: Lesson | null | undefined;
  onClose: () => void;
  onSaved: (lesson: Lesson) => void;
  notify: (message: string) => void;
};

const LessonForm = ({ lesson, onClose, onSaved, notify }: LessonFormProps) => {
  const { t } = useLanguage();
  return (
    <Modal
      open={lesson !== undefined}
      label={lesson ? t('editor.editTitle') : t('editor.addTitle')}
      onClose={onClose}
      wide
    >
      {lesson !== undefined && (
        <Editor
          key={lesson?.id ?? 'new'}
          lesson={lesson}
          onClose={onClose}
          onSaved={onSaved}
          notify={notify}
        />
      )}
    </Modal>
  );
};

export default LessonForm;
