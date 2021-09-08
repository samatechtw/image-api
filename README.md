# Image Processing Microservice

## Overview
A common requirement in apps we develop is uploading an image from the client, validating on the server, and pushing to an external data service such as AWS S3. 
It is often necessary to offload basic image processing to a task queue for operations such as resizing, converting formats, generating thumbnails, etc.

Since we develop services in multiple languages and wish to avoid code duplication, we have decided to split this functionality into a microservice.

## Requirements
* Accepts PNG, JPEG, GIF, WEBP, SVG, and HEIC image formats
* Authentication via bearer token
* Supports resize, convert format, size optimization, thumbnail generation
* Horizontally scalable
* Library: processing API should be exposed for use directly in other apps
* Server: provide containers that can be easily dropped behind nginx/k8s ingress

