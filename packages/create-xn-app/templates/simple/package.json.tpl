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
    "react-router-dom": "^6.12.1"
  },
  "devDependencies": {
    "@types/node": "^20.2.6",
    "@types/react": "^18.2.9",
    "@types/react-dom": "^18.2.4",
    "@types/react-router-dom": "^5.3.3",
    "@xn-sakina/meta": "^{{{xnVersion}}}",
    "typescript": "^5.1.3"
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
