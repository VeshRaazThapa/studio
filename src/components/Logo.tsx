import Link from 'next/link';
import { BookOpenText } from 'lucide-react';

const Logo = () => {
  return (
    <Link href="/" className="flex items-center space-x-2 text-primary hover:opacity-80 transition-opacity">
      <BookOpenText className="h-8 w-8" />
      <span className="text-2xl font-headline font-semibold">Edutube</span>
    </Link>
  );
};

export default Logo;
