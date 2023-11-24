import * as React from 'react';
import { Collapse } from 'react-collapse';

export interface OwnProps {
  /** Innholdet som skal vises */
  children: React.ReactNode;
  /** Overstyre state for om den skal vises eller ikke */
  erApen?: boolean;
  /** Default off */
  ariaLive?: 'assertive' | 'polite' | 'off';
  /** Om skjul/vis skal animeres. Default true */
  animert?: boolean;
}

const EkspanderbartInnhold: React.FunctionComponent<OwnProps> = ({
  children,
  animert = true,
  erApen = false,
  ariaLive = 'off'
}) => {
  const content = (
    <div aria-live={ariaLive}>
      {erApen ? (
        <div className={'ekspanderbart__tekst'}>{children}</div>
      ) : (
        <div />
      )}
    </div>
  );

  if (!animert) {
    return content;
  }
  return (
    <Collapse
      isOpened={erApen}
      theme={{
        collapse: erApen
          ? 'ekspanderbartInnhold ekspanderbartInnhold--apen'
          : 'ekspanderbartInnhold',
      }}
    >
      {content}
    </Collapse>
  );
};

export default EkspanderbartInnhold;
