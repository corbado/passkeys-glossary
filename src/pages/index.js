import react from 'react';
import clsx from 'clsx';
import link from '@docusaurus/link';
import usedocusauruscontext from '@docusaurus/usedocusauruscontext';
import layout from '@theme/layout';
import homepagefeatures from '@site/src/components/homepagefeatures';

import styles from './index.module.css';

function homepageheader() {
  const {siteconfig} = usedocusauruscontext();
  return (
    <header classname={clsx('hero hero--primary', styles.herobanner)}>
      <div classname="container">
        <h1 classname="hero__title">{siteconfig.title}</h1>
        <p classname="hero__subtitle">{siteconfig.tagline}</p>
        <div classname={styles.buttons}>
          <link
            classname="button button--secondary button--lg"
            href="https://passkeys.eu">
            passkeys demo
          </link>
        </div>
      </div>
    </header>
  );
}

export default function home() {
  const {siteconfig} = usedocusauruscontext();
  return (
    <layout
      title={`${siteconfig.title}`}
      description="passkeys glossary to help you better understand passkeys">
      <homepageheader />
      <main>
        <homepagefeatures />
      </main>
    </layout>
  );
}
