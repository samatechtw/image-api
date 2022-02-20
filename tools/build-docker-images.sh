# Run from the repository root

# Dev base image
docker build --progress=plain -t api:base -f Dockerfile --target=base .
# Dev build image
docker build --progress=plain -t api-build:dev -f Dockerfile --target=build.dev .
# Dev app image
docker build --progress=plain -t api:dev -f Dockerfile --target=dev .
