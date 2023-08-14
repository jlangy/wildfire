import * as React from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Fade from '@mui/material/Fade';
import AlertTitle from '@mui/material/AlertTitle';
import CloseIcon from '@mui/icons-material/Close';

interface IProps {
    open: boolean;
    handleClose: () => void;
}

export default function AlertMessage({ open, handleClose }: IProps) {
    return (
        <Box sx={{ width: '25%', position: 'absolute', bottom: '2rem', zIndex: 500, marginX: 'auto', left: 0, right: 0, visibility: open ? 'visible': 'hidden' }}>
            <Fade in={open}>
                <Alert
                    data-testid='error-banner'
                    severity='error'
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => handleClose()}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{ mb: 2, boxShadow: '1px 1px 6px black' }}
                >
                    <AlertTitle>
                        Error Getting Data
                    </AlertTitle>
                    There was an error fetching the requested data.
                </Alert>
            </Fade>
        </Box>
    );
}