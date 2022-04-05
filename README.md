# Image Processing Microservice

## Overview

A lightweight service for uploading an image from a client, validating and processing it, and pushing to an external data service such as AWS S3.
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

```bash
npm install
```

### Run

A Redis instance must be available on port 6379. An easy way to do that is:

```bash
docker run --name redis -d -p 6379:6379 redis:6.0
```

Run the server:

```bash
npm run dev:server
```

With the app running, API docs are available at http://localhost:3500/docs

### Build

```bash
npm run build:server
npm run build:web
```

### Test

**Docker**

```bash
# Build
docker build --progress=plain -t api:dev -f Dockerfile --target=dev .
# Run
docker run -p 3500:3500 api:dev
```

See [build script](./tools/build-docker-images.sh) for building specific images, which can be useful for testing.

### Commit conventions

The commit message format is: `<scope>: <short-summary> #<issue-number>`

- `scope`: Use a [gitmoji](https://gitmoji.dev/)
- `short-summary`: Short summary about this commit
- `issue-number`: The related issue number

The following are `gitmoji` recommendations for the `scope`. These are not currently enforced, but may be in the future.

- Release/tag - :bookmark: `:bookmark:`
- Feature - :sparkles: `:sparkles:`
- Docs - :books: `:books:`
- Bugfix - :bug: `:bug:`
- Testing - :white_check_mark: `:white_check_mark:`
- Lint/format - :art: `:art:`
- Refactor - :hammer: `:hammer:`
- Code/file removal - :fire: `:fire:`
- CI/CD - :green_heart: `:green_heart:`
- Deps - :lock: `:lock:`
- Breaking changes - :boom: `:boom:`
- Config - :wrench: `:wrench:`
