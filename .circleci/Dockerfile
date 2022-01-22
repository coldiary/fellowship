FROM debian:stable-slim
LABEL author="coldiary"

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
     && apt-get -y install --no-install-recommends libncurses5 python2 python3-pip python3-venv wget build-essential

RUN wget -O erdpy-up.py https://raw.githubusercontent.com/ElrondNetwork/elrond-sdk-erdpy/master/erdpy-up.py

RUN useradd -ms /bin/bash main

USER main

RUN python3 erdpy-up.py

ENV PATH="/home/main/elrondsdk:$PATH"
