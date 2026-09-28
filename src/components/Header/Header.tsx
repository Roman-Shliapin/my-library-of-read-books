import Link from "next/link";
import css from "./Header.module.css";

export const Header = () => {
  return (
    <header className={css.header}>
      <div className={css.container}>
        <Link href="/" className={css.logo}>
          Моя бібліотека
        </Link>
        <Link href="/library/new" className={css.add}>
          + Книга
        </Link>
      </div>
    </header>
  );
};