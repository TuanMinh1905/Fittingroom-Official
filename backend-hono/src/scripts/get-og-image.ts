async function getOgImage(id: string) {
  try {
    const url = `https://unsplash.com/photos/${id}`
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    })
    const html = await res.text()
    const match = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/)
    if (match && match[1]) {
      // Unsplash og:image URL is like https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=...
      // We want to extract the photo path part
      const cleanUrl = match[1].split('?')[0]
      console.log(`${id} -> ${cleanUrl}`)
    } else {
      console.log(`${id} -> NOT FOUND (OG image tag not found)`)
    }
  } catch (err) {
    console.error(`Error for ${id}:`, err)
  }
}

async function main() {
  const ids = ['A7f7XRKgUWc', 'Cn3s6bVVHNo', 'd5GlpSOAzzg', 'XMg8GBzNmgA', 'axt96zsVXL8', 'AV30EuHJaNM']
  for (const id of ids) {
    await getOgImage(id)
  }
}

main()
