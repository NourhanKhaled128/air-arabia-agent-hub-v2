import PageHeader from "@/components/PageHeader";
import ImportantLinksFull from "@/components/ImportantLinksFull";
import { getVisibleImportantLinks } from "@/lib/important-link-service";

export default async function ImportantLinksPage() {
  const links = await getVisibleImportantLinks();

  return (
    <>
      <PageHeader
        title="Important Links"
        subtitle="Every quick-access link agents need, in one place."
      />

      <ImportantLinksFull links={links} />
    </>
  );
}
