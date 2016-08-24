FROM resin/raspberrypi2-debian:latest
ENV INITSYSTEM on

RUN sudo apt-get update
RUN sudo apt-get install -y libavahi-compat-libdnssd-dev curl git-core
RUN curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
RUN sudo apt-get install -y nodejs
RUN sudo apt-get install build-essential
RUN npm config set unsafe-perm true
RUN sudo npm config set unsafe-perm true
RUN sudo npm install -g node-gyp

WORKDIR /usr/src/app
COPY package.json package.json
RUN JOBS=MAX npm install --production --unsafe-perm && npm cache clean && rm -rf /tmp/*
COPY . ./
CMD ["npm", "start"]
