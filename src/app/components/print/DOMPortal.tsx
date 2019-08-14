import * as React from 'react';
import { ClassAttributes } from 'react';
import { createPortal } from 'react-dom';

class DOMPortal extends React.Component<ClassAttributes<any>, {}> {
  render() {
    return createPortal(this.props.children, document.body);
  }
}

export default DOMPortal;
