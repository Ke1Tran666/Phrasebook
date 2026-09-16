import { BookOpen } from 'lucide-react';

type LogoProps = {
  onClick: () => void;
};

const Logo = ({ onClick }: LogoProps) => (
  <a
    className="brand"
    href="#"
    aria-label="Phrasebook — Sổ bài học"
    onClick={(event) => {
      event.preventDefault();
      onClick();
    }}
  >
    <span className="brand-icon" aria-hidden="true">
      <BookOpen size={23} />
    </span>
    phrasebook<span className="brand-period">.</span>
  </a>
);

export default Logo;
