import * as React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import sinon from 'sinon';

import Quantity from './index';

Enzyme.configure({ adapter: new Adapter() });

describe('Quantity', () => {
  let onChange;
  const quantity = 2;
  beforeEach(() => {
    onChange = sinon.spy();
  });

  it('Should be rendered correct', () => {
    const element = shallow(
      <Quantity quantity={quantity} onChange={onChange} />
    )
    expect(toJson(element)).toMatchSnapshot();
  });

  it('Should be have an active element', () => {
    const element = shallow(
      <Quantity quantity={quantity} onChange={onChange} />
    )
    expect(element.find('button.minus')).toHaveLength(1);
    expect(element.find('button.plus')).toHaveLength(1);
    expect(element.find('input')).toHaveLength(1);
    expect(element.find('input').props().value).toEqual(quantity);
  })

  it('Should called when clicked Plus', () => {
    const element = shallow(
      <Quantity quantity={quantity} onChange={onChange} />
    )
    const plus = element.find('button.plus');
    plus.simulate('click');
    expect(onChange.called).toBeTruthy();
    expect(onChange.args[0][0]).toEqual(quantity + 1);
  });

  it('Should called when click Minus', () => {
    const element = shallow(
      <Quantity quantity={quantity} onChange={onChange} />
    )
    const minus = element.find('button.minus');
    minus.simulate('click');
    expect(onChange.called).toBeTruthy();
    expect(onChange.args[0][0]).toEqual(quantity - 1);
  });

  it('Should be send correct value when change input', () => {
    const element = shallow(
      <Quantity quantity={quantity} onChange={onChange} />
    )
    const input = element.find('input');
    input.simulate('change', { target: { value: '6' } });
    expect(onChange.args[0][0]).toEqual(6);
    input.simulate('change', { target: { value: '' } });
    expect(onChange.args[0][0]).toEqual(6);
    input.simulate('change', { target: { value: 'f' } });
    expect(onChange.args[0][0]).toEqual(6);
    expect(onChange.calledOnce).toBeTruthy();
    input.simulate('change', { target: { value: '2' } });
    expect(onChange.calledOnce).not.toBeTruthy();
  });

});