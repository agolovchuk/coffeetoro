import * as React from 'react';
import { Link } from 'react-router-dom';
import './sheet.css';

interface Props {
  title: string,
  to: string,
}

function Tile({ title, to }: Props) {
  return (
    <Link className="tile__container" to={to}>
      <h2 className="tile__title">{title}</h2>
    </Link>
  );
}

export default Tile;
