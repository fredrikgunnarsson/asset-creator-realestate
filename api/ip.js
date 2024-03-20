const ip = (req, res) => {
  res.status(200).json({ request: req, response: res })
}
export default ip
