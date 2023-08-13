import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from 'styles/Home.module.css'
import Map from 'components/Map'
import FireList from 'components/FireList'
import Alert from 'components/Alert'
import Form from 'components/Form'
import { Container, Grid, Paper, Backdrop, CircularProgress, Divider, Stack } from '@mui/material'
import { fetchAllFires } from 'utils/api';
import { useState, useEffect } from 'react';
import type { GeoJSON } from 'react-leaflet'
import { IFireArgs } from 'utils/types'
import { useSession, signIn, signOut, getSession, SessionContextValue, GetSessionParams } from "next-auth/react"
import {GetServerSideProps, Redirect} from 'next';
import {Session} from 'next-auth'

const inter = Inter({ subsets: ['latin'] })

const filterResultValues = (results: GeoJSON.FeatureCollection, key: string) => {
    return [...Array.from(new Set(results.features.map(feat => feat.properties?.[key])))].filter(val => val)
}

export default function Home() {
    const [fireGeoJSON, setFireGeoJSON] = useState<null | GeoJSON.FeatureCollection>(null)
    const [fireStatuses, setFireStatuses] = useState<string[]>([]);
    const [fireCauses, setFireCauses] = useState<string[]>([]);
    const [geographicDescriptions, setGeographicDescriptions] = useState<string[]>([]);

    const [firesInfo, setFiresInfo] = useState<{cause: string, name: string, status: string, url: string, id: number, location: string}[]>([]);
    const [activeFireId, setActiveFireId] = useState<number>();
    
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(false);

    const fetchFires = (args?: IFireArgs) => {
        setLoading(true)
        fetchAllFires(args).then(results => {
            setFireGeoJSON(results);
            setFiresInfo(results.features.map(feature => ({
                cause: feature.properties?.FIRE_CAUSE as string,
                status: feature.properties?.FIRE_STATUS as string,
                name: feature.properties?.INCIDENT_NAME as string,
                url: feature.properties?.FIRE_URL as string,
                id: feature.properties?.FIRE_ID as number,
                location: feature.properties?.GEOGRAPHIC_DESCRIPTION as string
            })))
            if (args?.setOptions) {
                setFireStatuses(filterResultValues(results, 'FIRE_STATUS'))
                setGeographicDescriptions(filterResultValues(results, 'GEOGRAPHIC_DESCRIPTION'));
                setFireCauses(filterResultValues(results, 'FIRE_CAUSE'))
            }
        }).then(() => {
            setLoading(false)   
        })
        .catch(() => {
            setLoading(false);
            setApiError(true);
        })
    }

    const handleFeatureClick = (id: number) => {
        console.log(id)
        setActiveFireId(id)
    }

    useEffect(() => {
        fetchFires({ setOptions: true, fireStatus: 'fire of note' })
    }, [])

    return (
        <>
            <Head>
                <title>Wildfire</title>
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
            <main>
                <Alert open={apiError} handleClose={() => setApiError(false)}></Alert>
                <Grid container sx={{height: 'calc(100vh - 70px)'}} >
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={loading}
                        transitionDuration={500}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                    <Grid item xs={12} md={3} sx={{height: '100%'}}>
                        <Paper sx={{ height: "100%", zIndex: 500, position: 'relative' }} elevation={4} >
                            <Stack sx={{ height: "100%", marginX: 2 }}>
                                <Form
                                    fireStatuses={fireStatuses}
                                    fireCauses={fireCauses}
                                    geographicDescriptions={geographicDescriptions}
                                    fetchFires={fetchFires}
                                />
                                <Divider sx={{my: 2}}/>
                                <FireList 
                                    fires={firesInfo}
                                    activeFireId={activeFireId}
                                    setActiveFireId={setActiveFireId}
                                />
                            </Stack>   
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={9} sx={{height: '100%'}}>
                        <Map 
                            fireGeoJSON={fireGeoJSON}
                            onFeatureClick={handleFeatureClick}
                            activeFireId={activeFireId}
                        />
                    </Grid>
                </Grid>
            </main>
        </>
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
        props: {session}
    }
}