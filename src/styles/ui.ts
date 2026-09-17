// Tailwind utilities for shared UI parts. Marker classes retain contextual/state selectors.
// Keep complete utility names here so Tailwind can discover every responsive variant.
const styles: Record<string, string> = {
  'app-shell': 'min-h-[100vh] flex [@media(max-width:760px)]:block',
  sidebar:
    'w-[244px] shrink-0 fixed [inset:0_auto_0_0] flex flex-col pt-8 pr-[22px] pb-5 pl-[22px] bg-[#fff] [border-right:1px_solid_var(--color-line)] overflow-auto [&_nav]:flex [&_nav]:flex-col [&_nav]:gap-[7px] [&_nav]:mt-[17px] [@media(max-width:1150px)]:w-[215px] [@media(max-width:1150px)]:pt-7 [@media(max-width:1150px)]:pr-[15px] [@media(max-width:1150px)]:pb-5 [@media(max-width:1150px)]:pl-[15px] [@media(max-width:760px)]:static [@media(max-width:760px)]:w-full [@media(max-width:760px)]:pt-4.5 [@media(max-width:760px)]:pr-5 [@media(max-width:760px)]:pb-0 [@media(max-width:760px)]:pl-5 [@media(max-width:760px)]:[border-right:0] [@media(max-width:760px)]:[border-bottom:1px_solid_var(--color-line)] [@media(max-width:760px)]:overflow-visible [@media(max-width:760px)]:[&>.sidebar-caption]:hidden [@media(max-width:760px)]:[&_nav]:mt-0 [@media(max-width:760px)]:[&_nav]:mr-0 [@media(max-width:760px)]:[&_nav]:mb-0 [@media(max-width:760px)]:[&_nav]:ml-0 [@media(max-width:760px)]:[&_nav]:gap-1.5 [@media(max-width:760px)]:[&_nav]:pb-3 [@media(max-width:760px)]:[&_nav]:grid [@media(max-width:760px)]:[&_nav]:grid-cols-3 [@media(max-width:760px)]:[&_nav]:items-stretch',
  brand:
    'flex items-center [font-weight:750] tracking-[-1px] text-[length:25px] gap-[9px] mt-0 mr-0 mb-[52px] ml-0 [@media(max-width:1150px)]:text-[length:23px] [@media(max-width:760px)]:text-[length:24px] [@media(max-width:760px)]:mt-0 [@media(max-width:760px)]:mr-0 [@media(max-width:760px)]:mb-[17px] [@media(max-width:760px)]:ml-0',
  'brand-icon':
    'bg-[var(--color-forest)] text-[var(--color-lime)] h-9 w-9 rounded-[11px] grid place-items-center [@media(max-width:760px)]:w-[34px] [@media(max-width:760px)]:h-[34px] shrink-0',
  'brand-period': 'ml-[-9px] text-[#829d53]',
  'sidebar-caption':
    'text-[length:12px]! tracking-[1.6px] font-bold text-[#85918b] pl-3',
  'nav-item':
    'flex items-center gap-3 border-0 text-left bg-transparent text-[#66746c] pt-[13px] pr-3 pb-[13px] pl-3 rounded-[8px] text-[length:14px] font-semibold [&.selected]:bg-[var(--color-forest)] [&.selected]:text-[#fff] [&:hover:not(.selected)]:bg-[#f0f4f1] [&>span]:ml-auto [&>span]:bg-[#ffffff20] [&>span]:text-[length:12px] [&>span]:pt-0.5 [&>span]:pr-1.5 [&>span]:pb-0.5 [&>span]:pl-1.5 [&>span]:rounded-[4px] [@media(max-width:760px)]:pt-2.5 [@media(max-width:760px)]:pr-3 [@media(max-width:760px)]:pb-2.5 [@media(max-width:760px)]:pl-3 [@media(max-width:760px)]:text-[length:13px] [@media(max-width:760px)]:gap-[7px] [@media(max-width:760px)]:flex-1 [@media(max-width:760px)]:justify-center [@media(max-width:760px)]:[&_svg]:w-[17px] [@media(max-width:760px)]:[&_svg]:h-[17px] [@media(max-width:760px)]:[&>span]:hidden min-w-0 [@media(max-width:760px)]:flex-col [@media(max-width:760px)]:whitespace-normal [@media(max-width:760px)]:text-center [@media(max-width:760px)]:px-1 [@media(max-width:760px)]:leading-snug',
  'sidebar-topics':
    'mt-9 [&>p]:text-[length:13px] [&>p]:leading-[1.7] [&>p]:text-[#87928b] [&>p]:pt-[15px] [&>p]:pr-3 [&>p]:pb-[15px] [&>p]:pl-3 [@media(max-width:760px)]:hidden',
  'topic-nav':
    'border-0 bg-transparent flex gap-2.5 items-center w-full text-left pt-3 pr-3 pb-3 pl-3 mt-[3px] text-[length:14px] text-[#65776c] rounded-[7px] [&.chosen]:bg-[#f0f4f1] [&:hover]:bg-[#f0f4f1] [&>span:last-child]:ml-auto [&>span:last-child]:text-[length:12px] [&>span:last-child]:text-[#8b968f] min-w-0',
  'topic-dot':
    'h-[7px] w-[7px] shrink-0 [border:1.5px_solid_#94a78b] rounded-[50%]',
  'local-card':
    'mt-auto pt-5 pr-[15px] pb-5 pl-[15px] bg-[#f2f6f0] [border:1px_solid_#e7ece1] rounded-[10px] [&_strong]:text-[length:14px] [&_p]:text-[length:12px] [&_p]:leading-[1.75] [&_p]:text-[#75836f] [&_p]:mt-[9px] [&_button]:flex [&_button]:items-center [&_button]:gap-[5px] [&_button]:pt-0 [&_button]:pr-0 [&_button]:pb-0 [&_button]:pl-0 [&_button]:bg-transparent [&_button]:border-0 [&_button]:text-[length:12px] [&_button]:font-semibold [&_button]:text-[#3e613e] [&_button]:mt-[15px] [@media(max-width:760px)]:hidden',
  'local-icon': 'block mb-3 text-[#4c6a47]',
  'sidebar-bottom':
    'flex items-center gap-[11px] pt-[23px] mt-5 [border-top:1px_solid_var(--color-line)] text-[length:14px] [&_small]:block [&_small]:text-[length:12px] [&_small]:text-[#8c948e] [&_small]:mt-1 [@media(max-width:760px)]:hidden',
  avatar:
    'bg-[#f0e9dc] text-[#6a604b] grid place-items-center w-[34px] h-[34px] rounded-[50%] font-sans text-[length:19px]',
  'main-content':
    'ml-[244px] flex-1 min-w-[0] [@media(max-width:1150px)]:ml-[215px] [@media(max-width:760px)]:ml-0',
  topbar:
    'h-[76px] bg-[#ffffffb8] [border-bottom:1px_solid_var(--color-line)] flex justify-between items-center pt-0 pr-[42px] pb-0 pl-[42px] text-[length:14px] text-[#87928b] [&>div]:flex [&>div]:items-center [&>div]:gap-3 [&_strong]:font-medium [&_strong]:text-[#4b5a51] [@media(max-width:1150px)]:pt-0 [@media(max-width:1150px)]:pr-[26px] [@media(max-width:1150px)]:pb-0 [@media(max-width:1150px)]:pl-[26px] [@media(max-width:760px)]:h-12 [@media(max-width:760px)]:pt-0 [@media(max-width:760px)]:pr-[22px] [@media(max-width:760px)]:pb-0 [@media(max-width:760px)]:pl-[22px] [@media(max-width:760px)]:text-[length:12px]',
  'local-label':
    'flex items-center gap-[7px] bg-[#edf3ed] pt-1.5 pr-2.5 pb-1.5 pl-2.5 rounded-[20px] text-[#62785f]',
  workspace:
    'max-w-[1370px] mt-auto mr-auto mb-auto ml-auto pt-[44px] pr-[42px] pb-[25px] pl-[42px] [@media(min-width:1550px)]:pt-[55px] [@media(max-width:1150px)]:pt-8 [@media(max-width:1150px)]:pr-[26px] [@media(max-width:1150px)]:pb-[25px] [@media(max-width:1150px)]:pl-[26px] [@media(max-width:760px)]:pt-7 [@media(max-width:760px)]:pr-5 [@media(max-width:760px)]:pb-[22px] [@media(max-width:760px)]:pl-5',
  'page-heading':
    'flex items-center justify-between gap-[25px] mb-[31px] [&_h1]:font-sans [&_h1]:text-[length:47px] [&_h1]:leading-[1.3] [&_h1]:font-normal [&_h1]:tracking-[-1.5px] [&_h1]:mt-2 [&_h1>span]:text-[#7e9f4f] [&_p]:text-[length:16px] [&_p]:text-[#7b847f] [&_p]:mt-2.5 [&_p]:leading-[1.6] [@media(max-width:1150px)]:[&_h1]:text-[length:42px] [@media(max-width:760px)]:items-start [@media(max-width:760px)]:flex-wrap [@media(max-width:760px)]:gap-4.5 [@media(max-width:760px)]:mb-6 [@media(max-width:760px)]:[&_h1]:text-[length:39px] [@media(max-width:760px)]:[&_p]:text-[length:14px] [@media(max-width:760px)]:[&_p]:max-w-[320px] [@media(max-width:760px)]:[&>.button]:pt-2.5 [@media(max-width:760px)]:[&>.button]:pr-3.5 [@media(max-width:760px)]:[&>.button]:pb-2.5 [@media(max-width:760px)]:[&>.button]:pl-3.5 [@media(max-width:760px)]:[&>.button]:min-h-[40px]',
  eyebrow:
    'text-[length:12px]! font-bold tracking-[1.7px] text-[#758371] block [@media(max-width:760px)]:text-[length:10px]! [@media(max-width:760px)]:tracking-[1.4px]',
  button:
    'inline-flex items-center justify-center gap-[9px] pt-3 pr-4.5 pb-3 pl-4.5 [border:1px_solid_transparent] rounded-[8px] whitespace-nowrap text-[length:14px] font-semibold min-h-[43px] [&.primary]:bg-[var(--color-forest)] [&.primary]:text-[white] [&.primary]:[box-shadow:0_3px_5px_#1533210c] [&.primary:hover]:bg-[#163e2d] [&.secondary]:bg-[#fff] [&.secondary]:[border-color:#dce4de] [&.secondary]:text-[#4b6052] [&.secondary:hover]:bg-[#f3f6f3]',
  stats:
    'grid grid-cols-3 gap-2 mb-7 min-[761px]:gap-2.5 min-[761px]:mb-[37px] min-[1151px]:gap-[17px]',
  'stat-icon':
    'w-[43px] h-[43px] inline-grid place-items-center rounded-[10px] shrink-0 [@media(max-width:760px)]:w-[34px] [@media(max-width:760px)]:h-[34px] [@media(max-width:760px)]:rounded-[8px]',
  green: 'text-[#4f7757] bg-[#edf4eb]',
  amber: 'text-[#b08137] bg-[#fbf2e3]',
  blue: 'text-[#5c81a1] bg-[#eaf1fa]',
  red: 'text-[#a44e45] bg-[#fff0ed]',
  'library-toolbar':
    'flex justify-between items-center [border-bottom:1px_solid_var(--color-line)] mb-[21px] [&>.text-button]:pb-5 [@media(max-width:760px)]:[&>.text-button]:text-[length:12px] flex-wrap gap-3',
  'tab-group':
    'flex gap-[27px] flex-wrap [&_button]:pt-0 [&_button]:pr-0 [&_button]:pb-[15px] [&_button]:pl-0 [&_button]:bg-transparent [&_button]:border-0 [&_button]:[border-bottom:2px_solid_transparent] [&_button]:text-[#839088] [&_button]:flex [&_button]:gap-2 [&_button]:items-center [&_button]:text-[length:14px] [&_button.active]:text-[var(--color-forest)] [&_button.active]:[border-bottom-color:var(--color-forest)] [&_button.active]:font-semibold [&_button_span]:bg-[#e5ece5] [&_button_span]:pt-0.5 [&_button_span]:pr-1.5 [&_button_span]:pb-0.5 [&_button_span]:pl-1.5 [&_button_span]:rounded-[4px] [&_button_span]:text-[length:11px] [@media(max-width:760px)]:gap-[17px] [@media(max-width:760px)]:[&_button]:text-[length:13px] min-w-0 gap-y-2',
  'text-button':
    'inline-flex items-center justify-center gap-[7px] bg-transparent border-0 text-[#5c7562] text-[length:14px] pt-2 pr-0 pb-2 pl-0 font-medium [&:hover]:text-[#173e28]',
  'first-lesson':
    'grid [grid-template-columns:1fr_0.9fr] items-center gap-[45px] bg-[#fff] [border:1px_solid_var(--color-line)] rounded-[12px] mt-6 pt-[42px] pr-12 pb-[42px] pl-12 min-h-[376px] [@media(min-width:1550px)]:min-h-[430px] [@media(max-width:1150px)]:pt-8 [@media(max-width:1150px)]:pr-8 [@media(max-width:1150px)]:pb-8 [@media(max-width:1150px)]:pl-8 [@media(max-width:1150px)]:gap-[25px] [@media(max-width:760px)]:[grid-template-columns:1fr] [@media(max-width:760px)]:pt-7 [@media(max-width:760px)]:pr-7 [@media(max-width:760px)]:pb-7 [@media(max-width:760px)]:pl-7 [@media(max-width:760px)]:gap-[34px]',
  'first-copy':
    '[&_h2]:font-sans [&_h2]:text-[length:34px] [&_h2]:leading-[1.25] [&_h2]:font-normal [&_h2]:tracking-[-0.7px] [&_h2]:mt-[17px] [&_h2]:mr-0 [&_h2]:mb-[17px] [&_h2]:ml-0 [&>p]:text-[length:16px] [&>p]:text-[#7b877f] [&>p]:leading-[1.8] [&>p]:max-w-[355px] [&>p]:mb-[22px] [@media(max-width:1150px)]:[&_h2]:text-[length:30px] [@media(max-width:760px)]:[&_h2]:text-[length:32px] [@media(max-width:760px)]:[&>p]:text-[length:15px] min-w-0',
  'examples-button': 'flex mt-[9px] text-[length:12px] text-[#7a8778]',
  'sample-note':
    '[border:1px_solid_#dfe6d8] rounded-[5px] pt-[25px] pr-[30px] pb-[25px] pl-[30px] bg-[#fbfcf6] [box-shadow:7px_7px_0_#f0f3e9] transform-none max-w-[340px] [justify-self:center] w-full [@media(max-width:1150px)]:pt-[22px] [@media(max-width:1150px)]:pr-[22px] [@media(max-width:1150px)]:pb-[22px] [@media(max-width:1150px)]:pl-[22px] [@media(max-width:760px)]:max-w-[360px] [@media(max-width:760px)]:w-full [@media(max-width:760px)]:[justify-self:center] min-w-0',
  'sample-label':
    'flex items-center gap-[7px] text-[#899375] text-[length:12px]! tracking-[1.2px] font-bold leading-[1.5]',
  'sample-english':
    'font-sans text-[length:31px] leading-[1.45] mt-4.5 text-[#30432b] [&_mark]:bg-[#e6efba] [&_mark]:text-inherit [&_mark]:[box-decoration-break:clone] [&_mark]:pt-0 [&_mark]:pr-0.5 [&_mark]:pb-0 [&_mark]:pl-0.5 [@media(max-width:760px)]:text-[length:30px]',
  'sample-meaning':
    'text-[length:14px] text-[#8d9483] mt-2 mr-0 mb-[19px] ml-0',
  'sample-rule':
    '[border-top:1px_solid_#e5e9da] pt-[15px] mb-4 [&>span]:text-[length:12px] [&>span]:tracking-[1.2px] [&>span]:text-[#8e997e] [&>span]:block [&>span]:mb-[7px] [&_strong]:text-[length:14px] [&_strong]:text-[#617053] [&>p]:text-[length:14px] [&>p]:text-[#909781] [&>p]:mt-[5px] [@media(max-width:760px)]:mb-[17px]',
  'topic-chip':
    '[display:inline-block] text-[length:12px] bg-[#f2f4f1] text-[#7c8879] pt-[5px] pr-2 pb-[5px] pl-2 rounded-[5px] max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap',
  'results-caption':
    'flex justify-between text-[length:12px] text-[#8a968d] mt-[23px] mr-0 mb-[15px] ml-0 [&>span]:text-[length:11px] [@media(max-width:760px)]:[&>span]:hidden',
  'lesson-grid':
    'grid [grid-template-columns:repeat(3,_minmax(0,_1fr))] gap-[17px] [@media(max-width:1150px)]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [@media(max-width:760px)]:[grid-template-columns:1fr]',
  'lesson-card':
    'bg-[#fff] [border:1px_solid_var(--color-line)] rounded-[10px] pt-[22px] pr-[21px] pb-[22px] pl-[21px] flex flex-col text-left min-h-[260px] [&:hover]:[border-color:#99b299] [&:hover]:[box-shadow:0_5px_20px_#233c2408] [&_h2]:font-sans [&_h2]:text-[length:24px] [&_h2]:leading-[1.45] [&_h2]:font-normal [&_h2]:text-[#354c3c] [&_h2]:[display:-webkit-box] [&_h2]:[-webkit-line-clamp:3] [&_h2]:[-webkit-box-orient:vertical] [&_h2]:overflow-hidden [&_h2]:[overflow-wrap:anywhere] [&_h2.passage-title]:text-[length:19px] [@media(min-width:1550px)]:min-h-[290px] [@media(max-width:760px)]:min-h-[245px] [@media(max-width:760px)]:pt-6 [@media(max-width:760px)]:pr-6 [@media(max-width:760px)]:pb-6 [@media(max-width:760px)]:pl-6 [@media(max-width:760px)]:[&_h2]:text-[length:25px]',
  'card-top': 'flex justify-between items-center text-[#a5b0a7] mb-[23px]',
  'type-label':
    'flex items-center gap-1.5 text-[length:14px] text-[#89917e] [&.passage]:text-[#8193a6] [&.structure]:text-[#6b4b91]',
  'card-meaning':
    'text-[length:14px] text-[#8c958f] leading-[1.7] mt-2.5 [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden [@media(max-width:760px)]:text-[length:15px]',
  'card-highlights':
    'flex gap-1.5 items-center text-[#8d987c] text-[length:12px] mt-3.5',
  'card-footer': 'mt-auto pt-[23px] flex gap-2 justify-between items-center',
  status:
    'text-[length:12px] whitespace-nowrap inline-flex items-center gap-[3px] [&.new]:text-[#8f9a93] [&.review]:text-[#b18b4b] [&.learned]:text-[#5c8666]',
  empty:
    'text-center flex items-center flex-col justify-center gap-4 min-h-[320px] text-[#82917f] [&_h2]:text-[length:22px] [&_h2]:text-[var(--color-forest)] [&_p]:text-[length:14px]',
  modal:
    'pt-0 pr-0 pb-0 pl-0 [border:1px_solid_var(--color-line)] rounded-[16px] w-[min(500px,_calc(100vw_-_32px))] max-h-[90dvh] overflow-hidden bg-[#fff] text-[#2a3e30] [box-shadow:0_30px_100px_#07190b33] mt-auto mr-auto mb-auto ml-auto [&.wide]:w-[min(760px,_calc(100vw_-_32px))] [&::backdrop]:bg-[#0d261e70] [&::backdrop]:[backdrop-filter:blur(3px)]',
  'modal-content':
    'max-h-[calc(90dvh_-_2px)] overflow-y-auto overflow-x-hidden [overscroll-behavior:contain] [scrollbar-gutter:stable] [&>form>.modal-heading]:sticky [&>form>.modal-heading]:top-0 [&>form>.modal-heading]:z-[2] [&>form>.modal-heading]:bg-[#fff] [&>form>.modal-footer]:sticky [&>form>.modal-footer]:bottom-0 [&>form>.modal-footer]:z-[2] [&_input]:[scroll-margin-block:120px] [&_textarea]:[scroll-margin-block:120px] [&_button]:[scroll-margin-block:120px]',
  'modal-heading':
    'flex items-center justify-between pt-[26px] pr-[30px] pb-[22px] pl-[30px] [border-bottom:1px_solid_var(--color-line)] gap-4.5 [&_h2]:font-sans [&_h2]:font-normal [&_h2]:text-[length:27px] [&_h2]:mt-[9px] [@media(max-width:760px)]:pt-[22px] [@media(max-width:760px)]:pr-[22px] [@media(max-width:760px)]:pb-[22px] [@media(max-width:760px)]:pl-[22px] [@media(max-width:760px)]:[&_h2]:text-[length:24px]',
  'icon-button':
    'inline-flex items-center justify-center bg-transparent border-0 text-[#87968a] pt-1.5 pr-1.5 pb-1.5 pl-1.5 rounded-[6px] [&:hover]:bg-[#eef3ec]',
  'editor-body':
    'pt-[25px] pr-[30px] pb-[25px] pl-[30px] flex flex-col gap-5 [@media(max-width:760px)]:pt-[22px] [@media(max-width:760px)]:pr-[22px] [@media(max-width:760px)]:pb-[22px] [@media(max-width:760px)]:pl-[22px]',
  required: 'hidden',
  'english-input': 'font-sans text-[length:20px]',
  segmented:
    'flex bg-[#f1f4f1] pt-1 pr-1 pb-1 pl-1 rounded-[8px] [align-self:flex-start] flex-wrap [&_button]:flex [&_button]:items-center [&_button]:gap-[7px] [&_button]:border-0 [&_button]:bg-transparent [&_button]:text-[length:13px] [&_button]:pt-[9px] [&_button]:pr-[13px] [&_button]:pb-[9px] [&_button]:pl-[13px] [&_button]:rounded-[6px] [&_button]:text-[#7d8a80] [&_button.active]:bg-[white] [&_button.active]:text-[#315b3c] [&_button.active]:[box-shadow:0_1px_4px_#133c1010]',
  'selection-hint':
    'flex items-center gap-3 mt-[-12px] justify-between [&>span]:text-[length:12px] [&>span]:text-[#8f9b91] [&>span]:max-w-[330px] [&>span]:leading-[1.7] [&>.text-button]:whitespace-nowrap [@media(max-width:760px)]:items-start [@media(max-width:760px)]:flex-col [@media(max-width:760px)]:gap-0',
  'highlights-editor':
    'bg-[#f8faf4] pt-3 pr-3 pb-3 pl-3 rounded-[8px] flex flex-col gap-2.5 [&>div]:grid [&>div]:[grid-template-columns:1fr_auto] [&>div]:gap-[7px] [&_strong]:[grid-column:1/-1] [&_strong]:text-[length:14px] [&_strong]:text-[#6a7c4d] [&_input]:text-[length:13px]',
  'modal-footer':
    'flex justify-between items-center gap-[15px] pt-5 pr-[30px] pb-5 pl-[30px] [border-top:1px_solid_var(--color-line)] bg-[#fbfcfa] [&>span]:flex [&>span]:items-center [&>span]:gap-1.5 [&>span]:text-[length:12px] [&>span]:text-[#8b998d] [&>div]:flex [&>div]:gap-[9px] [@media(max-width:760px)]:pt-4 [@media(max-width:760px)]:pr-[22px] [@media(max-width:760px)]:pb-4 [@media(max-width:760px)]:pl-[22px] [@media(max-width:760px)]:flex-wrap [@media(max-width:760px)]:[&>span]:hidden [@media(max-width:760px)]:[&>div]:ml-auto',
  error:
    'pt-3.5 pr-3.5 pb-3.5 pl-3.5 bg-[#fff0ed] text-[#a0493d] text-[length:14px] rounded-[7px] mb-3 leading-[1.6]',
  toast:
    'fixed bottom-[25px] right-[25px] bg-[#183b2b] text-[#fff] [border:1px_solid_#365843] rounded-[10px] pt-3.5 pr-[17px] pb-3.5 pl-[17px] flex gap-5 items-center [box-shadow:0_8px_40px_#10281833] z-[100] max-w-[calc(100vw_-_30px)] w-[max-content] text-[length:14px] leading-[1.6] [&_.icon-button]:text-[#cbdbc9] [@media(max-width:760px)]:right-[15px] [@media(max-width:760px)]:bottom-[15px] [@media(max-width:760px)]:text-[length:13px] [&>span]:min-w-0 [&>span]:[overflow-wrap:anywhere] [&>button]:shrink-0',
  'detail-topic': 'block mt-2 text-[length:14px] text-[#71836e]',
  'detail-body':
    'pt-[30px] pr-[30px] pb-[30px] pl-[30px] [@media(max-width:760px)]:pt-[22px] [@media(max-width:760px)]:pr-[22px] [@media(max-width:760px)]:pb-[22px] [@media(max-width:760px)]:pl-[22px]',
  'detail-english':
    'font-sans text-[length:30px] leading-[1.65] font-normal whitespace-pre-wrap [overflow-wrap:anywhere] [@media(max-width:760px)]:text-[length:26px]',
  'detail-section':
    'mt-7 [&>p]:text-[length:16px] [&>p]:leading-[1.85] [&>p]:mt-3 [&>p]:text-[#67776a] [&>p]:whitespace-pre-wrap [&>p]:[overflow-wrap:anywhere] [@media(max-width:760px)]:[&>p]:text-[length:16px]',
  'phrase-row':
    'pt-3.5 pr-0 pb-3.5 pl-0 [border-bottom:1px_solid_var(--color-line)] [&_strong]:text-[length:16px] [&_strong]:text-[#577140] [&>p]:text-[length:14px] [&>p]:leading-[1.7] [&>p]:mt-1.5 [&>p]:whitespace-pre-wrap [&>p]:[overflow-wrap:anywhere]',
  'notes-box':
    'bg-[#f5f7ef] [border-left:3px_solid_#b8c797] pt-5 pr-5 pb-5 pl-5',
  'status-select':
    'flex flex-row items-center justify-between mt-7 font-normal',
  danger: 'text-[#ac6258]',
  'confirm-content':
    'pt-[30px] pr-[30px] pb-[30px] pl-[30px] [&_h2]:text-[length:25px] [&_h2]:font-sans [&_h2]:font-normal [&_h2]:mt-5 [&_h2]:mr-0 [&_h2]:mb-3.5 [&_h2]:ml-0 [&>p]:text-[length:16px] [&>p]:leading-[1.8] [&>p]:text-[#788778] [&>p]:[overflow-wrap:anywhere] [&_p.delete-preview]:bg-[#f6f7f3] [&_p.delete-preview]:pt-3 [&_p.delete-preview]:pr-3 [&_p.delete-preview]:pb-3 [&_p.delete-preview]:pl-3 [&_p.delete-preview]:rounded-[6px] [&_p.delete-preview]:mb-2.5 [&_p.delete-preview]:[font-style:italic] [&_p.delete-preview]:max-h-[100px] [&_p.delete-preview]:overflow-auto [@media(max-width:760px)]:pt-[25px] [@media(max-width:760px)]:pr-[25px] [@media(max-width:760px)]:pb-[25px] [@media(max-width:760px)]:pl-[25px]',
  'confirm-actions': 'flex justify-end gap-2.5 mt-[25px]',
  'danger-button': 'bg-[#a44e45] text-[#fff]',
  'review-start':
    'bg-[white] [border:1px_solid_var(--color-line)] rounded-[15px] pt-16 pr-[30px] pb-16 pl-[30px] text-center flex items-center flex-col gap-5 max-w-[850px] mt-[30px] mr-auto mb-[30px] ml-auto [&_h2]:font-sans [&_h2]:text-[length:33px] [&_h2]:font-normal [&>p]:text-[length:16px] [&>p]:text-[#899582] [&>p]:leading-[1.7] [@media(max-width:760px)]:pt-[38px] [@media(max-width:760px)]:pr-[22px] [@media(max-width:760px)]:pb-[38px] [@media(max-width:760px)]:pl-[22px] [@media(max-width:760px)]:[&_h2]:text-[length:29px]',
  'review-symbol':
    'grid place-items-center w-[85px] h-[85px] bg-[#edf3df] text-[#5c7747] rounded-[25px] mb-2',
  'checkbox-label':
    'flex flex-row items-center text-[length:14px] font-normal mt-[5px] mr-0 mb-[9px] ml-0 [&_input]:[accent-color:var(--color-forest)] [&_input]:w-[17px] [&_input]:h-[17px]',
  'review-session': 'max-w-[850px] mt-5 mr-auto mb-5 ml-auto',
  'review-progress':
    'flex justify-between items-center text-[length:14px] text-[#7c8a7d] [@media(max-width:760px)]:text-[length:12px]',
  flashcard:
    'bg-[#fff] [border:1px_solid_var(--color-line)] rounded-[14px] pt-10 pr-[45px] pb-10 pl-[45px] text-center min-h-[315px] [&_h2]:font-sans [&_h2]:font-normal [&_h2]:text-[length:32px] [&_h2]:leading-[1.6] [&_h2]:mt-[23px] [&_h2]:whitespace-pre-wrap [&_h2]:[overflow-wrap:anywhere] [@media(max-width:760px)]:pt-7 [@media(max-width:760px)]:pr-[23px] [@media(max-width:760px)]:pb-7 [@media(max-width:760px)]:pl-[23px] [@media(max-width:760px)]:[&_h2]:text-[length:27px]',
  'recall-hint': 'text-[length:14px] text-[#9aa58f] mt-[30px]',
  answer:
    '[border-top:1px_solid_var(--color-line)] pt-7 mt-7 [&>p]:text-[length:18px] [&>p]:leading-[1.7] [&>p]:mt-3 [&>p]:whitespace-pre-wrap [&>p.review-phrase]:text-[length:14px] [&>p.review-phrase]:text-left [&>p.review-phrase]:text-[#667853]',
  'review-notes':
    'text-[length:14px] leading-[1.8] whitespace-pre-wrap bg-[#f6f8f1] pt-4.5 pr-4.5 pb-4.5 pl-4.5 mt-5 text-left',
  'grade-buttons': 'flex gap-[15px] justify-center mt-6',
  'reveal-button': 'flex mt-6 mr-auto mb-6 ml-auto',
  'backup-banner':
    'flex items-start gap-5 [border:1px_solid_#dfe8d5] bg-[#f0f5e9] pt-[25px] pr-[25px] pb-[25px] pl-[25px] rounded-[10px] text-[#63804f] mb-[26px] [&_svg]:shrink-0 [&_strong]:text-[length:15px] [&_p]:text-[length:16px] [&_p]:leading-[1.8] [&_p]:text-[#839274] [&_p]:mt-[7px] [&_p]:max-w-[800px] [@media(max-width:760px)]:pt-5 [@media(max-width:760px)]:pr-5 [@media(max-width:760px)]:pb-5 [@media(max-width:760px)]:pl-5 [@media(max-width:760px)]:gap-3 [@media(max-width:760px)]:[&_p]:text-[length:14px]',
  'backup-grid':
    'grid [grid-template-columns:1fr_1fr] gap-6 [@media(max-width:760px)]:[grid-template-columns:1fr]',
  'backup-card':
    '[border:1px_solid_var(--color-line)] rounded-[12px] bg-[#fff] pt-8 pr-8 pb-8 pl-8 flex flex-col items-start [&_h2]:font-sans [&_h2]:text-[length:28px] [&_h2]:font-normal [&_h2]:mt-5 [&>p]:text-[length:16px] [&>p]:text-[#85917f] [&>p]:leading-[1.8] [&>p]:mt-[15px] [&>p]:mr-0 [&>p]:mb-[22px] [&>p]:ml-0 [&>.button]:mt-auto [@media(max-width:760px)]:pt-[25px] [@media(max-width:760px)]:pr-[25px] [@media(max-width:760px)]:pb-[25px] [@media(max-width:760px)]:pl-[25px]',
  'backup-count':
    'pt-[35px] pr-0 pb-[35px] pl-0 text-[#90a080] text-[length:14px] [&_strong]:text-[length:38px] [&_strong]:text-[#567346] [&_strong]:mr-[9px] [@media(max-width:760px)]:pt-5 [@media(max-width:760px)]:pr-0 [@media(max-width:760px)]:pb-[30px] [@media(max-width:760px)]:pl-0',
  'import-drop':
    'flex items-center flex-col gap-2 [border:1px_dashed_#ccd8c2] rounded-[8px] bg-[#fafcf7] pt-[22px] pr-[22px] pb-[22px] pl-[22px] w-full mb-5 text-[length:14px] text-[#829875] [&_small]:text-[length:12px] [&_small]:text-[#a0ad95]',
  'backup-explanation':
    'mt-7 text-[#84927d] max-w-[900px] [&_h3]:text-[length:15px] [&_h3]:text-[#637758] [&_p]:text-[length:16px] [&_p]:leading-[1.8] [&_p]:mt-[9px]',
  'success-result':
    'flex items-center gap-2.5 pt-5 pr-5 pb-5 pl-5 bg-[#eaf4e4] rounded-[8px] mt-5 text-[#557a40] text-[length:14px]',
  spin: 'animate-spin',
  lucide: 'shrink-0',
  'topic-name':
    'flex-1 min-w-[0] overflow-hidden whitespace-nowrap text-ellipsis',
  'topic-count': 'shrink-0',
};

export const ui = (classes: string): string =>
  classes
    .split(/\s+/)
    .filter(Boolean)
    .map((name) => (styles[name] ? name + ' ' + styles[name] : name))
    .join(' ');
