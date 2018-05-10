if [ ! -d "_site" ] ; then
  git clone git@github.com:SBA-ONE/certify-prototype.git -b gh-pages _site
fi
cd _site
git pull
cd ..
bundle exec jekyll build
cd _site
git add .
git commit -m "update jekyll"
git push
