cloc . \
  --include-ext=ts,tsx \
  --exclude-dir=node_modules,.next,dist,build,out,.turbo,.tanstack,start,.vercel \
  --not-match-f='(worker-configuration\.d\.ts|routeTree\.gen\.ts)' \
  --by-file