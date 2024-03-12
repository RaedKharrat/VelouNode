FROM undefined:undefined-alpine

    # Ajoutez d'autres instructions Docker en fonction de votre configuration

    WORKDIR /opt/app

    COPY package*.json ./

    RUN npm install

    COPY . .

    ENV APP_KEYS=ezuh
    ENV NODE_ENV=zer

    EXPOSE undefined

    CMD ["npm", "start"]
    