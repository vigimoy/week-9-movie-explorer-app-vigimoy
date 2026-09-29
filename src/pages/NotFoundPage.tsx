import { EmptyState } from '@/components/States';
export default function NotFoundPage() {
  return <div className="page-container list-page"><EmptyState title="Page not found" description="The page you are looking for does not exist." explore /></div>;
}

