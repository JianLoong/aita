export interface Submission {
    id: number,
    submission_id: string,
    title: string,
    selftext: string,
    created_utc: number,
    permalink: string,
    score: number,
    replies: string[]
}