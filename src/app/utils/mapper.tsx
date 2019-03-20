import { KortStatus, KortType } from '../types/meldekort';
import { hentIntl } from './intlUtil';

export const mapKortStatusTilTekst = (status: KortStatus) => {

    const intl = hentIntl();

    switch (status) {
        case KortStatus.OPPRE:
            return intl.formatMessage({id: 'meldekort.status.oppr'});
        case KortStatus.SENDT:
            return intl.formatMessage({id: 'meldekort.status.sendt'});
        case KortStatus.SLETT:
            return intl.formatMessage({id: 'meldekort.status.slett'});
        case KortStatus.REGIS:
            return intl.formatMessage({id: 'meldekort.status.regis'});
        case KortStatus.FMOPP:
            return intl.formatMessage({id: 'meldekort.status.fmopp'});
        case KortStatus.FUOPP:
            return intl.formatMessage({id: 'meldekort.status.fuopp'});
        case KortStatus.KLAR:
            return intl.formatMessage({id: 'meldekort.status.klar'});
        case KortStatus.IKKE:
            return intl.formatMessage({id: 'meldekort.status.ikke'});
        case KortStatus.OVERM:
            return intl.formatMessage({id: 'meldekort.status.overm'});
        case KortStatus.NYKTR:
            return intl.formatMessage({id: 'meldekort.status.nyktr'});
        case KortStatus.FERDI:
            return intl.formatMessage({id: 'meldekort.status.ferdi'});
        case KortStatus.FEIL:
            return intl.formatMessage({id: 'meldekort.status.feil'});
        case KortStatus.OPPF:
            return intl.formatMessage({id: 'meldekort.status.oppf'});
        case KortStatus.VENTE:
            return intl.formatMessage({id: 'meldekort.status.vente'});

        default:
            return 'Feil i status';
    }
};

export const mapKortTypeTilTekst = (type: KortType) => {

    const intl = hentIntl();
    switch (type) {
        case KortType.RETUR:
            return intl.formatMessage({id: 'meldekort.type.retur'});
        case KortType.ORDINAER:
            return intl.formatMessage({id: 'meldekort.type.ordinar'});
        case KortType.ERSTATNING:
            return intl.formatMessage({id: 'meldekort.type.erstatning'});
        case KortType.ELEKTRONISK:
            return intl.formatMessage({id: 'meldekort.type.elektronisk'});
        case KortType.AAP:
            return intl.formatMessage({id: 'meldekort.type-AAP'});
        case KortType.ORDINAER_MANUELL:
            return intl.formatMessage({id: 'meldekort.type.ordinarManuell'});
        case KortType.MASKINELT_OPPDATERT:
            return intl.formatMessage({id: 'meldekort.type.maskineltOppdatert'});
        case KortType.MANUELL_ARENA:
            return intl.formatMessage({id: 'meldekort.type.manuellArena'});
        case KortType.KORRIGERT_ELEKTRONISK:
            return intl.formatMessage({id: 'meldekort.type.korrigertElektronisk'});

        default:
            return 'Feil i korttype';
    }
};
