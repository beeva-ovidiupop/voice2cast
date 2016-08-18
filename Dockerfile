FROM resin/raspberrypi3-node:onbuild
WORKDIR /usr/src/app
COPY package.json package.json
npm install npm -g
RUN JOBS=MAX npm install --production --unsafe-perm && npm cache clean && rm -rf /tmp/*
COPY . ./
ENV INITSYSTEM on

CMD ["npm", "start"]
