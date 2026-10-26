// Tailwind utilities for shared UI parts. Marker classes retain contextual/state selectors.
// Keep complete utility names here so Tailwind can discover every responsive variant.
const styles: Record<string, string> = {
  'app-shell': 'min-h-screen flex max-[760px]:block bg-page text-text',
  sidebar:
    'w-[244px] shrink-0 fixed inset-y-0 left-0 flex flex-col pt-7 px-5 pb-5 bg-surface/95 backdrop-blur-md border-r border-line overflow-y-auto z-30 transition-colors [&_nav]:flex [&_nav]:flex-col [&_nav]:gap-1.5 [&_nav]:mt-4 max-[1150px]:w-[215px] max-[1150px]:px-3.5 max-[760px]:static max-[760px]:w-full max-[760px]:p-3 max-[760px]:border-r-0 max-[760px]:border-b max-[760px]:overflow-visible max-[760px]:[&>.sidebar-caption]:hidden max-[760px]:[&_nav]:mt-0 max-[760px]:[&_nav]:grid max-[760px]:[&_nav]:grid-cols-4 max-[760px]:[&_nav]:gap-1.5',
  brand:
    'flex items-center font-bold tracking-tight text-2xl gap-2.5 mb-7 max-[1150px]:text-xl max-[760px]:mb-3 max-[760px]:text-xl text-text transition-colors',
  'brand-icon':
    'bg-forest text-lime h-9 w-9 rounded-xl grid place-items-center shadow-xs shrink-0 max-[760px]:size-8',
  'brand-period': 'ml-[-4px] text-forest',
  'sidebar-caption':
    'text-[11px] tracking-wider uppercase font-bold text-muted px-3',
  'nav-item':
    'flex items-center gap-3 border-0 text-left bg-transparent text-muted px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 [&.selected]:bg-forest [&.selected]:text-white [&.selected]:shadow-xs [&:hover:not(.selected)]:bg-surface-soft [&:hover:not(.selected)]:text-text [&>span]:ml-auto [&>span]:bg-white/20 [&>span]:text-xs [&>span]:px-2 [&>span]:py-0.5 [&>span]:rounded-full max-[760px]:flex-col max-[760px]:justify-center max-[760px]:py-2 max-[760px]:px-1 max-[760px]:text-xs max-[760px]:gap-1 max-[760px]:[&>span]:hidden min-w-0',
  'sidebar-topics':
    'mt-6 [&>p]:text-xs [&>p]:leading-relaxed [&>p]:text-muted [&>p]:px-3 max-[760px]:hidden',
  'topic-nav':
    'border-0 bg-transparent flex gap-2.5 items-center w-full text-left px-3 py-2 text-sm text-muted rounded-xl transition-colors [&.chosen]:bg-surface-soft [&.chosen]:text-forest [&.chosen]:font-semibold [&:hover]:bg-surface-soft [&:hover]:text-text [&>span:last-child]:ml-auto [&>span:last-child]:text-xs [&>span:last-child]:text-muted min-w-0',
  'topic-dot': 'size-2 shrink-0 rounded-full border border-forest/60',
  'local-card':
    'mt-auto p-4 bg-surface-soft/80 border border-line rounded-2xl [&_strong]:text-sm [&_strong]:font-semibold [&_strong]:text-text [&_p]:text-xs [&_p]:leading-relaxed [&_p]:text-muted [&_p]:mt-1.5 [&_button]:flex [&_button]:items-center [&_button]:gap-1.5 [&_button]:p-0 [&_button]:bg-transparent [&_button]:border-0 [&_button]:text-xs [&_button]:font-semibold [&_button]:text-forest [&_button]:mt-3 hover:[&_button]:underline max-[760px]:hidden',
  'local-icon': 'block mb-2 text-forest',
  'sidebar-bottom':
    'flex items-center gap-3 pt-4 mt-4 border-t border-line text-sm [&_small]:block [&_small]:text-xs [&_small]:text-muted [&_small]:mt-0.5 max-[760px]:hidden',
  avatar:
    'bg-surface-soft text-text grid place-items-center size-9 rounded-full font-sans text-base font-semibold border border-line',
  'main-content':
    'ml-[244px] flex-1 min-w-0 max-[1150px]:ml-[215px] max-[760px]:ml-0 flex flex-col min-h-screen',
  topbar:
    'h-16 bg-surface/90 backdrop-blur-md border-b border-line flex justify-between items-center px-8 text-sm text-muted sticky top-0 z-20 transition-colors [&>div]:flex [&>div]:items-center [&>div]:gap-3 [&_strong]:font-semibold [&_strong]:text-text max-[1150px]:px-6 max-[760px]:h-14 max-[760px]:px-4',
  'local-label':
    'flex items-center gap-2 bg-surface-soft border border-line px-3 py-1 rounded-full text-xs font-semibold text-forest shadow-xs',
  workspace:
    'max-w-[1370px] w-full mx-auto px-8 py-8 flex-1 max-[1150px]:px-6 max-[1150px]:py-6 max-[760px]:px-4 max-[760px]:py-5',
  'page-heading':
    'flex items-center justify-between gap-6 mb-7 [&_h1]:font-sans [&_h1]:text-3xl sm:[&_h1]:text-4xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:text-text [&_h1>span]:text-forest [&_p]:text-sm sm:[&_p]:text-base [&_p]:text-muted [&_p]:mt-1.5 max-[760px]:flex-wrap max-[760px]:gap-4 max-[760px]:mb-5',
  eyebrow:
    'text-[11px] font-bold uppercase tracking-wider text-forest block mb-1',
  button:
    'inline-flex items-center justify-center gap-2 px-4.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed [&.primary]:bg-forest [&.primary]:text-white [&.primary]:shadow-sm [&.primary:hover:not(:disabled)]:bg-forest-hover [&.primary:hover:not(:disabled)]:-translate-y-0.5 [&.secondary]:bg-surface [&.secondary]:border [&.secondary]:border-line [&.secondary]:text-text [&.secondary:hover:not(:disabled)]:bg-surface-soft [&.secondary:hover:not(:disabled)]:border-line-hover',
  stats: 'grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-7',
  'stat-icon':
    'size-11 grid place-items-center rounded-xl shrink-0 transition-colors max-[760px]:size-9 max-[760px]:rounded-lg',
  green: 'text-status-learned bg-status-learned-bg',
  amber: 'text-status-review bg-status-review-bg',
  blue: 'text-status-info bg-status-info-bg',
  red: 'text-status-danger bg-status-danger-bg',
  'library-toolbar':
    'flex justify-between items-center border-b border-line mb-5 pb-3 flex-wrap gap-3',
  'tab-group':
    'flex gap-2 sm:gap-3 flex-wrap [&_button]:px-3.5 [&_button]:py-1.5 [&_button]:bg-transparent [&_button]:border [&_button]:border-transparent [&_button]:rounded-xl [&_button]:text-muted [&_button]:flex [&_button]:gap-2 [&_button]:items-center [&_button]:text-sm [&_button]:font-medium [&_button:hover]:text-text [&_button:hover]:bg-surface-soft [&_button.active]:bg-surface-soft [&_button.active]:text-forest [&_button.active]:border-line [&_button.active]:font-semibold [&_button_span]:bg-line [&_button_span]:px-1.5 [&_button_span]:py-0.5 [&_button_span]:rounded-full [&_button_span]:text-xs [&_button.active_span]:bg-forest [&_button.active_span]:text-white',
  'text-button':
    'inline-flex items-center justify-center gap-1.5 bg-transparent border-0 text-muted text-sm font-medium transition-colors hover:text-forest',
  'first-lesson':
    'grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] items-center gap-8 bg-surface border border-line rounded-2xl p-6 sm:p-10 mt-6 shadow-sm',
  'first-copy':
    '[&_h2]:font-sans [&_h2]:text-2xl sm:[&_h2]:text-3xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-text [&_h2]:my-3 [&>p]:text-sm sm:[&>p]:text-base [&>p]:text-muted [&>p]:leading-relaxed [&>p]:mb-6',
  'examples-button': 'flex mt-2 text-xs text-muted hover:text-forest',
  'sample-note':
    'border border-line rounded-2xl p-6 bg-surface-soft shadow-sm max-w-sm mx-auto w-full',
  'sample-label':
    'flex items-center gap-2 text-forest text-xs font-bold uppercase tracking-wider',
  'sample-english':
    'font-sans text-2xl font-semibold leading-snug mt-3 text-text [&_mark]:bg-lime [&_mark]:text-text [&_mark]:px-1 [&_mark]:rounded-md',
  'sample-meaning': 'text-sm text-muted mt-2 mb-4 leading-relaxed',
  'sample-rule':
    'border-t border-line pt-3 mb-4 [&>span]:text-xs [&>span]:font-bold [&>span]:uppercase [&>span]:tracking-wider [&>span]:text-forest [&>span]:block [&>span]:mb-1 [&_strong]:text-sm [&_strong]:font-semibold [&_strong]:text-text [&>p]:text-xs [&>p]:text-muted [&>p]:mt-1',
  'topic-chip':
    'inline-flex items-center text-xs bg-surface-soft text-muted font-medium px-2.5 py-1 rounded-lg max-w-[180px] truncate border border-line/60 hover:border-line transition-colors',
  'results-caption':
    'flex justify-between text-xs font-medium text-muted mt-5 mb-3.5',
  'lesson-grid': 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4',
  'lesson-card':
    'bg-surface border border-line rounded-2xl p-5 flex flex-col text-left min-h-[250px] transition-all duration-200 hover:border-line-hover hover:shadow-card hover:-translate-y-0.5 [&_h2]:font-sans [&_h2]:text-xl [&_h2]:leading-snug [&_h2]:font-semibold [&_h2]:text-text [&_h2]:line-clamp-3 [&_h2]:break-words [&_h2.passage-title]:text-base',
  'card-top': 'flex justify-between items-center text-muted mb-4',
  'type-label':
    'flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted [&.passage]:text-status-info [&.structure]:text-forest',
  'card-meaning': 'text-sm text-muted leading-relaxed mt-2 line-clamp-2',
  'card-highlights':
    'flex gap-1.5 items-center text-forest text-xs font-medium mt-3 bg-forest-soft px-2.5 py-1 rounded-md w-fit',
  'card-footer':
    'mt-auto pt-4 flex gap-2 justify-between items-center border-t border-line/60',
  status:
    'text-xs whitespace-nowrap inline-flex items-center gap-1 font-medium px-2.5 py-0.5 rounded-full [&.new]:text-status-new [&.new]:bg-status-new-bg [&.review]:text-status-review [&.review]:bg-status-review-bg [&.learned]:text-status-learned [&.learned]:bg-status-learned-bg',
  empty:
    'text-center flex items-center flex-col justify-center gap-3 min-h-[300px] text-muted rounded-2xl border border-line/80 bg-surface/50 p-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-text [&_p]:text-sm',
  modal:
    'p-0 border border-line rounded-2xl w-[min(540px,calc(100vw-32px))] max-h-[90dvh] overflow-hidden bg-surface text-text shadow-dropdown mx-auto my-auto [&.wide]:w-[min(760px,calc(100vw-32px))] [&::backdrop]:bg-black/50 [&::backdrop]:backdrop-blur-sm',
  'modal-content':
    'max-h-[calc(90dvh-2px)] overflow-y-auto overflow-x-hidden [overscroll-behavior:contain] [scrollbar-gutter:stable] [&>form>.modal-heading]:sticky [&>form>.modal-heading]:top-0 [&>form>.modal-heading]:z-10 [&>form>.modal-heading]:bg-surface/95 [&>form>.modal-heading]:backdrop-blur-md [&>form>.modal-footer]:sticky [&>form>.modal-footer]:bottom-0 [&>form>.modal-footer]:z-10',
  'modal-heading':
    'flex items-center justify-between p-6 border-b border-line gap-4 [&_h2]:font-sans [&_h2]:font-bold [&_h2]:text-xl sm:[&_h2]:text-2xl [&_h2]:text-text [&_h2]:mt-1',
  'icon-button':
    'inline-flex items-center justify-center bg-transparent border-0 text-muted p-2 rounded-xl transition-colors hover:bg-surface-soft hover:text-text',
  'editor-body': 'p-6 flex flex-col gap-5',
  required: 'hidden',
  'english-input': 'font-sans text-lg font-medium',
  segmented:
    'inline-flex bg-surface-soft p-1 rounded-xl border border-line [&_button]:flex [&_button]:items-center [&_button]:gap-1.5 [&_button]:border-0 [&_button]:bg-transparent [&_button]:text-xs [&_button]:font-medium [&_button]:px-3 [&_button]:py-1.5 [&_button]:rounded-lg [&_button]:text-muted [&_button.active]:bg-surface [&_button.active]:text-forest [&_button.active]:font-semibold [&_button.active]:shadow-xs',
  'selection-hint':
    'flex items-center gap-3 -mt-2 justify-between [&>span]:text-xs [&>span]:text-muted [&>span]:leading-relaxed [&>.text-button]:whitespace-nowrap max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-1',
  'highlights-editor':
    'bg-surface-soft p-4 rounded-xl border border-line flex flex-col gap-2.5 [&>div]:grid [&>div]:grid-cols-[1fr_auto] [&>div]:gap-2 [&_strong]:col-span-full [&_strong]:text-xs [&_strong]:font-semibold [&_strong]:text-forest [&_input]:text-xs',
  'modal-footer':
    'flex justify-between items-center gap-4 p-5 border-t border-line bg-surface-soft/60 backdrop-blur-md [&>span]:flex [&>span]:items-center [&>span]:gap-1.5 [&>span]:text-xs [&>span]:text-muted [&>div]:flex [&>div]:gap-2.5 max-[760px]:flex-wrap max-[760px]:[&>span]:hidden max-[760px]:[&>div]:ml-auto',
  error:
    'p-4 bg-status-danger-bg text-status-danger text-sm rounded-xl mb-3 leading-relaxed border border-status-danger/20 font-medium',
  toast:
    'fixed bottom-6 right-6 bg-surface border border-line text-text rounded-2xl py-3.5 px-5 flex gap-4 items-center shadow-dropdown z-50 max-w-[calc(100vw-32px)] w-max text-sm leading-relaxed backdrop-blur-md',
  'detail-topic':
    'block mt-1 text-xs font-semibold uppercase tracking-wider text-muted',
  'detail-body': 'p-6 max-[760px]:p-4',
  'detail-english':
    'font-sans text-2xl sm:text-3xl font-bold leading-relaxed text-text whitespace-pre-wrap break-words',
  'detail-section':
    'mt-6 [&>p]:text-sm sm:[&>p]:text-base [&>p]:leading-relaxed [&>p]:mt-2 [&>p]:text-text-secondary [&>p]:whitespace-pre-wrap [&>p]:break-words',
  'phrase-row':
    'py-3 border-b border-line [&_strong]:text-sm [&_strong]:font-semibold [&_strong]:text-forest [&>p]:text-xs [&>p]:leading-relaxed [&>p]:mt-1 [&>p]:text-muted',
  'notes-box': 'bg-surface-soft border-l-4 border-forest rounded-r-xl p-4',
  'status-select':
    'flex flex-row items-center justify-between mt-6 font-normal',
  danger: 'text-status-danger',
  'confirm-content':
    'p-6 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-text [&_h2]:mt-3 [&_h2]:mb-2 [&>p]:text-sm [&>p]:text-muted [&>p]:leading-relaxed [&_p.delete-preview]:bg-surface-soft [&_p.delete-preview]:p-3 [&_p.delete-preview]:rounded-lg [&_p.delete-preview]:my-3 [&_p.delete-preview]:italic [&_p.delete-preview]:border [&_p.delete-preview]:border-line',
  'confirm-actions': 'flex justify-end gap-2.5 mt-6',
  'danger-button':
    'bg-status-danger text-white hover:bg-status-danger/90 shadow-sm',
  'review-start':
    'bg-surface border border-line rounded-2xl p-8 sm:p-14 text-center flex items-center flex-col gap-4 max-w-2xl mx-auto my-6 shadow-xs [&_h2]:font-sans [&_h2]:text-2xl sm:[&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-text [&>p]:text-sm sm:[&>p]:text-base [&>p]:text-muted [&>p]:leading-relaxed',
  'review-symbol':
    'grid place-items-center size-20 bg-forest-soft text-forest rounded-2xl mb-2',
  'checkbox-label':
    'flex flex-row items-center text-sm font-normal my-2 [&_input]:accent-forest [&_input]:size-4.5',
  'review-session': 'max-w-2xl mx-auto my-5',
  'review-progress':
    'flex justify-between items-center text-xs font-semibold text-muted mb-2',
  flashcard:
    'bg-surface border border-line rounded-2xl p-8 sm:p-12 text-center min-h-[300px] shadow-sm transition-colors [&_h2]:font-sans [&_h2]:font-bold [&_h2]:text-2xl sm:[&_h2]:text-3xl [&_h2]:leading-relaxed [&_h2]:text-text [&_h2]:my-5 [&_h2]:whitespace-pre-wrap [&_h2]:break-words',
  'recall-hint': 'text-xs sm:text-sm text-muted mt-6',
  answer:
    'border-t border-line pt-6 mt-6 [&>p]:text-base sm:[&>p]:text-lg [&>p]:font-medium [&>p]:text-text [&>p]:mt-2 [&>p]:whitespace-pre-wrap [&>p.review-phrase]:text-sm [&>p.review-phrase]:text-left [&>p.review-phrase]:text-forest',
  'review-notes':
    'text-xs sm:text-sm leading-relaxed whitespace-pre-wrap bg-surface-soft p-4 rounded-xl mt-4 text-left border border-line',
  'grade-buttons': 'flex gap-3 justify-center mt-6 flex-wrap',
  'reveal-button': 'flex my-6 mx-auto',
  'backup-banner':
    'flex items-start gap-4 border border-line bg-surface-soft p-5 rounded-2xl text-forest mb-6 [&_strong]:text-sm [&_strong]:font-semibold [&_strong]:text-text [&_p]:text-xs sm:[&_p]:text-sm [&_p]:text-muted [&_p]:mt-1',
  'backup-grid': 'grid grid-cols-1 md:grid-cols-2 gap-5',
  'backup-card':
    'border border-line rounded-2xl bg-surface p-6 flex flex-col items-start shadow-xs transition-colors [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-text [&_h2]:mt-4 [&>p]:text-xs sm:[&>p]:text-sm [&>p]:text-muted [&>p]:leading-relaxed [&>p]:my-3 [&>.button]:mt-auto',
  'backup-count':
    'py-6 text-muted text-xs sm:text-sm [&_strong]:text-3xl [&_strong]:font-bold [&_strong]:text-forest [&_strong]:mr-2',
  'import-drop':
    'flex items-center flex-col gap-2 border border-dashed border-line rounded-xl bg-surface-soft p-6 w-full mb-4 text-xs sm:text-sm text-muted text-center',
  'backup-explanation':
    'mt-6 text-muted max-w-3xl [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-text [&_p]:text-xs sm:[&_p]:text-sm [&_p]:leading-relaxed [&_p]:mt-1.5',
  'success-result':
    'flex items-center gap-2 p-4 bg-status-learned-bg text-status-learned rounded-xl mt-4 text-xs sm:text-sm font-medium border border-status-learned/20',
  spin: 'animate-spin',
  lucide: 'shrink-0',
  'topic-name':
    'flex-1 min-w-0 overflow-hidden whitespace-nowrap text-ellipsis',
  'topic-count': 'shrink-0',
};

export const ui = (classes: string): string =>
  classes
    .split(/\s+/)
    .filter(Boolean)
    .map((name) => (styles[name] ? name + ' ' + styles[name] : name))
    .join(' ');
