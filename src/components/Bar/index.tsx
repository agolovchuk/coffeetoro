import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './sheet.css';

function Bar() {
  return (
    <nav>
      <ul className="bar__list">
        <li className="bar__item">
          <Link className="bar_home" to="/" />
        </li>
        <li className="bar__item">
          <NavLink className="bar__link bar_link_drink" to="/drink">Напитки</NavLink>
        </li>
        <li className="bar__item">
          <NavLink className="bar__link bar__link_dry" to="/dry">Развесное</NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default Bar;
