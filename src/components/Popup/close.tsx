import * as React from 'react';

interface Props {
  className: string,
  onCancel: () => void,
}

function Close({ className, onCancel }: Props) {
  return (
    <button
      type="button"
      className={className}
      onClick={onCancel}
    />
  )
}

export default Close;
