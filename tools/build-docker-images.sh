# Run from the repository root

docker build --progress=plain -t api:base -f Dockerfile --target=base .
docker build --progress=plain -t api-build:dev -f Dockerfile --target=build.dev .
docker build --progress=plain -t api:dev -f Dockerfile --target=dev .
