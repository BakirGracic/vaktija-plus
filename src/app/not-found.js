import Link from "next/link";

export default function NotFound() {
    return (
        <section className="text-center p-6">
			<h1 className="text-5xl font-bold mb-4">404</h1>
			<p className="mb-6 font-light">Page Not Found!</p>
            <Link href='/'>BACK TO HOMEPAGE</Link>
		</section>
    )
}
