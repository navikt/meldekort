import amplitude from 'amplitude-js';
import Environment from './env';

let initialized = false;

function initAmplitude() {
  const { amplitudeKey, amplitudeUrl } = Environment();

  if (!amplitudeKey || !amplitudeUrl) {
    return;
  }

  const config = {
    apiEndpoint: amplitudeUrl,
    saveEvents: true,
    includeUtm: true,
    includeReferrer: true,
    trackingOptions: {
      city: false,
      ip_address: false,
    },
  };
  amplitude.getInstance().init(amplitudeKey, undefined, config);
  initialized = true;
}

initAmplitude();

function amplitudeLogger(name: string, values?: object) {
  if (!initialized) {
    console.log('Aktivitet uten initialisert amplitude:', name, values);
    return;
  }
  amplitude.getInstance().logEvent(name, values);
}

type AmplitudeAktivitetsData = {
  arbeidssoker: string;
  meldegruppe: string;
  innsendingstype: string;
};

export function loggAktivitet(
  aktivitet: string,
  data?: AmplitudeAktivitetsData
) {
  const eventData = { ...data, aktivitet: aktivitet };
  amplitudeLogger('meldekort.aktivitet', eventData);
}
