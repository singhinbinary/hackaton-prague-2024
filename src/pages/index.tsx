import * as React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import type { Navigation, Router } from '@toolpad/core';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';

import Image from 'next/image';
import { createTheme } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import NetworkIcon from '@mui/icons-material/Hub';
import TableChartIcon from '@mui/icons-material/TableChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import Logo from '../logo.png';

// components
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SocialGraph from '../components/SocialGraph/SocialGraph';
import Portfolio from '../components/Portfolio/Portfolio';
import StorageHeatmap from '../components/StorageHeatmap/StorageHeatmap';

const NAVIGATION: Navigation = [
  {
    segment: 'home',
    title: 'Home',
    icon: <HomeIcon />,
  },
  {
    segment: 'interactions',
    title: 'Interactions Graph',
    icon: <NetworkIcon />,
  },
  {
    segment: 'storage',
    title: 'Storage Heatmap',
    icon: <TableChartIcon />,
  },
  {
    segment: 'portfolio',
    title: 'Portfolio Chart',
    icon: <PieChartIcon />,
  },
];

const demoTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }: { pathname: string }) {
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      {pathname == '/home' && (
        <div style={{ paddingTop: '5rem' }}>
          <Typography
            style={{ paddingRight: '20rem', paddingLeft: '20rem' }}
            variant="h2"
            gutterBottom
          >
            Welcome to the 🆙 Social Graph dApp!
          </Typography>
          <Typography
            style={{ paddingRight: '20rem', paddingLeft: '20rem' }}
            variant="h6"
            gutterBottom
          >
            Explore the different data visualisation tools on the sidebar menu
            to display different informations about your Universal Profile, or
            any UP! 🔍
          </Typography>
        </div>
      )}
      {pathname == '/interactions' && (
        <>
          <Typography>
            Visualise the interactions that your 🆙 or any UP address made
            through a network visualisation graph.
          </Typography>
          <SocialGraph />
        </>
      )}
      {pathname == '/storage' && (
        <>
          <Typography>
            Analyse the content of each data key in your 🆙 storage and how much
            space it takes through a heatmap visualisation.
          </Typography>
          <StorageHeatmap />
        </>
      )}
      {pathname == '/portfolio' && (
        <>
          <Typography>
            Discover what your 🆙 portfolio of assets is made of.
          </Typography>
          <Portfolio />
        </>
      )}
    </Box>
  );
}

export default function DashboardLayoutBranding(props: any) {
  const { window } = props;

  const [pathname, setPathname] = React.useState('/home');

  const router = React.useMemo<Router>(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  // Remove this const when copying and pasting into your project.
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION}
      branding={{
        logo: (
          <>
            <Image
              src={Logo}
              alt="UP Social Graph logo"
              width={36}
              height={36}
            />
            {/* <Box
              component="form"
              sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
              noValidate
              autoComplete="off"
            >
              <TextField id="filled-basic" label="Filled" variant="filled" />
            </Box> */}
          </>
        ),
        title: 'UP Social Graph',
      }}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        <DemoPageContent pathname={pathname} />
      </DashboardLayout>
    </AppProvider>
  );
}
