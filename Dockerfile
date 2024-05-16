#Esse documento é usado para executar uma aplicação SPA de forma estática (arquivos estáticos). A aplicação foi feita com o framework Angular 15 sendo executada com NGinx
#Fonte: https://youtu.be/F2au3FXq9Y4

#Baixa a imagem do Nodejs que será usada
FROM node:20.10.0 as builder
#Define o ambiente de trabalho dentro do container
WORKDIR /app
#Copia tudo que está dentro do diretório atual dentro do ambiente de trabalho no container
COPY . .
#Realiza o donwload e instalação das dependências do projeto atual
RUN npm install
#Realiza o processo de build da aplicação
RUN npm run build
#Importar o NGinx
FROM nginx:alpine
#Copia tudo que está dentro do builder para o projeto "buildado"
COPY --from=builder /app/dist/frontend /usr/share/nginx/html
#Copiar o arquivo de configurações do nginx pra dentro do container
COPY nginx.conf /etc/nginx/nginx.conf
COPY mime.types /etc/nginx/mime.types
#Disponibiliza o serviço na porta 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

#Comando usado para criar o projeto no Docker:
    #docker build -t <nome-do-projeto> <diretorio-que-esta-o-dockerfile>
    #exemplo: docker build -t angular-docker .
#Comando usado para rotar o container criado no docker
    #docker run -p <porta-da-maquina-fisica>:<porta-do-container> <nome-do-projeto>
    #docker run -p 8080:80 angular-docker


