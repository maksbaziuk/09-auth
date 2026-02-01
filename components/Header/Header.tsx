import Link from 'next/link';
import css from '@/components/Header/Header.module.css';
import { AuthNavigation } from '@/components/AuthNavigation/AuthNavigation';

function Header() {
  return (
    <header className={css.header}>
      <Link href="/" aria-label="Home">
        NoteHub
      </Link>
      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/notes/filter/all">Notes</Link>
          </li>
        </ul>
      </nav>
      <AuthNavigation />
    </header>
  );
}

export default Header;
