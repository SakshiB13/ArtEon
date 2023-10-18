import React from "react"
import { motion } from "framer-motion"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/config/firebase"

const Layout = ({ children, type }) => {
  const [user, loading] = useAuthState(auth)
  return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.35, delay: 0.25 }}
      >
        <div className="mt-[20vh] pb-[10vh] min-h-screen ">{children}</div>
      </motion.div>
  )
}

export default Layout
