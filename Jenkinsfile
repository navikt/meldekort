#!groovy

import org.jenkinsci.plugins.pipeline.modeldefinition.Utils

//
// Forventer følgende build-parametere:
// - Miljo: Hvilken miljø (namespace) på NAIS som applikasjonen skal deployes til.
// - ReleaseBygg (true/false): Bygg en release av applikasjonen med versjon x.y.z som satt i pom.
//
// NB! Denne pipelinen støtter ikke prod.
//

node {
    def KUBECTL = "/usr/bin/kubectl"
    def KUBECONFIG_FILE = "${KUBECONFIG}"
    def DEFAULT_BUILD_USER = "Jenkins"

    def NAISERATOR_YAML_FILE = "naiserator.yaml"
    def DOCKER_REPO = "${DOCKER_REPO}"

    // For oppdatering av deployet versjon i Vera
    def VERA_UPDATE_URL = "${VERA_UPDATE_URL}"

    // For opplasting av Naiserator yaml-fil
    def NEXUS_REPO_URL = "${NEXUS_REPO_URL}"
    def NEXUS_REPO_ID = "${NEXUS_REPO_ID}"

    // Jobbparametere (definert i Jenkins-jobb)
    def miljo = getParameter(params.Miljo, "")
    def isReleaseBuild = getParameter(params.ReleaseBygg, false)

    println("[INFO] Miljo: ${miljo}")
    println("[INFO] ReleaseBygg: ${isReleaseBuild}")

    validateJobParameters(miljo)

    // Variabler som brukes under streameditering av naiserator.yaml. (Støtter som nevnt ikke prod.)
    def cluster = "dev-sbs"
    def namespace = miljo
    def domainName = "oera-q.local"
    def slackAlertChannel = '#team-meldeplikt-alerts-dev'
    def vaultKvEnv = "preprod"
    def vaultServiceuserEnv = "dev"

    def buildTimestamp = new Date().format("YYYYMMddHHmmss")

    // git related vars
    def branchName

    def pom, groupId, application, pomVersion, releaseVersion

    println("[INFO] namespace: ${namespace}")

    try {
        stage("Checkout") {
            scmInfo = checkout scm

            branchName = getCurrentBranch(scmInfo)

            // Jenkins Git plugin vil etter kjøring av "checkout scm" etterlate utsjekket branch med såkalt "detached HEAD".
            // Innsjekk er dermed ikke mulig. Dette kan fikses på to måter:
            //  1. I Jenkins-jobben, legge til Additional Behaviour "Check out to specific branch" med navnet på branchen.
            //  2. Kjøre git checkout/pull av branchen her i pipelinen.
            // Vi velger det siste.
            sh "git checkout ${branchName}"
            sh "git pull origin ${branchName}"

            // NB! Bruker en mini-pom for versjonering
            pom = readMavenPom file: 'version.xml'
            groupId = "${pom.groupId}"
            application = "${pom.artifactId}"
            pomVersion = "${pom.version}"

            // Fjern SNAPSHOT. For snapshot-bygg brukes en timestamp istedet.
            releaseVersion = pomVersion.replaceAll(/-SNAPSHOT/, "")

            if (!isReleaseBuild) {
                releaseVersion += "-" + buildTimestamp
            }

            println("[INFO] releaseVersion: ${releaseVersion}")
        }

        stage("Install npm packages") {
            sh "npm ci"
        }

        stage("Build application") {
            sh "npm run build"
        }

        stage("Test application") {
            sh "npm test"
        }

        stage("Build & publish Docker image") {
            withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'nexusRepoUser', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
                sh "echo ${PASSWORD} | docker login -u ${USERNAME} --password-stdin ${DOCKER_REPO}"
            }

            sh "npm run build"
            sh "docker build -t ${DOCKER_REPO}/meldeplikt/${application}:${releaseVersion} --rm=true ."
            sh "docker push ${DOCKER_REPO}/meldeplikt/${application}:${releaseVersion}"
        }

        stage("Deploy to NAIS") {
            prepareNaiseratorYaml(NAISERATOR_YAML_FILE, releaseVersion, cluster, namespace, domainName, slackAlertChannel, vaultKvEnv, vaultServiceuserEnv)

            // set namespace to context
            sh "${KUBECTL} config --kubeconfig=${KUBECONFIG_FILE} set-context ${cluster} --namespace=${namespace}"
            sh "${KUBECTL} config --kubeconfig=${KUBECONFIG_FILE} use-context ${cluster}"

            sh "${KUBECTL} apply --kubeconfig=${KUBECONFIG_FILE} -f ${NAISERATOR_YAML_FILE}"

            // Oppdater Vera
            try {
                // Brukeren som skal registreres som deployer i Vera.
                def deployer = getBuildUser(DEFAULT_BUILD_USER)

                println("[INFO] Oppdaterer Vera => application=${application}, environment=${namespace}, version=${releaseVersion}, deployedBy=${deployer}")

                sh "curl -i -s --header \"Content-Type: application/json\" --request POST --data \'{\"environment\": \"${namespace}\",\"application\": \"${application}\",\"version\": \"${releaseVersion}\",\"deployedBy\": \"${deployer}\"}\' ${VERA_UPDATE_URL}"
            } catch (e) {
                println("[ERROR] Feil ved oppdatering av Vera. Exception: " + e)
            }
        }

        stage("Perform release") {
            when (isReleaseBuild) {
                println("[INFO] Oppretter release: ${releaseVersion}")

                // Rull tilbake streamediteringen av yaml-filen i forrige steg før oppdatert pom sjekkes inn.
                sh "git checkout -- ${NAISERATOR_YAML_FILE}"

                sh "git commit -am \"Oppdatert til releaseversjon ${releaseVersion} (fra Jenkins pipeline)\""
                sh "git push origin ${branchName}"

                sh "git tag -a ${application}-${releaseVersion} -m ${application}-${releaseVersion}"
                sh "git push --tags"

                println("[INFO] Opprettet og pushet Git-tag: ${application}-${releaseVersion}")

                // Last opp Naiserator yaml-filen til Nexus.
                withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'nexusUser', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
                    sh "curl -s -F r=${NEXUS_REPO_ID} -F hasPom=false -F e=yaml -F g=${groupId} -F a=${application} -F v=${releaseVersion} -F p=yaml -F file=@${NAISERATOR_YAML_FILE} -u ${USERNAME}:${PASSWORD} ${NEXUS_REPO_URL}"
                }

                println("[INFO] Lastet opp '${NAISERATOR_YAML_FILE}' til Nexus")

                def nextVersion = getNextSnapshotVersion(releaseVersion)

                sh "mvn -f version.xml versions:set -DnewVersion=${nextVersion} -DgenerateBackupPoms=false -B"

                sh "git commit -am \"Oppdatert til neste SNAPSHOT-versjon ${nextVersion} (fra Jenkins pipeline)\""
                sh "git push origin ${branchName}"

                println("[INFO] Oppdatert pom til neste SNAPSHOT-versjon ${nextVersion} og pushet til repo")
            }
        }
    } catch (e) {
        println("[ERROR] " + e)

        throw e
    }
    finally {
    }
}

