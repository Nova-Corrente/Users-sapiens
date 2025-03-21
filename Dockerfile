FROM node:20.18-slim

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos package.json e package-lock.json (se houver)
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante dos arquivos do projeto para o contêiner
COPY . .

# Executa prisma generate
RUN npx prisma generate

# Executa o comando de build do projeto
RUN npm run build

# Define a variável de ambiente para o ambiente de produção
ENV NODE_ENV=production

# Expõe a porta 3000 para acesso externo
EXPOSE 8182

# Comando para iniciar o servidor quando o contêiner for executado
CMD ["npm", "run", "startProd"]

# Para construir a imagem, execute o seguinte comando no terminal:
# docker build -t nome-da-imagem .
# Para executar o contêiner, use o seguinte comando:
# docker run -p 3000:3000 nome-da-imagem
# Para parar o contêiner, use o seguinte comando:
# docker stop nome-do-container
# Para remover o contêiner, use o seguinte comando:
# docker rm nome-do-container
