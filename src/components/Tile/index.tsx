import * as React from 'react';
import { Link } from 'react-router-dom';
import styles from './tile.module.css';

const logos = {
  coffee: require('./images/Coffee.svg'),
  tea: require('./images/Tea.svg'),
  dessert: require('./images/Desert.svg'),
  drink: require('./images/Water.svg'),
  users: require('./images/users.svg'),
  pc: require('./images/pc.svg'),
} as Record<string, any>

interface Props {
  title: string;
  to: string;
  name: string;
}

function Tile({ title, to, name }: Props) {
  const imageSrc = logos[name];
  return (
    <Link className={styles.container} to={to}>
      <h2 className={styles.title}>{title}</h2>
      {
        imageSrc ? (
          <img src={imageSrc} alt={name} className={styles.logo} />
        ) : null
      }
    </Link>
  );
}

export default Tile;
