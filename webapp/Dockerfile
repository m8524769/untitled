FROM node:latest

RUN mkdir -p /admin-portal
WORKDIR /admin-portal

COPY package.json /admin-portal
COPY yarn.lock /admin-portal
RUN cd /admin-portal && \
  yarn

COPY . /admin-portal

EXPOSE 4200
CMD [ "yarn", "start" ]
