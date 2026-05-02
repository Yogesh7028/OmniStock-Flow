import PageWrapper from "../../components/animations/PageWrapper";
import Table from "../../components/common/Table";
import SectionHeader from "../../components/common/SectionHeader";

function EntityTablePage({ eyebrow, title, description, columns, data }) {
  return (
    <PageWrapper className="space-y-6">
      <SectionHeader eyebrow={eyebrow} title={title} description={description} />
      <Table columns={columns} data={data} />
    </PageWrapper>
  );
}

export default EntityTablePage;
