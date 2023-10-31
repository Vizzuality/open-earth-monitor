import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="h-full w-full bg-[url('/images/landing/prefooter.png')] bg-cover bg-center text-center text-secondary-500">
      <div className="flex h-full w-full max-w-[1200px] flex-col items-center justify-start space-y-5 pt-32">
        <h1 data-testid="404-error" className="text-[240px] font-black leading-[288px]">
          404
        </h1>
        <p className="font-inter text-4xl font-bold">Page not found.</p>
        <p>It looks like the link is broken or the page has been removed.</p>
        <Link
          href="/"
          className="rounded-sm bg-secondary-500 px-4 py-2 font-inter text-xs font-medium uppercase tracking-widest text-brand-500"
        >
          Go to homepage
        </Link>
      </div>
    </div>
  );
}
