import { ReactNode } from 'react'

interface AdminLayoutProps {
  children: ReactNode
}

export default function Layout({ children }: AdminLayoutProps) {
  return children
}