#!groovy

import org.jenkinsci.plugins.pipeline.modeldefinition.Utils

//
// Forventer følgende build-parametere:
// - Miljo: Hvilket miljø på NAIS som applikasjonen skal deployes til.
// - ReleaseBygg (true/false): Bygg en release av applikasjonen med versjon x.y.z som satt i pom.
//
// NB! Denne pipelinen støtter ikke prod.
//

node {
    def NAIS_YAML_FILE = ".nais/nais.yaml"
    def DOCKER_REPO = "docker.pkg.github.com/navikt"

    // For opplasting av Nais-artifakt (nais.yaml + vars-filer)
    def NEXUS_REPO_URL = "http://maven.adeo.no/nexus/service/local/artifact/maven/content"
    def NEXUS_REPO_ID = "m2internal"

    // Jobbparametere (definert i Jenkins-jobb)
    def environ = getParameter(params.Miljo, "")
    def isReleaseBuild = getParameter(params.ReleaseBygg, false)

    println("[INFO] Miljo: ${environ}")
    println("[INFO] ReleaseBygg: ${isReleaseBuild}")

    validateJobParameters(environ)

    def varsFile = ".nais/vars-" + environ + ".yaml"
    def cluster = "dev-gcp"

    def buildTimestamp = new Date().format("YYYYMMddHHmmss")

    // git related vars
    def branchName

    // pom related vars
    def pom, groupId, application, pomVersion, releaseVersion

    println("[INFO] varsFile: ${varsFile}")

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
            pom = readMavenPom file: 'maven.xml'
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
            sh "mvn -f maven.xml versions:set -DnewVersion=${releaseVersion} -DgenerateBackupPoms=false -B"
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
            prepareVarsFile(varsFile, releaseVersion)

            sh "cat ${varsFile}"

            withCredentials([string(credentialsId: 'deploy-api-key', variable: 'NAIS_DEPLOY_APIKEY')]) {
                sh "deploy --apikey=${NAIS_DEPLOY_APIKEY} --cluster=${cluster} --repository=${application} --resource=${NAIS_YAML_FILE} --vars=${varsFile} --print-payload --wait=false --var=\"image=meldeplikt/${application}:${releaseVersion}\""
            }
        }

        stage("Perform release") {
            when (isReleaseBuild) {
                println("[INFO] Oppretter release: ${releaseVersion}")

                // Bygg NAIS-artifakt
                sh "mvn clean package -f maven.xml"

                // Rull tilbake streamediteringen av yaml-filen i forrige steg før oppdatert pom sjekkes inn.
                sh "git checkout -- ${varsFile}"

                sh "git commit -am \"Oppdatert til releaseversjon ${releaseVersion} (fra Jenkins pipeline)\""
                sh "git push origin ${branchName}"

                sh "git tag -a ${application}-${releaseVersion} -m ${application}-${releaseVersion}"
                sh "git push --tags"

                println("[INFO] Opprettet og pushet Git-tag: ${application}-${releaseVersion}")

                // Last opp NAIS-artifakten til Nexus.
                withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'nexusUser', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
                    sh "curl -s -F r=${NEXUS_REPO_ID} -F hasPom=false -F e=zip -F g=${groupId} -F a=${application} -F v=${releaseVersion} -F p=zip -F file=@target/${application}-nais.zip -u ${USERNAME}:${PASSWORD} ${NEXUS_REPO_URL}"

                    println("[INFO] Lastet opp '${application}-nais.zip' til Nexus")
                }

                def nextVersion = getNextSnapshotVersion(releaseVersion)

                sh "mvn -f maven.xml versions:set -DnewVersion=${nextVersion} -DgenerateBackupPoms=false -B"

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

def prepareVarsFile(varsFile, version) {
    replaceInFile('##RELEASE_VERSION##', version, varsFile)
}

def replaceInFile(oldString, newString, file) {
    sh "sed -i -e 's/${oldString}/${newString}/g' ${file}"
}

def validateJobParameters(environ) {
    if (!environ?.trim() || environ.startsWith('--')) {
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