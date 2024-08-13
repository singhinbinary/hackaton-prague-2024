// core
import type { NextPage } from 'next';

// components
import NavBar from '../components/NavBar/NavBar';
import SocialGraph from '../components/SocialGraph/SocialGraph';

const Home: NextPage = () => {
  return (
    <div>
      <NavBar />
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <SocialGraph />
        </div>
      </section>
    </div>
  );
};

export default Home;
