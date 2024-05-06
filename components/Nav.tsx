import { Breadcrumbs } from '@mui/material';
import Link from 'next/link';

export default function Nav() {
  return (
    <Breadcrumbs sx={{ marginBottom: '1rem' }}>
      <Link href="/">Home</Link>
      <Link href="/leaderboard">Leaderboard</Link>
    </Breadcrumbs>
  );
}
