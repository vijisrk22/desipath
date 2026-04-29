import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FlightTakeoff, 
  VolunteerActivism, 
  Search, 
  History,
  ShieldMoon,
  Info 
} from '@mui/icons-material';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const TravelCompanionLanding = () => {
  const user = useSelector(state => state.user.user);
  const navigate = useNavigate();

  const handleLinkClick = (e, link) => {
    if (!user) {
      e.preventDefault();
      // If user is not logged in, redirect to login
      navigate('/login', { state: { from: link } });
    }
  };
  const categories = [
    {
      title: "I Need a Travel Helper",
      subtitle: "For parents, seniors, or first-time travelers",
      icon: <FlightTakeoff sx={{ fontSize: 48, color: '#2563eb' }} />,
      link: "/travel-companion/post-request",
      btnText: "Post Request",
      color: "from-blue-50 to-blue-100"
    },
    {
      title: "I Want to Volunteer",
      subtitle: "Help others while completing your journey",
      icon: <VolunteerActivism sx={{ fontSize: 48, color: '#2563eb' }} />,
      link: "/travel-companion/post-volunteer",
      btnText: "Post Volunteering",
      color: "from-blue-50 to-blue-100"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow bg-gray-50 pt-4 pb-16 px-4 font-poppins">
      <div className="max-w-6xl mx-auto px-4 mb-4">
        <Link to="/" className="text-gray-500 hover:text-[#2563eb] text-sm font-medium font-dmsans">Home</Link>
        <span className="text-gray-400 mx-2 text-sm font-medium font-dmsans">{">"}</span>
        <span className="text-gray-900 text-sm font-bold font-dmsans">Travel Companion</span>
      </div>
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 font-dmsans">
          Travel Companion <span className="text-[#2563eb]">network</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
          Connecting travelers who need assistance with friendly volunteers on the same flight journey.
        </p>
      </div>

      {/* Main Categories */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 mb-16">
        {categories.map((cat, idx) => (
          <div key={idx} className={`bg-gradient-to-br ${cat.color} p-8 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 border border-white`}>
            <div className="bg-white p-4 rounded-2xl inline-block mb-6 shadow-sm">
              {cat.icon}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{cat.title}</h2>
            <p className="text-gray-600 mb-8 font-medium">
              {cat.subtitle}
            </p>
            <Link 
              to={cat.link}
              onClick={(e) => handleLinkClick(e, cat.link)}
              className="inline-block bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold px-8 py-3 rounded-full transition-colors shadow-sm"
            >
              {cat.btnText}
            </Link>
          </div>
        ))}
      </div>

      {/* Quick Access Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/travel-companion/browse-volunteers" className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all text-center border border-gray-100 group">
          <Search className="text-gray-400 group-hover:text-[#2563eb] mb-2 transition-colors" />
          <div className="text-sm font-bold text-gray-700">Browse Volunteers</div>
        </Link>
        <Link to="/travel-companion/browse-requests" className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all text-center border border-gray-100 group">
          <History className="text-gray-400 group-hover:text-[#2563eb] mb-2 transition-colors" />
          <div className="text-sm font-bold text-gray-700">Browse Requests</div>
        </Link>
        <Link 
          to="/travel-companion/my-posts" 
          onClick={(e) => handleLinkClick(e, "/travel-companion/my-posts")}
          className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all text-center border border-gray-100 group"
        >
          <History className="text-gray-400 group-hover:text-[#2563eb] mb-2 transition-colors" />
          <div className="text-sm font-bold text-gray-700">My Posts</div>
        </Link>
        <Link to="/travel-companion/guidelines" className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all text-center border border-gray-100 group">
          <ShieldMoon className="text-gray-400 group-hover:text-[#2563eb] mb-2 transition-colors" />
          <div className="text-sm font-bold text-gray-700">Safety Guidelines</div>
        </Link>
      </div>

      {/* Info Section */}
      <div className="max-w-5xl mx-auto mt-20 bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 text-[#2563eb] mb-4">
          <Info />
          <span className="font-bold uppercase tracking-wider text-sm">How it works</span>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <div className="text-3xl font-black text-gray-200 mb-2">01</div>
            <h3 className="font-bold text-gray-900 mb-2">Post your trip</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Share your flight route and dates. Whether you're seeking help or offering it, the process takes less than 2 minutes.
            </p>
          </div>
          <div>
            <div className="text-3xl font-black text-gray-200 mb-2">02</div>
            <h3 className="font-bold text-gray-900 mb-2">Get Matched</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Our system identifies travelers on the same route. Connect via in-app chat to discuss details.
            </p>
          </div>
          <div>
            <div className="text-3xl font-black text-gray-200 mb-2">03</div>
            <h3 className="font-bold text-gray-900 mb-2">Travel Together</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Meet at the airport or transit point. Help with navigation, translation, or just provide friendly company.
            </p>
          </div>
        </div>
      </div>
      {/* Bottom Banner Image */}
      <div className="max-w-5xl mx-auto mt-16 mb-12 overflow-hidden rounded-[40px] shadow-2xl">
        <img 
          src="/img/travelCompanion/banner.jpg" 
          alt="Travel with family and friends" 
          className="w-full h-auto object-cover max-h-[500px]"
        />
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default TravelCompanionLanding;
