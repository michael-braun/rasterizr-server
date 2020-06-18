# rasterizr-server

rasterizr-server is a backend written in Node.js that generates png, webm und bmp files from svg images.
Furthermore it supports the generation of monochromatic bitmaps that could be used in combination with oled-libraries.

## docker

This backend is available as image on docker-hub. It uses node-js slim as a base-image and exposes the port 8080 (default-port)

```
docker run -P michaelbraun/rasterizr:latest
```

## environment variables

The following environment variables could be set:

| variable | description                                                                                                     | default |
|----------|-----------------------------------------------------------------------------------------------------------------|---------|
| PORT     | The port on which the api should be started. Should not be used to change the port when using the docker image. | 8080    |


## volume mounts

The following volumes could be mounted:

| path     | description                                               |
|----------|-----------------------------------------------------------|
| /data    | Contains all svg files grouped in directories (libraries) |

