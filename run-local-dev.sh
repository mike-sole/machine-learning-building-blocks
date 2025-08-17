
docker build -t ml-building-blocks-dev-site .

docker run --rm \
  --volume=$(pwd):/srv/jekyll \
  --volume=$(pwd)/notebooks:/srv/jekyll/venv \
  -p 4000:4000 \
  -it ml-building-blocks-dev-site \
  /bin/bash -c "jekyll serve --livereload"
