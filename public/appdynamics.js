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
}