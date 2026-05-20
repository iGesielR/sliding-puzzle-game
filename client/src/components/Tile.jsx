import { motion } from 'framer-motion'

function Tile({ number, onClick }) {
  if (!number) {
    return <div className="tile empty"></div>
  }

  return (
    <motion.button
      layout
      whileTap={{ scale: 0.95 }}
      className="tile"
      onClick={onClick}
    >
      {number}
    </motion.button>
  )
}

export default Tile