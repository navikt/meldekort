export interface UtfyltDag {
  uke: number;
  dag: number;
  arbeidetTimer?: string;
  syk: boolean;
  annetFravaer: boolean;
  kurs: boolean;
}

export const hentUtfyltDagConfig = (): UtfyltDag[] => {
  return [
    {
      uke: 1,
      dag: 1,
      syk: false,
      annetFravaer: false,
      kurs: false,
    },
    {
      uke: 1,
      dag: 2,
      syk: false,
      annetFravaer: false,
      kurs: false,
    },
    {
      uke: 1,
      dag: 3,
      syk: false,
      annetFravaer: false,
      kurs: false,
    },
    {
      uke: 1,
      dag: 4,
      syk: false,
      annetFravaer: false,
      kurs: false,
    },
    {
      uke: 1,
      dag: 5,
      syk: false,
      annetFravaer: false,
      kurs: false,
    },
    {
      uke: 1,
      dag: 6,
      syk: false,
      annetFravaer: false,
      kurs: false,
    },
    {
      uke: 1,
      dag: 0,
      syk: false,
      annetFravaer: false,
      kurs: false,
    },
    {
      uke: 2,
      dag: 1,
      syk: false,
      annetFravaer: false,
      kurs: false,
    },
    {
      uke: 2,
      dag: 2,
      syk: false,
      annetFravaer: false,
      kurs: false,
    },
    {
      uke: 2,
      dag: 3,
      syk: false,
      annetFravaer: false,
      kurs: false,
    },
    {
      uke: 2,
      dag: 4,
      syk: false,
      annetFravaer: false,
      kurs: false,
    },
    {
      uke: 2,
      dag: 5,
      syk: false,
      annetFravaer: false,
      kurs: false,
    },
    {
      uke: 2,
      dag: 6,
      syk: false,
      annetFravaer: false,
      kurs: false,
    },
    {
      uke: 2,
      dag: 0,
      syk: false,
      annetFravaer: false,
      kurs: false,
    },
  ];
};
