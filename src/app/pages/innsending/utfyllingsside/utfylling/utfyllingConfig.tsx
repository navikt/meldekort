export interface UtfyltDag {
    uke: number;
    dag: string;
    arbeidetTimer?: number;
    syk?: boolean;
    annetFravaer?: boolean;
    kurs?: boolean;
}

export const hentUtfyltDagConfig = (): UtfyltDag[] => {
    return [
        {
            uke: 1,
            dag: 'Mandag'
        },
        {
            uke: 1,
            dag: 'Tirsdag'
        },
        {
            uke: 1,
            dag: 'Onsdag'
        },
        {
            uke: 1,
            dag: 'Torsdag'
        },
        {
            uke: 1,
            dag: 'Fredag'
        },
        {
            uke: 1,
            dag: 'Lørdag'
        },
        {
            uke: 1,
            dag: 'Søndag'
        },
        {
            uke: 2,
            dag: 'Mandag'
        },
        {
            uke: 2,
            dag: 'Tirsdag'
        },
        {
            uke: 2,
            dag: 'Onsdag'
        },
        {
            uke: 2,
            dag: 'Torsdag'
        },
        {
            uke: 2,
            dag: 'Fredag'
        },
        {
            uke: 2,
            dag: 'Lørdag'
        },
        {
            uke: 2,
            dag: 'Søndag'
        }
    ];
}
