import { ui } from '@/styles/ui';
import { BookOpen } from 'lucide-react';

type LogoProps = {
  onClick: () => void;
};

const Logo = ({ onClick }: LogoProps) => (
  <a
    className={ui('brand')}
    href="#"
    aria-label="Phrasebook — Sổ bài học"
    onClick={(event) => {
      event.preventDefault();
      onClick();
    }}
  >
    <span className={ui('brand-icon')} aria-hidden="true">
      <BookOpen size={23} />
    </span>
    phrasebook<span className={ui('brand-period')}>.</span>
  </a>
);

export default Logo;
