FROM resin/raspberrypi3-node:onbuild
WORKDIR /usr/src/app
COPY package.json package.json
RUN sudo apt-get install libavahi-compat-libdnssd-dev
RUN JOBS=MAX npm install --production --unsafe-perm && npm cache clean && rm -rf /tmp/*
COPY . ./
ENV INITSYSTEM on

CMD ["npm", "start"]
