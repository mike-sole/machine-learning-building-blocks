export JEKYLL_VERSION=4.2.2

docker run --rm \
  --volume=$(pwd):/srv/jekyll \
  --volume=$(pwd)/notebooks:/srv/jekyll/venv \
  -p 4000:4000 \
  -it jekyll/jekyll:$JEKYLL_VERSION \
  /bin/bash -c "gem install webrick && jekyll serve --livereload"
