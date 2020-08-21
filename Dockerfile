FROM ubuntu

# Install git and node
RUN apt-get update
RUN apt-get install -y git curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_14.x  | bash -
RUN apt-get install -y nodejs
RUN npm install
RUN mkdir /root/.ssh/
# Copy over private key, and set permissions
# Warning! Anyone who gets their hands on this image will be able
# to retrieve this private key file from the corresponding image layer
ADD .ssh/github /root/.ssh/id_rsa

RUN touch /root/.ssh/known_hosts
RUN ssh-keyscan github.com >> /root/.ssh/known_hosts

# Copy the contents of this repo and run
COPY . .
RUN git config user.email screaminghawk@gmail.com
RUN git config user.name Michael Standen
CMD ["npm", "start"]
