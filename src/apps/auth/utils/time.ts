export function getCurrentTimestamp() {
    const now = new Date();
    const formattedTimestamp = now
        .toISOString()
        .replace("T", " ")
        .replace(/\.\d+Z$/, "");
    return formattedTimestamp;
}
