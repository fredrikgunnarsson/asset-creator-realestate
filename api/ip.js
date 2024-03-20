const ip = (req, res) => {
  console.log(req)
  res.status(200).json({ message: req })
}
export default ip
