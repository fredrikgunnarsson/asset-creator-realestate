import https from 'https'

const ip = async (req, res) => {
  const url = req.query.url

  if (!url) {
    res.status(400).send('Missing required parameter: "url"')
    return
  }

  const response = await https.get(url)

  response.pipe(res)

  // res.status(200).send(`The provided URL is: ${url}`)
}
export default ip
