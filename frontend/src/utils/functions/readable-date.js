function getReadableDate(date){
    const readableDate = new Date(date).toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    month: 'long',
    day: 'numeric',
    year: 'numeric'
    })

    return readableDate; //June 15, 2025 at 1:35 PM
}

export default getReadableDate