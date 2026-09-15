import Editor from '@/components/Editor';
import Modal from '@/components/Modal';
import type { Lesson } from '@/db';

type LessonFormProps = {
  lesson: Lesson | null | undefined;
  onClose: () => void;
  onSaved: (lesson: Lesson) => void;
  notify: (message: string) => void;
};

const LessonForm = ({ lesson, onClose, onSaved, notify }: LessonFormProps) => (
  <Modal
    open={lesson !== undefined}
    label={lesson ? 'Chỉnh sửa bài học' : 'Thêm bài học'}
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

export default LessonForm;
