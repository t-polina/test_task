FROM node:12-buster

RUN apt-get update

WORKDIR /test-task

COPY ./package* ./

RUN npm install

COPY ./src ./src

## THE LIFE SAVER
# ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
# RUN chmod +x /wait

# CMD /wait && npm run start

ENTRYPOINT ["npm", "run", "start"]
