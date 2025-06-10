# On part d'une image de base avec Node.js déjà installé
FROM node:18-alpine

# On se place dans le dossier /app à l'intérieur du carton
WORKDIR /app

# On copie d'abord les fichiers de dépendances
COPY package*.json ./

# On installe toutes les dépendances
RUN npm install

# On copie tout le reste de notre code
COPY . .

# On dit quel port notre application utilise
EXPOSE 5000

# La commande pour démarrer notre application
CMD ["npm", "start"]
