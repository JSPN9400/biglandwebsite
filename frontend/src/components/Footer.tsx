import { scrollToId } from '@/lib/scroll';

export default function Footer() {
  return (
    <footer className="border-t border-border py-8 text-center text-sm text-text-muted bg-surface">
      <div className="max-w-container mx-auto px-6">
        <p>&copy; {new Date().getFullYear()} BigLand Construction. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2">
          {/* Privacy Policy / Terms pages don't exist yet — add real pages
              before linking to them, rather than shipping more dead links. */}
          <button onClick={() => scrollToId('contact')} className="hover:text-text">Contact</button>
        </div>
        <p className="mt-6 text-[0.7rem] text-text-muted/70">
          Powered by JSPN9400
          <br />
          Built with React · FastAPI · PostgreSQL
        </p>
      </div>
    </footer>
  );
}
