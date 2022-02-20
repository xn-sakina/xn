import React from 'react'
import Logo from './logo.svg'
import './App.css'

const Example = React.lazy(() =>
  import('./Example').then(({ Example }) => ({
    default: Example,
  }))
)

function App() {
  const a = async () => {
    console.log(123)
    // @ts-ignore
    window.a = [1, 2, 3].at(0)
  }

  let b = 1
  // @ts-ignore
  window.v = b

  a()

  return (
    <div className="App">
      <header className="App-header">
        <Logo className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <React.Suspense fallback={<div>loading...</div>}>
          <Example />
        </React.Suspense>
      </header>
    </div>
  )
}

export default App
