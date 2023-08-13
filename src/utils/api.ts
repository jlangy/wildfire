import { IFireArgs } from 'utils/types'

interface IQueryParams {
    service?: string;
    version?: string;
    request?: string;
    srsName?: string;
    typeName?: string;
    outputFormat?: string;
}

const defaultParams: IQueryParams = {
    service: 'WFS',
    version: '2.0.0',
    request: 'GetFeature',
    srsName: 'EPSG:4326',
    typeName: 'pub:WHSE_LAND_AND_NATURAL_RESOURCE.PROT_CURRENT_FIRE_PNTS_SP',
}

export const generateFireUrl = (args?: IFireArgs, asCSV: boolean = false) => {
    const outputformat = {outputFormat: asCSV ? 'csv' : 'application/json'}
    
    let filter = '';
    if (args?.geographicDescription) filter += `GEOGRAPHIC_DESCRIPTION ILIKE '%${args?.geographicDescription}%'`;
    if (args?.fireCause) filter += `${filter ? ' AND ' : ''}FIRE_CAUSE ILIKE '%${args?.fireCause}%'`;
    if (args?.fireStatus) filter += `${filter ? ' AND ' : ''}FIRE_STATUS ILIKE '%${args?.fireStatus}%'`;
    
    const rawParams = filter ? { ...defaultParams, ...outputformat, cql_filter: filter } : { ...defaultParams, ...outputformat };
    const urlParams = new URLSearchParams(rawParams)
    
    return `https://openmaps.gov.bc.ca/geo/pub/ows?${urlParams}`
}

export const fetchAllFires = (args?: IFireArgs) => {
    const url = generateFireUrl(args)
    return fetch(url)
        .then(res => res.json() as Promise<GeoJSON.FeatureCollection>)
}
