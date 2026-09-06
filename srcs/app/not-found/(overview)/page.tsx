import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p className="text-(--t-content)">Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  )
}