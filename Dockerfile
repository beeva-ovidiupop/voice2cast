FROM resin/raspberrypi3-node

RUN sudo apt-get update
RUN sudo apt-get install -y libavahi-compat-libdnssd-dev
RUN sudo npm install npm -g
RUN sudo npm install -g pm2

WORKDIR /usr/src/app
COPY package.json package.json
RUN JOBS=MAX npm install --production --unsafe-perm && npm cache clean && rm -rf /tmp/*
COPY . ./
ENV INITSYSTEM on
CMD ["npm", "start"]
