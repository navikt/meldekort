import * as React from 'react';
import { Select } from 'nav-frontend-skjema';

const Sprakvelger: React.StatelessComponent<{}> = () => {

    return(
        <div className="sprakvelger-container">
            <Select label="">
                <option value="no" key="norsk">
                    Norsk
                </option>
                <option value="en" key="english">
                    English
                </option>
            </Select>
        </div>
    );
};

export default Sprakvelger;
