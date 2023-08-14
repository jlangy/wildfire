import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import * as React from 'react';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Slide from '@mui/material/Slide';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import { IFireDataShort } from 'utils/types';
interface IProps {
    fires: IFireDataShort[],
    setActiveFireId: (id: number) => void,
    activeFireId?: number,
}

export default function FireList({ fires, activeFireId, setActiveFireId }: IProps) {

    const [page, setPage] = React.useState(1);
    useEffect(() => {

        // Scroll element into view. Timeout to allow animation to complete.
        setTimeout(() => {
            const element = document.getElementById(String(activeFireId))
            element?.scrollIntoView({ behavior: 'smooth' })
        }, 100);
        
        const fireIndex = fires.findIndex(fire => fire.id === activeFireId);
        if (fireIndex !== -1) {
            setOpen(true);
            setPage(Math.floor(fireIndex / 10) + 1);
        } else {
            setPage(1);
        }
    }, [activeFireId, fires]);

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const [open, setOpen] = useState(false);
    const paginationCount = Math.floor(fires.length / 10) + (fires.length % 10 === 0 ? 0 : 1);

    return (
        <>
            <Stack alignItems={'center'} direction='column' sx={{ zIndex: 500, position: 'sticky', top: 0, height: '48px', boxShadow: '0 15px 10px -10px #F2F2F2' }}>
                <Pagination count={paginationCount} page={page} onChange={handleChange} size="small" />
                <Typography variant='subtitle2'>Viewing page {page} of {paginationCount}.</Typography>
            </Stack>
            <Box sx={{ width: '100%', height: '100%', bgcolor: 'background.paper', overflow: 'scroll', mb: 2 }}>
                <List sx={{ width: '100%', height: '100%' }}>
                    {fires
                        .slice((page - 1) * 10, (page) * 10)
                        .map(fire => (
                            <Box id={String(fire.id)} key={fire.id} onClick={() => setOpen(!open)}>
                                <ListItem
                                    key={fire.id}
                                    onClick={() => setActiveFireId(fire.id)}
                                    sx={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', padding: '0.3em', }}
                                >
                                    <Typography variant='h6' sx={{ textTransform: 'capitalize', fontWeight: fire.id === activeFireId ? "bold" : 'light', p: 0, m: 0 }}> {fire.name?.toLowerCase() || 'Unnamed Incident'}</Typography>
                                    <Box>
                                        {(open && fire.id === activeFireId) ? <ExpandLess /> : <ExpandMore />}
                                    </Box>
                                </ListItem>
                                {fire.id === activeFireId && (
                                    <Collapse in={open} timeout="auto" unmountOnExit>
                                        <List sx={{ padding: 0, pl: 1, m: 1, mt: 0, borderLeft: '4px solid #606060' }}>
                                            <ListItem sx={{ p: 0, pb: 1 }}>
                                                <Typography><strong>Location:</strong> {fire.location}</Typography>
                                            </ListItem>
                                            <ListItem sx={{ p: 0, pb: 1 }}>
                                                <Typography><strong>Started:</strong> {fire.fireStart}</Typography>
                                            </ListItem>
                                            {fire.fireEnd && (
                                                <ListItem sx={{ p: 0, pb: 1 }}>
                                                    <Typography><strong>End Date:</strong> {fire.fireEnd}</Typography>
                                                </ListItem>
                                            )}
                                            <ListItem sx={{ p: 0, pb: 1 }}>
                                                <Typography><strong>Cause:</strong> {fire.cause}</Typography>
                                            </ListItem>
                                            <ListItem sx={{ p: 0, pb: 1 }}>
                                                <Typography><strong>Status:</strong> {fire.status}</Typography>
                                            </ListItem>
                                            <ListItem sx={{ p: 0 }}>
                                                <Link href={fire.url} target="_blank">
                                                    <Stack direction="row" alignItems={'center'}>More Information<OpenInNewIcon fontSize="small" /></Stack>
                                                </Link>
                                            </ListItem>
                                        </List>
                                    </Collapse>
                                )}
                                <Divider />
                            </Box>
                        ))}
                </List>
            </Box>
        </>
    );
}