echo > .nojekyll

git init
git checkout -B main
git add -A
git commit -m "Deploy"

#git push -f git@github.com:SaumyaGuptaTechnokrat/TechFlixo.git.main:gh-pages
cd -