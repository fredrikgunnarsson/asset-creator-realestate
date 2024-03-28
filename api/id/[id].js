const test = (req, res) => {
  console.dir(req.query)
  res.status(200).json({ message: req.query })
}
export default test
