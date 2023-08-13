import {useEffect} from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

interface IProps {
    fires: { cause: string, name: string, status: string, url: string, id: number, location: string }[],
    setActiveFireId: (id: number) => void,
    activeFireId?: number,
}

export default function FireList({ fires, activeFireId, setActiveFireId }: IProps) {

    useEffect(() => {
        const element = document.getElementById(String(activeFireId)) 
        element?.scrollIntoView({behavior: 'smooth'})
    }, [activeFireId])

    return (
        <>
            <Box sx={{ width: '100%', bgcolor: 'background.paper', overflow: 'scroll', mb: 2 }}>
                <Typography variant='h5'>Results</Typography>
                <nav aria-label="main mailbox folders">
                    <List sx={{ width: '100%' }}>
                        {fires.map(fire => (
                            <div id={String(fire.id)} key={fire.id}>
                                <ListItem disablePadding key={fire.id} onClick={() => setActiveFireId(fire.id)} sx={{cursor: 'pointer'}}>
                                    <Typography variant="h6" sx={{textTransform: 'capitalize'}}> {fire.name?.toLowerCase() || 'Unnamed Incident'}</Typography>
                                </ListItem>
                                {fire.id === activeFireId && (
                                    <List sx={{ padding: 0, pl: 1 }}>
                                        <ListItem sx={{ p: 0 }}>
                                            <Typography><strong>Location:</strong> {fire.location}</Typography>
                                        </ListItem>
                                        <ListItem sx={{ p: 0 }}>
                                            <Typography><strong>Cause:</strong> {fire.cause}</Typography>
                                        </ListItem>
                                        <ListItem sx={{ p: 0 }}>
                                            <Typography><strong>Status:</strong> {fire.status}</Typography>
                                        </ListItem>
                                        <ListItem sx={{ p: 0 }}>
                                            <Link href={fire.url} target="_blank">
                                                <Stack direction="row" alignItems={'center'}>More Information<OpenInNewIcon fontSize="small" /></Stack>
                                            </Link>
                                        </ListItem>
                                    </List>
                                )}
                                <Divider></Divider>
                            </div>
                        ))}
                    </List>
                </nav>
            </Box>
        </>
    );
}