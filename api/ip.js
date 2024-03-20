const ip = (req, res) => {
  const url = req.query.url

  if (!url) {
    res.status(400).send('Missing required parameter: "url"')
    return
  }

  res.status(200).send(`The provided URL is: ${url}`)
}
export default ip
