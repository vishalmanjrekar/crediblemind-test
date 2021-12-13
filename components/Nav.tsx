import React, { ReactElement } from 'react';
import Image from 'next/image';

import styles from '../styles/Navbar.module.css';

interface Props {
  menu: string;
  logoUrl: string;
}

function Nav({ logoUrl, menu }: Props): ReactElement {
  return (
    <div className={styles.container}>
      <Image
        width={180}
        height={80}
        src={`https:${logoUrl}`}
        alt="credible_mind_logo"
      />
      <div className={styles.menu}>{menu}</div>
    </div>
  );
}

export default Nav;
