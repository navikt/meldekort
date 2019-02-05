#!/bin/bash
# Denne filen må ha LF som line separator.

# Stop scriptet om en kommando feiler
set -e

# Usage string
usage="Script som bygger prosjektet

Bruk:
./$(basename "$0") OPTIONS

Gyldige OPTIONS:
    -h  | --help        - printer denne hjelpeteksten
    --publish           - publiserer dockerimaget
"

# Default verdier
v=${versjon}
IMAGE_NAME="meldekort-frontend"
DOCKER_REGISTRY="docker.adeo.no:5000"
DOCKER_REPOSITORY="arbeid"
TAG="${DOCKER_REGISTRY}/${DOCKER_REPOSITORY}/${IMAGE_NAME}:${v:="unversioned"}"
BUILDER_IMAGE="docker.adeo.no:5000/personbruker/personbruker-builder:1.1.0"

# Hent ut argumenter
for arg in "$@"
do
case $arg in
    -h|--help)
        echo "$usage" >&2
        exit 1
        ;;
    --publish)
        PUBLISH=true
        ;;
    *) # ukjent argument
        printf "Ukjent argument: %s\n" "$1" >&2
        echo ""
        echo "$usage" >&2
        exit 1
    ;;
esac
done

function install_packages {
    npm install
}

function build_frontend {
    npm run build
}

function test_frontend {
    npm run test
}


function build_container {
    docker build \
        --tag ${TAG} \
        .
}

function create_version_file {
    echo ${versjon} > VERSION
}

function publish_container() {
    if [ -z ${versjon+x} ]; then
        echo "versjon er ikke satt - publiserer ikke!"
        exit 1;
        else docker push ${TAG};
    fi
}

install_packages
build_frontend
test_frontend
create_version_file
build_container
publish_container
