FROM resin/raspberrypi3-node:onbuild

RUN sudo apt-get update
RUN sudo apt-get install -y libavahi-compat-libdnssd-dev
RUN sudo npm install -g n
RUN sudo npm install -g pm2
