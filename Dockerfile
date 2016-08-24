FROM resin/raspberrypi3-node:onbuild

RUN sudo npm install -g pm2

WORKDIR /usr/src/app
COPY package.json package.json
RUN JOBS=MAX npm install --production --unsafe-perm && npm cache clean && rm -rf /tmp/*
COPY . ./
ENV INITSYSTEM on
CMD ["npm", "start"]
