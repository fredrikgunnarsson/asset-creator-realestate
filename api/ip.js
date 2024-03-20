const ip = (req, res) => {
  console.log(req)
  res.status(200).json({ message: process.env })
}
export default ip