//
// Hjelpemetoder
//

/*
 * Returnerer lokalt branchnavn basert på scmInfo.GIT_BRANCH som normalt starter med 'origin/' (remote branchnavn).
 */
def getCurrentBranch(scmInfo) {
    return scmInfo.GIT_BRANCH.replaceAll(/.*\//, "")
}

/*
 * Returnerer brukernavnet som skal brukes for å registrere brukeren som utførte bygget. Dersom ikke brukeren er satt,
 * returneres defaultbrukeren i input.
 */
def getBuildUser(defaultUser) {
    def buildUser = defaultUser;

    try {
        wrap([$class: 'BuildUser']) {
            buildUser = "${BUILD_USER} (${BUILD_USER_ID})"
        }
    } catch (e) {
        // Dersom bygg er auto-trigget, er ikke BUILD_USER variablene satt => defaultUser benyttes
    }
    return buildUser
}

/*
 * Returnerer neste SNAPSHOT-versjon for gjeldende versjon. currentVersion må innholde en versjonsstring på formatet
 * x, x.y, x.y.z osb, event. med en postfix-string, f.eks. x.y.z-POC. '-SNAPSHOT' legges på til slutt.
 */
def getNextSnapshotVersion(currentVersion) {
    def versionNumber = getVersionNumber(currentVersion)
    def versionPostfix = currentVersion.replaceAll(versionNumber, "")

    def versionItems = versionNumber.tokenize('.')
    versionItems.putAt(-1, versionItems.getAt(-1).toInteger() + 1)

    return versionItems.join('.') + versionPostfix + "-SNAPSHOT"
}

/*
 * Returnerer versjonsnummeret fra en versjonsstring. Versjonsnummeret må være på formatet x, x.y, x.y.z osb. Kun tall og
 * '.' kan inngå i versjonsnummeret.
 */
def getVersionNumber(version) {
    def match = (version =~ /((\d[\d\.]*\d)|(\d))/)

    // NB! Bruken av java.util.regex.Matcher må godkjennes i Manage Jenkins > In-process Script Approval
    if (match.find()) {
        return match.group(1)
    }
    return version
}

def getParameter(paramValue, defaultValue) {
    return (paramValue != null) ? paramValue : defaultValue
}

def prepareNaiseratorYaml(naiseratorFile, version, cluster, namespace, domainName, slackAlertChannel, vaultKvEnv, vaultServiceuserEnv) {
    replaceInFile('##RELEASE_VERSION##', version, naiseratorFile)
    replaceInFile('##CLUSTER##', cluster, naiseratorFile)
    replaceInFile('##NAMESPACE##', namespace, naiseratorFile)
    replaceInFile('##DOMAIN_NAME##', domainName, naiseratorFile)
    replaceInFile('##SLACK_ALERT_CHANNEL##', slackAlertChannel, naiseratorFile)
    replaceInFile('##VAULT_KV_ENV##', vaultKvEnv, naiseratorFile)
    replaceInFile('##VAULT_SERVICEUSER_ENV##', vaultServiceuserEnv, naiseratorFile)

    if (namespace == "default") {
        replaceInFile('##URL_NAMESPACE##', '', naiseratorFile)
    } else {
        replaceInFile('##URL_NAMESPACE##', "-${namespace}" as String, naiseratorFile)
    }
}

def replaceInFile(oldString, newString, file) {
    sh "sed -i -e 's/${oldString}/${newString}/g' ${file}"
}

def validateJobParameters(miljo) {
    if (!miljo?.trim() || miljo.startsWith('--')) {
        throw new IllegalArgumentException("Jobbparameteren 'Miljo' mangler verdi")
    }
}

def when(boolean condition, body) {
    if (condition) {
        body()
    } else {
        echo "Skipped stage $STAGE_NAME"

        // NB! Bruken av denne statiske metoden må godkjennes i Manage Jenkins > In-process Script Approval
        Utils.markStageSkippedForConditional(STAGE_NAME)
    }
}