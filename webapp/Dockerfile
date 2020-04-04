FROM node:latest

RUN mkdir -p /untitled-webapp
WORKDIR /untitled-webapp

COPY package.json /untitled-webapp
COPY yarn.lock /untitled-webapp
RUN cd /untitled-webapp && \
  yarn

COPY . /untitled-webapp

EXPOSE 4200
CMD [ "yarn", "start" ]
