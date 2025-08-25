export const CONTEST = $state({
    url: process?.env?.CONTEST_URL || 'https://localhost:8443/api/',
    user: process?.env?.CONTEST_USER || 'admin',
    password: process?.env?.CONTEST_PASSWORD || 'adm1n'
});