import * as React from "react";
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';

interface ToggleLenkeProps {
  children: React.ReactNode;
  onToggle: () => void;
  apen?: boolean;
}

const InfoToggler: React.FunctionComponent<ToggleLenkeProps> = (props) => {
  const { apen = false, children, onToggle } = props;
  return (
    <button
      className="infoToggler"
      onClick={(evt: React.MouseEvent<HTMLButtonElement>) => {
        evt.stopPropagation();
        evt.preventDefault();
        onToggle();
      }}
      aria-expanded={apen}
    >
      <span className="infoToggler__content">
        <span className="infoToggler__label">{children}</span>
        <span className="infoToggler__chevron">
          {
            apen
            ? <ChevronUpIcon title="a11y-title" style={{marginBottom: "-0.2rem"}} />
            : <ChevronDownIcon title="a11y-title" style={{marginBottom: "-0.2rem"}} />
          }
        </span>
      </span>
    </button>
  );
};
export default InfoToggler;
