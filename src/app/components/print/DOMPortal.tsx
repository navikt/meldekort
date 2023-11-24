import * as React from "react";
import { ClassAttributes } from "react";
import { createPortal } from "react-dom";

/* eslint-disable @typescript-eslint/no-explicit-any */
class DOMPortal extends React.Component<ClassAttributes<any>, object> {
  render() {
    return createPortal(this.props.children, document.body);
  }
}

export default DOMPortal;
