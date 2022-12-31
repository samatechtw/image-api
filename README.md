# Image Processing Microservice

## Overview

A lightweight service for uploading an image from a client, validating and processing it, and uploading to a URL.
Image processing is handled by a Redis task queue. Some supported operations include resizing, converting formats, generating thumbnails, and size optimization.

## Features

- Accepts PNG, JPEG, GIF, WEBP, SVG, and HEIC image formats
- Authentication via bearer token
- Supports resizing, format conversion, size optimization, thumbnail generation
- Horizontally scalable
- Core processing library can be integrated directly in other apps
- Docker containers provided for easy deployment

## Development

### Install

PNPM workspace is used for project organization.

```bash
pnpm install
```

### Run

A Redis instance must be available on IMAGE_API_REDIS_PORT, which defaults to 6379. An easy way to do that is:

```bash
docker run --name redis -d -p 6379:6379 redis:6.0
```

Run the server:

```bash
npm run dev:server
```

With the app running, API docs are available at http://localhost:4100/docs

### Build

```bash
npm run build:server
npm run build:web
```

### Test

**Unit test**

Run all unit tests

```bash
npm run test
```

**Integration test**

Redis must be running first

```bash
# Start server in another terminal
npm run dev:server

# Run E2E tests
npm run integration
```

### Docker

```bash
# Build
docker build --progress=plain -t api:dev -f Dockerfile --target=dev .
# Run
docker run -p 4100:4100 api:dev
```

See [build script](./tools/build-docker-images.sh) for building specific images, which can be useful for testing.

**Docker compose**

```bash
# start app
docker-compose up -d
# stop app
docker-compose down
# re-build app
docker-compose build
```

### Commit conventions

The commit message format is: `<scope>: <short-summary> #<issue-number>`

- `scope`: `release | feat | fix | refactor | test | ci`
- `type` (optional): `server | web | example | docs`
- `short-summary`: Short summary about this commit
- `issue-number`: The related issue number
