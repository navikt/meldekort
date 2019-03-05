import { Normaltekst, Undertittel } from 'nav-frontend-typografi';

export const loggInnContent = () => {
    return (
        <div>
            <Undertittel children={'Logg inn'}/>
            <Normaltekst>
                Du er ikke logget inn. Vi viderefører deg til innloggingsiden nå.
            </Normaltekst>
        </div>
    );
};