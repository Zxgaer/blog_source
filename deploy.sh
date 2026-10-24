if [ $# -gt 0 ]; then
  MSG="$*"
else
  MSG="Updated: $(date +%Y/%m/%d)"
fi
git add .
git commit -m "$MSG"
git push -u origin source
npm run deploy:pages
