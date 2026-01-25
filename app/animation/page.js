"use client"
import { ReactLenis, useLenis } from 'lenis/react'
export default function App() {
  const lenis = useLenis((lenis) => {
    // called every scroll
    console.log(lenis)
  })

	return (
		<div className="flex justify-center items-center h-screen">
			<div className="box text-9xl font-bold">Animation</div>
		</div>
	);
}