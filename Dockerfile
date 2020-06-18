FROM node:12-slim

WORKDIR /usr/src/app
RUN apt-get update
RUN apt-get -y install libgbm-dev
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build


FROM node:12-slim
EXPOSE 8080

# update and add all the steps for running with xvfb
RUN apt-get update &&\
    apt-get install -yq gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
    libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 \
    libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
    libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
    ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget \
    xvfb x11vnc x11-xkb-utils xfonts-100dpi xfonts-75dpi xfonts-scalable xfonts-cyrillic x11-apps

WORKDIR /usr/src/app

COPY package*.json ./

# Install puppeteer so it's available in the container.
RUN npm ci --only=production \
    # Add user so we don't need --no-sandbox.
    # same layer as npm install to keep re-chowned files from using up several hundred MBs more space
    && groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser ./node_modules


WORKDIR /usr/src/app

# Run everything after as non-privileged user.
USER pptruser

COPY src/openapi.yml ./build/
COPY --from=0 /usr/src/app/build ./build

CMD ["node", "lib/index.js"]

