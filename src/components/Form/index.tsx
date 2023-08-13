import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { IFireArgs } from 'utils/types';
import { useState } from 'react';
import { generateFireUrl } from 'utils/api'

interface IProps {
    fireCauses: string[];
    fireStatuses: string[];
    geographicDescriptions: string[];
    fetchFires: (args: IFireArgs) => void;
}

export default function Form({ fireCauses, fireStatuses, geographicDescriptions, fetchFires }: IProps) {
    const [fireStatus, setFireStatus] = useState<string | null>(null);
    const [fireCause, setFireCause] = useState<string | null>(null);
    const [geographicDescription, setGeographicDescription] = useState<string | null>(null);

    const refetchData = () => {
        fetchFires({
            fireCause: fireCause || undefined,
            fireStatus: fireStatus || undefined,
            geographicDescription: geographicDescription || undefined,
        })
    }

    return (
        <Stack spacing={2} sx={{ paddingTop: 2 }}>
            <Typography variant='h4'>Filter Fires</Typography>
            <Autocomplete
                disablePortal
                id="fire-status-select"
                options={fireStatuses}
                freeSolo
                value={fireStatus}
                renderInput={(params) => <TextField {...params} label="Fire Status" />}
                onChange={(_event: any, newValue: string | null) => {
                    setFireStatus(newValue);
                }}
                onBlur={(event: any) => {
                    setFireStatus(event.target.value);
                }}
            />
            <Autocomplete
                disablePortal
                id="fire-cause-select"
                options={fireCauses}
                freeSolo
                value={fireCause}
                renderInput={(params) => <TextField {...params} label="Fire Cause" />}
                onChange={(_event: any, newValue: string | null) => {
                    setFireCause(newValue);
                }}
                onBlur={(event: any) => {
                    setFireCause(event.target.value);
                }}
            />
            <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={geographicDescriptions}
                freeSolo
                value={geographicDescription}
                onChange={(_event: any, newValue: string | null) => {
                    setGeographicDescription(newValue);
                }}
                onBlur={(event: any) => {
                    setGeographicDescription(event.target.value);
                }}
                renderInput={(params) => <TextField {...params} label="Geographic Description" />}
            />
            <Stack direction='row' justifyContent='end' spacing={2}>
                <Button color='warning' variant='contained'>Clear Filters</Button>
                <Button color='primary' variant='contained' onClick={() => refetchData()}>Apply</Button>
            </Stack>
            <Button color='primary' variant='contained' href={generateFireUrl({
                fireCause: fireCause || undefined,
                fireStatus: fireStatus || undefined,
                geographicDescription: geographicDescription || undefined,
            }, true)}>Download CSV</Button>
        </Stack >
    );
}
