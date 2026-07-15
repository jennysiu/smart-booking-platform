export const API_BASE = 'http://localhost:3000'

// In-memory token store — never localStorage
let accessToken: string | null = null
export const getAccessToken = () => accessToken
export const setAccessToken = (token: string | null) => { accessToken = token }
