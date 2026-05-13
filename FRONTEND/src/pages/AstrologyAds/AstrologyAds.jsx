import { useParams, Navigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";

import FindAstrology from "./FindAstrology";
import PostAstrology from "./PostAstrology";
import AstrologerProfile from "./AstrologerProfile";
import PostConfirmation from "../PostConfirmation";

function AstrologyAds({ actionType }) {
  const { action, idOrSlug } = useParams();

  const currentAction = actionType || action;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        {currentAction === undefined && <Navigate to="/astrologer/find" replace />}
        
        {currentAction === "find" && <FindAstrology />}
        {currentAction === "post" && <PostAstrology />}
        {currentAction === "profile" && <AstrologerProfile idOrSlug={idOrSlug} />}
        
        {currentAction === "postConfirmation" && (
          <PostConfirmation 
            redirectTo="/astrologer/find" 
            message="Thanks for using Desipath. Your astrology ad is live!" 
          />
        )}
      </main>

      <Footer newsletter={"block"} />
    </div>
  );
}

export default AstrologyAds;
