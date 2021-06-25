# Lido Frontend Template Documentation

This document outlines the template's structure, provides general guidelines and explains best practices for Lido frontend development. 

## Stack

The Lido Frontend Template stack includes:
- [React](https://reactjs.org/)
- [Next.js](https://nextjs.org/docs/getting-started) | API routes, server-side rendering
- [ethers](https://docs.ethers.io/v5/) | Ethereum library
- [web3react](https://github.com/NoahZinsmeister/web3-react) | Web3 Provider and wallet connectors
- [SWR](https://swr.vercel.app/) | Data fetching and caching
- [Lido UI](https://github.com/lidofinance/ui) | Lido UI React component library
- [styled-components](https://styled-components.com/docs) | custom styled React components 

## Environment variables

Please **avoid** using public runtime variables with the `NEXT_PUBLIC_` prefix. This ensures that the testnet and production deployments of your application can be smoothly integrated into our CI pipeline. 

If you need to access an environment variable in the client (e.g. supported networks, analytics IDs), make sure you follow the procedure below,

**Step 1.** Specify a variable in `.env.local`, e.g.
```bash
# .env.local
MY_PUBLIC_VAR=hello
```

**Step 2.** Add it to `publicRuntimeConfig` in `next.config.js`
```js
// next.config.js

const myPublicVar = process.env.MY_PUBLIC_VAR;

module.exports = {
  // ...
  publicRuntimeConfig: {
    // ...
    myPublicVar,
  }
}
```

If you take a look at `_app.tsx`, you will see than the public runtime config will be passed down to our app context using the `getInitialProps` function.

**Step 3.** Export the `getServerSideProps` function from each page where you are planning to use your variable. The function doesn't have to return anything but it forces the page Next.js to run `getInitialProps` on the server.

```ts
// index.tsx

const HomePage: FC<Props> = () => {
  // ...
};

export const getServerSideProps: GetServerSideProps<WithdrawProps> =
  async () => {
    return { 
      props: {}
    };
  };
```

**Step 4.** Use the `useConfig` hook to extract the variable

```ts
const MyComponent: FC<{}> = () => {
  const { config } = useConfig();
  const { myPublicVar } = config;

  return <p>{myPublicVar}</p>
};
```

Read more about [runtime configuration](https://nextjs.org/docs/api-reference/next.config.js/runtime-configuration) and [automatic static optimization](https://nextjs.org/docs/advanced-features/automatic-static-optimization)

## JSON RPC Provider
Apart from Web3 connection provided by the user's wallet, we use an additional JSON RPC connection to be able to query Ethereum before Web3 connection is established. This allows us to show any relevant information the user might need to know before deciding to connect their wallet.

This means that you may have to register an account with a third-party Ethereum provider such [Infura](https://infura.io/) or [Alchemy](https://www.alchemy.com/) whose free plans are more than enough for development. Once you get your hands on the API Key, specify it in your `.env.local` and you are ready to go.

In order to ensure that pre-paid production API keys do not end getting shipped to the user's browser, we have an API route at `pages/api/rpc.ts` that proxies all Ethereum JSON RPC requests.

To use JSON RPC Provider, use the `useEthRpcSwr` hook like so,
```ts
function MyComponent: FC<{}> = () => {
  const gasPrice = useEthRpcSwr('getGasPrice');
  // ..
}
```