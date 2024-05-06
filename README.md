## How to run the app

1. Install dependencies using `pnpm install`.

2. Create API key for Alchemy.com free tier. Log in to Alchemy Dashboard, go to Apps and create a new App. Then scroll down in menu, open "Access Keys" and create new Access Key. Select `JSON-RPC & NFT APIs` option and select your App in the dropdown menu. Copy the API key value.

3. Write the API key to `.env` file in root directory. See `env.example` file for guidance.

4. Run the app and open the link below in browser. Start using the app by connecting your Ethereum wallet.

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Assignment considerations

1. Implement frontend using React/NextJS and backend using NodeJS with Typescript

I implemented the backend API using NextJS API. Since NextJS backend technically runs on NodeJS, it fulfils the requirement. Besides that, I used NextAuth which provides tighter integration with NextJS and used SIWE to authenticate user by signing a message with his wallet.

Migrating all APIs into something like ExpressJS would be easily possible.

2. Create an endpoint that accepts any Ethereum address.

I implemented two separate API endpoints:

- `/api/me/tokens` which uses authenticated address from session to fetch ERC20 tokens
- `/api/address/<addr>/tokens` which uses address specified in the URI

I started with the first API, because I assumed that we mostly want to display ERC20 tokens of authenticated wallet, but after reading through the assignment, it stated that API should be able to retrieve ERC20 tokens for **any valid EVM address**, hence, I implemented also the 2nd API which is used by frontend.

3. Fetch ERC20 token balances associated with the provided Ethereum address using an Ethereum blockchain API (e.g., Etherscan API or similar).

I wanted to use Etherscan first, but it seems that they changed their free tier and don't allow fetching list of ERC20 tokens directly in API call. One would have to call other (free) API methods which would complicate the fetching process and I considered it as unnecessarily complex and beyond the scope and purpose of this assignment. Hence, I decided to use Alchemy API.

4. Cache the result to be able to have a leaderboard on the frontend.

I used `TTLCache` in two services. For the caching purpose of Leaderboard, a long-term storage solution like a classic SQL database would be appropriate.
For caching of the ERC20 tokens and token metadata cache, a short-term storage like Redis would be reasonable choice.

Leaderboard sort order / classification mechanism was not specified, so I created simple algorithm. This algorithm uses simple token balances to calculate the `score`.

5. Implement error handling to display appropriate messages if there's an issue fetching data from the backend.

I used React Query library in frontend to keep data fetching easy but robust.

6. Frontend design: Is the frontend UI intuitive and responsive?

I decided to use MUI UI library. In loading state, a skeleton frames are used.

7. Backend performance: Is the backend efficient in fetching and processing data from the blockchain API?

The method `AlchemyService.getERC20TokenListViewModel()` fetches token metadata in serial mode. I implemented it like that only for the purpose of simplicity. To improve efficiency, one could reimplement it to fetch the token metadata in parallel using `Promise.allSettled()`. This refactor would be elementary.

8. Testing: Are there sufficient unit tests to ensure the reliability of the application?

I implemented reasonable set of unit tests for backend services using `Jest`. You can run tests using `pnpm test` command.

9. Bonus: Handle and display the ERC-721 tokens from that same address.

Based on the provided code, structure and tests, implementing support for ERC-721 would not provide too much additional insights for the reviewer, in my opinion. I decided to omit it.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
