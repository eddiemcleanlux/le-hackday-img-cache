function getBingImage(searchString) {
  const url = `https://api.cognitive.microsoft.com/bing/v7.0/images/search?q=${encodeURIComponent(searchString)}&count=1&safeSearch=Strict&imageType=Photo`;
  return fetch(url, {
    headers: {
      'Ocp-Apim-Subscription-Key': process.env.BING_API_KEY,
    },
  })
    .then(res => res.json())
    .then(data => {
      if (data.value.length === 0) {
        return null;
      }

      return data.value[0].thumbnailUrl;
    })
    .catch((e) => {
      console.log('error', e);
      return null;
    });
}

module.exports = {
  getBingImage,
};
