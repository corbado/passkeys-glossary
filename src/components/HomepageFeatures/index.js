import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Great UX',
    Svg: require('@site/static/img/great-ux.svg').default,
    description: (
      <>
        Let your users log into your website with Face ID or Touch ID.
      </>
    ),
  },
  {
    title: 'Secure',
    Svg: require('@site/static/img/secure.svg').default,
    description: (
      <>
        Prevent any password-based attack, like phishing or credential stuffing.
      </>
    ),
  },
  {
    title: 'Based on open standards',
    Svg: require('@site/static/img/FIDO-Alliance_logo.svg').default,
    description: (
      <>
       Developed by the <a href="https://fidoalliance.org/">FIDO Alliance</a>, passkeys are backed by the largest companies.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
