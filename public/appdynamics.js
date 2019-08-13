/*
try {
    window['adrum-start-time'] = new Date().getTime();
    function isRunningInProd() {
        return (window.location.href.indexOf("//nav.no") > -1) || (window.location.href.indexOf("//www.nav.no") > -1);
    }
    (function (config) {

        if (isRunningInProd()) {
            config.adrumExtUrlHttps = 'https://jsagent.nav.no';
            config.beaconUrlHttps = 'https://eumgw.nav.no';
            config.appKey = 'EUM-AAB-AWX';

        } else {
            config.adrumExtUrlHttps = 'https://jsagent.adeo.no';
            config.beaconUrlHttps = 'https://eumgw.adeo.no';
            config.appKey = 'EUM-AAB-AWY';
        }

        config.xd = {enable: false};
        config.spa = {"spa2": true};

    })(window['adrum-config'] || (window['adrum-config'] = {}));

    if (isRunningInProd()) {
        document.write(unescape('%3Cscript') + "src='https://jsagent.nav.no/adrum/adrum.js' " + " type='text/javascript' charset='UTF-8'" + unescape('%3E%3C/script%3E'));
    } else {
        if ('https:' === document.location.protocol) {
            document.write(unescape('%3Cscript') + " src='https://jsagent.adeo.no/adrum/adrum.js' " + " type='text/javascript' charset='UTF-8'" + unescape('%3E%3C/script%3E'));
        } else {
            document.write(unescape('%3Cscript') + " src='http://jsagent.adeo.no/adrum/adrum.js' " + " type='text/javascript' charset='UTF-8'" + unescape('%3E%3C/script%3E'));
        }
    }
} catch (err) {
}*/

window['adrum-start-time'] = new Date().getTime();
(function (config) {
    var appKey = "";
    if (window.location.href.indexOf("tjenester-q1.nav.no") > -1)
    {             appKey = 'EUM-AAB-AWY';         }
    else if (window.location.href.indexOf("tjenester.nav.no") > -1)
    {             appKey = 'EUM-AAB-AWX';         }

        config.appKey = appKey;
        if (window.location.href.indexOf("tjenester.nav.no") > -1) {
            config.beaconUrlHttp = 'http://eumgw.nav.no';
            config.beaconUrlHttps = 'https://eumgw.nav.no';
            config.adrumExtUrlHttp = 'http://jsagent.nav.no';
            config.adrumExtUrlHttps = 'https://jsagent.nav.no';
        } else {
            config.beaconUrlHttp = 'http://eumgw.adeo.no';
            config.beaconUrlHttps = 'https://eumgw.adeo.no';
            config.adrumExtUrlHttp = 'http://jsagent.adeo.no';
            config.adrumExtUrlHttps = 'https://jsagent.adeo.no';
        }

        config.xd = {enable: false};
        config.spa = {"spa2": true};

    })(window['adrum-config'] || (window['adrum-config'] = {}));

if (window.location.href.indexOf("tjenester.nav.no") > -1) {
    document.write(unescape('%3Cscript') + "src='https://jsagent.nav.no/adrum/adrum.js' " + " type='text/javascript' charset='UTF-8'"  + unescape('%3E%3C/script%3E'));
} else {
    if ('https:' === document.location.protocol) {
        document.write(unescape('%3Cscript') + " src='https://jsagent.adeo.no/adrum/adrum.js' " + " type='text/javascript' charset='UTF-8'" + unescape('%3E%3C/script%3E'));
    }
    else {
        document.write(unescape('%3Cscript') + " src='http://jsagent.adeo.no/adrum/adrum.js' " + " type='text/javascript' charset='UTF-8'" + unescape('%3E%3C/script%3E'));
    }
}