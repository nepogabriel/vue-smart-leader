FROM node:16

# Define o diretório de trabalho
WORKDIR /app

# Copia apenas os arquivos de dependência primeiro
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do projeto
COPY . .

# Expõe a porta padrão do Vue CLI
EXPOSE 8080

# Ativa o modo development
CMD ["npm", "run", "serve"]
