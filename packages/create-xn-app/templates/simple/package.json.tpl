{
  "name": "react-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "xn dev",
    "build": "xn build"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.4.5"
  },
  "devDependencies": {
    "@types/node": "^18.11.4",
    "@types/react": "^18.0.21",
    "@types/react-dom": "^18.0.6",
    "@types/react-router-dom": "^5.3.3",
    "@xn-sakina/meta": "^{{{xnVersion}}}",
    "typescript": "^4.8.4"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "pnpm": {
    "overrides": {
      "esbuild": "{{{esbuildVersion}}}"
    }
  }
}
