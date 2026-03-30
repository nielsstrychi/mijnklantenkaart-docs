import React, { useState } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Easy to Use',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    BackSvg: require('@site/static/img/logo.svg').default,
    description: (
      <>
        Docusaurus was designed from the ground up to be easily installed and
        used to get your website up and running quickly.
      </>
    ),
  },
  {
    title: 'Focus on What Matters',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    BackSvg: require('@site/static/img/logo.svg').default,
    description: (
      <>
        Docusaurus lets you focus on your docs, and we&apos;ll do the chores. Go
        ahead and move your docs into the <code>docs</code> directory.
      </>
    ),
  },
  {
    title: 'Powered by React',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    BackSvg: require('@site/static/img/logo.svg').default,
    description: (
      <>
        Extend or customize your website layout by reusing React. Docusaurus can
        be extended while reusing the same header and footer.
      </>
    ),
  },
];

function Feature({Svg, BackSvg, title, description}) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <div
          className={clsx(styles.flipContainer, { [styles.flipped]: isFlipped })}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className={styles.flipper}>
            <div className={styles.front}>
              <Svg className={styles.featureSvg} role="img" />
            </div>
            <div className={styles.back}>
              <BackSvg className={styles.featureSvg} role="img" />
            </div>
          </div>
        </div>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
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
