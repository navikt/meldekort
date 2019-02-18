export function erLocalhost() {
    const host: string = window.location.host;
    return host.includes('localhost') || host.includes('127.0.0.1');
}

export function erMock(): boolean {
    return process.env.REACT_APP_MOCK_FULL === 'true';
}