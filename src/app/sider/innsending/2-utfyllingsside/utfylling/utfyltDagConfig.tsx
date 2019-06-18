export interface UtfyltDag {
  uke: number;
  dag: string;
  arbeidetTimer?: string;
  syk: boolean;
  annetFravaer: boolean;
  kurs: boolean;
}

export const hentUtfyltDagConfig = (): UtfyltDag[] => {
  return [
    {
      uke: 1,
      dag: 'Mandag',
      syk: false,
      annetFravaer: false,
      kurs: false,
    },
    {
      uke: 1,
      dag: 'Tirsdag',
      syk: false,
      annetFravaer: false,
      kurs: false,
    },
    {
      uke: 1,
      dag: 'Onsdag',
      syk: false,
      annetFravaer: false,
      kurs: false,
    },
    {
      uke: 1,
      dag: 'Torsdag',
      syk: false,
      annetFravaer: false,
      kurs: false,
    },
    {
      uke: 1,
      dag: 'Fredag',
      syk: false,
      annetFravaer: false,
      kurs: false,
    },
    {
      uke: 1,
      dag: 'Lørdag',
      syk: false,
      annetFravaer: false,
      kurs: false,
    },
    {
      uke: 1,
      dag: 'Søndag',
      syk: false,
      annetFravaer: false,
      kurs: false,
    },
    {
      uke: 2,
      dag: 'Mandag',
      syk: false,
      annetFravaer: false,
      kurs: false,
    },
    {
      uke: 2,
      dag: 'Tirsdag',
      syk: false,
      annetFravaer: false,
      kurs: false,
    },
    {
      uke: 2,
      dag: 'Onsdag',
      syk: false,
      annetFravaer: false,
      kurs: false,
    },
    {
      uke: 2,
      dag: 'Torsdag',
      syk: false,
      annetFravaer: false,
      kurs: false,
    },
    {
      uke: 2,
      dag: 'Fredag',
      syk: false,
      annetFravaer: false,
      kurs: false,
    },
    {
      uke: 2,
      dag: 'Lørdag',
      syk: false,
      annetFravaer: false,
      kurs: false,
    },
    {
      uke: 2,
      dag: 'Søndag',
      syk: false,
      annetFravaer: false,
      kurs: false,
    },
  ];
};
