import * as React from 'react';
import { Sidetittel } from 'nav-frontend-typografi';

export interface BannerProps {
    tittel: string;
    mindre?: boolean;
}

const Banner: React.StatelessComponent<BannerProps> = (props) => {
    const bannerClass = 'banner-content ' + (props.mindre ? ' mindre-banner' : '');
    return (
        <div className="banner-container">
            <div className={bannerClass}>
                <Sidetittel>{props.tittel}</Sidetittel>
            </div>
        </div>
    );
};

Banner.displayName = 'Banner';
export default Banner;
