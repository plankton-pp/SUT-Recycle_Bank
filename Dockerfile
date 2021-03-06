# pull official base image
FROM node:lts-gallium

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
RUN npm install --silent --legacy-peer-deps
RUN npm install react-scripts -g --silent --legacy-peer-deps

# add app
COPY . ./

# start app
CMD ["npm", "start"]
