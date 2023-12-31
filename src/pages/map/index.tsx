import Head from 'next/head'
import Map from 'components/Map'
import FireList from 'components/FireList'
import Alert from 'components/Alert'
import Form from 'components/Form'
import { Grid, Paper, Backdrop, CircularProgress, Divider, Stack, Typography } from '@mui/material'
import { fetchAllFires } from 'utils/api';
import { useState, useEffect } from 'react';
import { IFireArgs } from 'utils/types'
import { getSession, GetSessionParams } from "next-auth/react"
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { IFireDataShort } from 'utils/types'
import { navHeight } from 'styles/constants'

const filterResultValues = (results: GeoJSON.FeatureCollection, key: string) => {
    return [...Array.from(new Set(results.features.map(feat => feat.properties?.[key])))].filter(val => val)
}

export default function MapPage() {
    const [fireGeoJSON, setFireGeoJSON] = useState<null | GeoJSON.FeatureCollection>(null)
    const [fireStatuses, setFireStatuses] = useState<string[]>([]);
    const [fireCauses, setFireCauses] = useState<string[]>([]);
    const [geographicDescriptions, setGeographicDescriptions] = useState<string[]>([]);

    const [firesInfo, setFiresInfo] = useState<IFireDataShort[]>([]);
    const [activeFireId, setActiveFireId] = useState<number>();

    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState(false);

    const theme = useTheme();
    const smBreakUp = useMediaQuery(theme.breakpoints.up('md'));

    const fetchFires = (args?: IFireArgs) => {
        setLoading(true);
        setApiError(false);
        setActiveFireId(undefined);
        fetchAllFires(args).then(results => {
            setFireGeoJSON(results);
            setFiresInfo(results.features.map(feature => ({
                cause: feature.properties?.FIRE_CAUSE as string,
                status: feature.properties?.FIRE_STATUS as string,
                name: feature.properties?.INCIDENT_NAME as string,
                url: feature.properties?.FIRE_URL as string,
                id: feature.properties?.FIRE_ID as number,
                location: feature.properties?.GEOGRAPHIC_DESCRIPTION as string,
                fireStart: feature.properties?.IGNITION_DATE as string,
                fireEnd: feature.properties?.FIRE_OUT_DATE as string,
            })))
            if (args?.setOptions) {
                setFireStatuses(filterResultValues(results, 'FIRE_STATUS'))
                setGeographicDescriptions(filterResultValues(results, 'GEOGRAPHIC_DESCRIPTION'));
                setFireCauses(filterResultValues(results, 'FIRE_CAUSE'))
            }
        }).then(() => {
            setLoading(false)
        })
            .catch((err) => {
                setLoading(false);
                setApiError(true);
            })
    }

    const handleFeatureClick = (id: number) => {
        setActiveFireId(id)
    }

    useEffect(() => {
        fetchFires({ setOptions: true })
    }, [])

    return (
        <main>
            <Head>
                <title>WildFire</title>
                <meta name="description" content="Wildfire BC Tracker" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
                    crossOrigin=""
                />
                <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
                    integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
                    crossOrigin="" async />
            </Head>
            <Alert open={apiError} handleClose={() => setApiError(false)}></Alert>
            <Grid container sx={{ height: `calc(100vh - ${navHeight})` }} >
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={loading}
                    transitionDuration={500}
                >
                    <Stack alignItems={'center'} spacing={2}>
                        <CircularProgress color="inherit" />
                        <Typography>Fetching Fire Data...</Typography>
                    </Stack>
                </Backdrop>
                <Grid item xs={12} md={3} sx={{ height: '100%' }}>
                    <Paper sx={{ height: "100%", zIndex: 500, position: 'relative' }} elevation={4} >
                        <Stack sx={{ height: "100%", marginX: 2 }}>
                            <Form
                                fireStatuses={fireStatuses}
                                fireCauses={fireCauses}
                                geographicDescriptions={geographicDescriptions}
                                fetchFires={fetchFires}
                            />
                            <Divider sx={{ my: 2 }} />
                            <FireList
                                fires={firesInfo}
                                activeFireId={activeFireId}
                                setActiveFireId={setActiveFireId}
                            />
                        </Stack>
                    </Paper>
                </Grid>
                {/* Include map on medium+  devices */}
                {smBreakUp && (
                    <Grid item xs={12} md={9} sx={{ height: '100%' }}>
                        <Map
                            fireGeoJSON={fireGeoJSON}
                            onFeatureClick={handleFeatureClick}
                            activeFireId={activeFireId}
                        />
                    </Grid>
                )}
            </Grid>
        </main>
    )
}

export const getServerSideProps = async (context: GetSessionParams) => {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/'
            }
        }
    }

    return {
        props: { session }
    }
}