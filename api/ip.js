import https from 'https'

const ip = async (req, res) => {
  const url = req.query.url

  if (!url) {
    res.status(400).send('Missing required parameter: "url"')
    return
  }

  https
    .get(url, (response) => {
      // 4. Receive response from the geofenced website
      // Set appropriate content type based on the response headers
      res.setHeader('Content-Type', response.headers['content-type'])

      // Pipe the data from the response to the client response
      response.on('data', (chunk) => {
        res.write(chunk)
      })

      // End the response when the response stream ends
      response.on('end', () => {
        res.end()
      })
    })
    .on('error', (err) => {
      console.error('Error making HTTP request:', err)
      res.status(500).send('Internal Server Error')
    })

  // res.status(200).send(`The provided URL is: ${url}`)
}
export default ip
