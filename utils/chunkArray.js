const chunkArray = (array, chunkSize) => {
    const size = Math.ceil(array.length / chunkSize);

    return Array(size)
        .fill()
        .map((_, index) => index * chunkSize)
        .map(begin => array.slice(begin, begin + chunkSize));
}

module.exports = chunkArray;