"use client"

import { useEffect } from "react"

type Theme = "light" | "dark" | "system"

export function ThemeProvider({ theme, children }: { theme: Theme, children: React.ReactNode }) {
  useEffect(() => {
    const root = window.document.documentElement
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    let applied: "dark" | "light"
    if (theme === "system") {
      applied = systemDark ? "dark" : "light"
    } else {
      applied = theme
    }
    if (applied === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [theme])
  return <>{children}</>
}