async function searchUnsplash(query: string) {
  try {
    const url = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=5`
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    })
    const data = await res.json() as any;
    console.log(`--- Results for: ${query} ---`)
    if (data.results && data.results.length > 0) {
      data.results.forEach((photo: any, index: number) => {
        console.log(`${index}: ID: ${photo.id} | Desc: ${photo.description || photo.alt_description} | URL: ${photo.urls.raw}`)
      })
    } else {
      console.log('No results')
    }
  } catch (err) {
    console.error('Error searching:', err)
  }
}

async function main() {
  await searchUnsplash('long sleeve t-shirt product')
  await searchUnsplash('silk underwear')
  await searchUnsplash('cargo pants product')
  await searchUnsplash('sport socks')
  await searchUnsplash('no show socks')
  await searchUnsplash('woolen sleeping socks')
  await searchUnsplash('silk scarf fashion')
}

main()
