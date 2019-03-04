FROM node:8.4
COPY . /app
WORKDIR /app
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
RUN cnpm install
EXPOSE 4455
EXPOSE 27017
CMD npm run start