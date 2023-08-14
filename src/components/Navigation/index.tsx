import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import styles from './navigation.module.css'
import { useSession, signIn, signOut } from "next-auth/react"
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import Head from 'next/head'
import Link from 'next/link';
import {navHeight} from 'styles/constants'

const pages = ['map'];

function ResponsiveAppBar() {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const { data: session } = useSession();

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElUser(event.currentTarget);
    const handleCloseNavMenu = () => setAnchorElNav(null);
    const handleCloseUserMenu = () => setAnchorElUser(null);

    const handleAuth = () => {
        if (session) {
            signOut()
        } else {
            signIn();
        }
    }

    return (
        <AppBar position="static" elevation={4} className={styles.Navigation} sx={{ position: 'relative', zIndex: 501, height: navHeight, margin: 0 }}>
            <Head>
                <title>WildFire</title>
                <meta name="description" content="Wildfire BC Tracker" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <MenuItem
                        component={Link}
                        href="/"
                    >
                        <LocalFireDepartmentIcon sx={{ color: 'orange', mr: 1 }} />
                        <Typography
                            noWrap
                            sx={{
                                mr: 2,
                                letterSpacing: '.3rem',
                                fontFamily: 'cursive',
                                fontSize: '1.5rem',
                                color: 'orange',
                                textDecoration: 'none',
                            }}
                        >
                            WildFire
                        </Typography>
                    </MenuItem>



                    <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                onClick={handleCloseNavMenu}
                                component={Link}
                                sx={{ my: 2, pl: 2, color: 'white', display: 'block' }}
                                href={page}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 1 }}>
                        {session && (
                            <Stack direction='row' alignItems={'center'} justifyContent='flex-end' onClick={handleOpenUserMenu} sx={{ cursor: 'pointer' }}>
                                <Typography fontSize={16} sx={{ mr: 3 }} display={{ xs: 'none', sm: 'block' }}>{session.user?.email} </Typography>
                                <Tooltip title="Open settings">
                                    <IconButton sx={{ p: 0 }}>
                                        <Avatar alt="User Photo" src={session.user?.image || ''} />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        )}
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem
                                href={'/'}
                                component={Link}
                                sx={{ textTransform: 'capitalize', minWidth: '8rem' }}
                            >
                                Home
                            </MenuItem>
                            {pages.map((page) => (
                                    <MenuItem
                                        key={page}
                                        href={page}
                                        component={Link}
                                        sx={{ textTransform: 'capitalize', minWidth: '8rem' }}
                                    >
                                        {page}
                                    </MenuItem>
                            ))}
                            <Divider />
                            <MenuItem onClick={() => handleAuth()}>
                                <Typography textAlign="center">{session ? 'Logout' : 'Login'}</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default ResponsiveAppBar;