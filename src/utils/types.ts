export interface IFireArgs {
    fireCause?: string,
    geographicDescription?: string,
    fireStatus?: string,
    setOptions?: boolean,
    asCSV?: boolean,
}

export interface IFireDataShort {
    cause: string, 
    name: string, 
    status: string, 
    url: string, 
    id: number, 
    location: string,
    fireStart: string,
    fireEnd: string,
}