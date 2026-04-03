function GlobalHeader() {
  return <div className="bg-[#e5e7eb] h-[64px] shrink-0 w-[1440px]" data-name="Global Header" />;
}

function PrimarySidebar() {
  return <div className="bg-[#d1d5db] h-[960px] shrink-0 w-[260px]" data-name="Primary Sidebar" />;
}

function DataCard() {
  return (
    <div className="bg-white content-stretch flex flex-col font-normal gap-[8px] items-start leading-[normal] not-italic overflow-clip p-[16px] relative shrink-0 text-black" data-name="Data Card">
      <p className="font-['Inter:Regular',sans-serif] relative shrink-0 text-[12px] text-nowrap">Total Students</p>
      <p className="font-['Inter:Regular','Noto_Sans:Regular',sans-serif] relative shrink-0 text-[24px] w-[82px]">{` 1,248 `}</p>
    </div>
  );
}

function SectionWrapper() {
  return (
    <div className="bg-white content-between flex flex-wrap gap-[16px] h-[132px] items-center justify-center overflow-clip p-[24px] relative shrink-0" data-name="Section Wrapper">
      <div className="font-['Inter:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[12px] text-black text-nowrap">
        <p className="mb-0">{`Section Content `}</p>
        <p>&nbsp;</p>
      </div>
      {[...Array(4).keys()].map((_, i) => (
        <DataCard key={i} />
      ))}
    </div>
  );
}

function ContentWorkspace() {
  return (
    <div className="bg-[#f3f4f6] content-stretch flex flex-col h-[960px] items-start overflow-clip px-[113px] py-[17px] relative shrink-0 w-[1180px]" data-name="Content Workspace">
      <SectionWrapper />
    </div>
  );
}

export default function AppShell() {
  return (
    <div className="bg-white content-end flex flex-wrap gap-0 items-end relative size-full" data-name="App Shell">
      <GlobalHeader />
      <PrimarySidebar />
      <ContentWorkspace />
    </div>
  );
}