import {MovieInfo} from './MovieInfo';

export interface OmdbSearchResponse {
    Search?: MovieInfo[];
    totalResults?: string;
    Response: "True" | "False";
    Error?: string;
}