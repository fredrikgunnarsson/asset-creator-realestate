const test = (req, res) => {
  console.dir(req)
  res.status(200).json({ message: 'Hello World!' })
}
export default test
