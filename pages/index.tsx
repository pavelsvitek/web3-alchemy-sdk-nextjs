import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { getServerSession } from 'next-auth';
import { getAuthOptions } from './api/auth/[...nextauth]';
import { useSession } from 'next-auth/react';
import { useAddressERC20Tokens } from '../models/address/queries';
import { Button, Paper, Skeleton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import Nav from '../components/Nav';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  return {
    props: {
      session: await getServerSession(req, res, getAuthOptions(req)),
    },
  };
};

const Home: NextPage = () => {
  const session = useSession();

  const isAuthenticated = session && !!session.data?.address;
  const address = isAuthenticated ? (session.data!.address as string) : '';

  const erc20TokensQuery = useAddressERC20Tokens(address, { enabled: isAuthenticated });

  return (
    <div className={styles.container}>
      <Head>
        <title>RainbowKit App</title>
        <meta content="Generated by @rainbow-me/create-rainbowkit" name="description" />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        {/* Navigation */}
        {isAuthenticated && <Nav />}

        <ConnectButton />

        {/* Display list of ERC20 tokens */}
        {isAuthenticated && (
          <Paper sx={{ padding: '1rem 1.5rem', marginTop: '2rem', minWidth: '700px' }}>
            <Typography variant="h5">Your ERC20 Tokens</Typography>
            {/* Display loading state */}
            {erc20TokensQuery.isLoading && (
              <div>
                <Skeleton height={52} variant="text" />
                <Skeleton height={52} variant="text" />
                <Skeleton height={52} variant="text" />
                <Skeleton height={52} variant="text" />
                <Skeleton height={52} variant="text" />
              </div>
            )}
            {/* Display error state */}
            {erc20TokensQuery.isFetched && erc20TokensQuery.isError && (
              <>
                <p>There was a problem while loading ERC20 tokens of your wallet.</p>
                <Button variant="contained" onClick={() => erc20TokensQuery.refetch()}>
                  Retry
                </Button>
                <Typography variant="caption" display="block" gutterBottom mt="1.5rem">
                  Technical details: {erc20TokensQuery.error.message}
                </Typography>
              </>
            )}
            {/* Display success state */}
            {erc20TokensQuery.isFetched && erc20TokensQuery.isSuccess && (
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Token name</TableCell>
                    <TableCell>Symbol</TableCell>
                    <TableCell align="right">Balance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {erc20TokensQuery.data.map((token: any) => (
                    <TableRow key={token.symbol}>
                      <TableCell> {token.name} </TableCell>
                      <TableCell> {token.symbol} </TableCell>
                      <TableCell align="right"> {token.balance} </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Paper>
        )}
      </main>

      <footer className={styles.footer}>
        <a href="https://rainbow.me" rel="noopener noreferrer" target="_blank">
          Made with ❤️ by your frens at 🌈
        </a>
      </footer>
    </div>
  );
};

export default Home;
