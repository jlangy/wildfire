import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { IFireArgs } from 'utils/types';
import { useState } from 'react';
import { generateFireUrl } from 'utils/api'
import RefreshIcon from '@mui/icons-material/Refresh';

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
    const [filtersChanged, setFiltersChanged] = useState(false);

    const refetchData = () => {
        fetchFires({
            fireCause: fireCause || undefined,
            fireStatus: fireStatus || undefined,
            geographicDescription: geographicDescription || undefined,
        });
        setFiltersChanged(false);
    }

    return (
        <Stack spacing={2} sx={{ paddingTop: 2 }}>
            <div>
                <Stack direction='row' justifyContent={'space-between'} alignItems='center'>
                    <Typography variant='h5'>Filter Fires</Typography>
                    {filtersChanged && (
                        <Chip
                            label="Filters Changed"
                            size='small'
                            title='There are pending filter changes. Click the Apply Filters button below to refresh the data'
                            icon={<RefreshIcon />}
                        />
                    )}
                </Stack>
                <Typography variant='subtitle1' sx={{ marginTop: 0, fontSize: '13px' }}>Fill in the fields below and click &quot; APPLY FILTERS &quot; to filter down fire results. Clear all fields to see all results from 2023.</Typography>
            </div>
            <Autocomplete
                disablePortal
                id="fire-status-select"
                options={fireStatuses}
                size="small"
                freeSolo
                value={fireStatus}
                renderInput={(params) => <TextField {...params} label="Fire Status" />}
                onChange={(_event: any, newValue: string | null) => {
                    setFiltersChanged(true);
                    setFireStatus(newValue);
                }}
                onBlur={(event: any) => {
                    setFiltersChanged(true);
                    setFireStatus(event.target.value);
                }}
            />
            <Autocomplete
                disablePortal
                id="fire-cause-select"
                size='small'
                options={fireCauses}
                freeSolo
                value={fireCause}
                renderInput={(params) => <TextField {...params} label="Fire Cause" />}
                onChange={(_event: any, newValue: string | null) => {
                    setFiltersChanged(true);
                    setFireCause(newValue);
                }}
                onBlur={(event: any) => {
                    setFiltersChanged(true);
                    setFireCause(event.target.value);
                }}
            />
            <Autocomplete
                disablePortal
                id="fire-geographic-description-select"
                size='small'
                options={geographicDescriptions}
                freeSolo
                value={geographicDescription}
                onChange={(_event: any, newValue: string | null) => {
                    setFiltersChanged(true);
                    setGeographicDescription(newValue);
                }}
                onBlur={(event: any) => {
                    setFiltersChanged(true);
                    setGeographicDescription(event.target.value);
                }}
                renderInput={(params) => <TextField {...params} label="Geographic Description" />}
            />
            <Button
                data-testid="apply-filter-btn"
                disabled={!filtersChanged}
                color='success'
                variant='contained'
                onClick={() => refetchData()}
            >Apply Filters</Button>
            <Button color='primary' variant='contained' href={generateFireUrl({
                fireCause: fireCause || undefined,
                fireStatus: fireStatus || undefined,
                geographicDescription: geographicDescription || undefined,
            }, true)}>Download as CSV</Button>
        </Stack >
    );
}
