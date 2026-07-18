import CardList from '../components/CardList';
import Footer from '../components/navigations/Footer';

interface BrowsePageProps {
  label: string;
  heading: string;
  category: string;
  badge: string;
}

const BrowsePage = ({ label, heading, category, badge }: BrowsePageProps) => (
  <div className="mt-16 bg-[#0d1b3e] min-h-screen">
    <CardList title={label} Category1={category} heading={heading} badge={badge} />
    <Footer />
  </div>
);

export default BrowsePage;
