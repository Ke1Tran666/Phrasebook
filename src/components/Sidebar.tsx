import ProfileButton from '@/components/ProfileButton';
import type { AppView } from '@/navigation';
import type { GoogleAccount } from '@/services/google-drive';
import { ui } from '@/styles/ui';
import Logo from '@/components/Logo';
import {
  BookOpen,
  ChevronRight,
  ClipboardCheck,
  HardDrive,
  LayoutDashboard,
  Rocket,
  ShieldCheck,
} from 'lucide-react';
import { type Lesson } from '@/db';
import { useLanguage } from '@/language';
import { isAdminAccount } from '@/services/admin-auth';

const Sidebar = ({
  view,
  account,
  nav,
  all,
  counts,
  topics,
  topic,
  setTopic,
  setStatus,
  setKind,
}: {
  view: AppView;
  account?: GoogleAccount;
  nav: (view: AppView) => void;
  all: Lesson[];
  counts: { review: number };
  topics: string[];
  topic: string;
  setTopic: (value: string) => void;
  setStatus: (value: string) => void;
  setKind: (value: string) => void;
}) => {
  const { t } = useLanguage();
  const isAdmin = isAdminAccount(account);

  return (
    <aside className={ui('sidebar')}>
      <Logo onClick={() => nav('dashboard')} />
      <span className={ui('sidebar-caption')}>{t('sidebar.learning')}</span>
      <nav aria-label="Điều hướng chính">
        <button
          className={ui(
            view === 'dashboard' ? 'nav-item selected' : 'nav-item',
          )}
          onClick={() => nav('dashboard')}
        >
          <LayoutDashboard size={19} /> {t('nav.dashboard')}
        </button>
        <button
          className={ui(view === 'lessons' ? 'nav-item selected' : 'nav-item')}
          onClick={() => {
            nav('lessons');
            setTopic('all');
          }}
        >
          <BookOpen size={19} /> {t('nav.lessons')} <span>{all.length}</span>
        </button>
        <button
          className={ui(
            view === 'exam-practice' ? 'nav-item selected' : 'nav-item',
          )}
          onClick={() => nav('exam-practice')}
        >
          <ClipboardCheck size={19} /> {t('nav.examPractice')}{' '}
          {counts.review > 0 && <span>{counts.review}</span>}
        </button>
        <button
          className={ui(view === 'backup' ? 'nav-item selected' : 'nav-item')}
          onClick={() => nav('backup')}
        >
          <HardDrive size={19} /> {t('nav.backup')}
        </button>
        {isAdmin && (
          <button
            className={ui(view === 'updates' ? 'nav-item selected' : 'nav-item')}
            onClick={() => nav('updates')}
          >
            <Rocket size={19} /> {t('nav.updates')}
          </button>
        )}
      </nav>
      <div className={ui('sidebar-topics')}>
        <span className={ui('sidebar-caption')}>{t('sidebar.topics')}</span>
        {topics.length ? (
          topics.map((t) => (
            <button
              className={ui(
                'topic-nav ' +
                  (topic === t && view === 'lessons' ? 'chosen' : ''),
              )}
              key={t}
              onClick={() => {
                setTopic(t);
                setStatus('all');
                setKind('all');
                nav('lessons');
              }}
            >
              <span className="size-2 shrink-0 rounded-full border border-forest/60" />

              <span className="min-w-0 flex-1 truncate" title={t}>
                {t}
              </span>

              <span className="shrink-0 text-xs text-muted">
                {all.filter((lesson) => lesson.topic === t).length}
              </span>
            </button>
          ))
        ) : (
          <p className="text-muted text-xs px-3 py-2">
            {t('sidebar.noTopics')}
          </p>
        )}
      </div>
      <div className={ui('local-card')}>
        <span className={ui('local-icon')}>
          <ShieldCheck size={20} />
        </span>
        <strong>{t('sidebar.privateTitle')}</strong>
        <p>{t('sidebar.privateDescription')}</p>
        <button onClick={() => nav('backup')}>
          {t('sidebar.manageBackup')} <ChevronRight size={14} />
        </button>
      </div>
      <ProfileButton
        account={account}
        active={view === 'profile'}
        onClick={() => nav('profile')}
      />
    </aside>
  );
};

export default Sidebar;