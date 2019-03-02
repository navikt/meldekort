import { Constants, Innsending } from '../types/innsending';
import { KortStatus, MeldekortDag } from '../types/meldekort';
import { InnsendingActions } from '../actions/innsending';

const hentInitMeldekortDager = () => {
    let mkdager = [];
    for  (var i = 1; i < 15; i++) {
        mkdager.push({
            dag: i,
            arbeidetTimerSum: 0,
            syk: false,
            annetFravaer: false,
            kurs: false,
            meldegruppe: ''
        });
    }
    const meldekortDager: MeldekortDag[] = mkdager;
    return meldekortDager;
};

const initialState: Innsending = {
    meldekortId: 0,
    kortStatus: KortStatus.OPPRE,
    sporsmal: {
        arbeidssoker: false,
        arbeidet: false,
        syk: false,
        annetFravaer: false,
        kurs: false,
        signatur: false,
        meldekortDager: hentInitMeldekortDager()
    }
}

const innsendingReducer = (state: Innsending = initialState,
                           action: InnsendingActions) : Innsending => {
    switch (action.type) {
        case Constants.SETT_MELDEKORTINFO:
            return { ...state, ...action.payload };

        case Constants.LEGG_TIL_SVAR:
            return { ...state, ...action.payload };

        default:
            return state;
    }
};

export default innsendingReducer;

