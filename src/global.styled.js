import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
    html, body {
      margin: 0;
      padding: 0;
    }
    *, *::after, *::before {
      box-sizing: border-box;
    }
    body {
      background: ${ ({theme}) => theme.primaryPink };
      color: ${ ({theme}) => theme.primaryDark };
      font-family: futura-pt,sans-serif;
      font-weight: 400;
      font-style: normal;
      height: 100vh;
      text-rendering: optimizelegibility;
      overflow-x: hidden;
    }
`
