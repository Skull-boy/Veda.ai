import { redirect } from 'next/navigation';

export default function OldResultPage({ params }: { params: { id: string } }) {
  redirect(`/assignments/${params.id}`);
}
