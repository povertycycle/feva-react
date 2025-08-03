export function toHHMMSSMS(ms: number) {
    let rem = Math.floor(ms / 1000);
    const milliseconds = String(ms - rem * 1000).padStart(3, "0");
    const hours = String(Math.floor(rem / 3600)).padStart(2, "0");
    rem %= 3600;
    const minutes = String(Math.floor(rem / 60)).padStart(2, "0");
    rem %= 60;
    const seconds = String(rem).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}:${milliseconds}`;
}
