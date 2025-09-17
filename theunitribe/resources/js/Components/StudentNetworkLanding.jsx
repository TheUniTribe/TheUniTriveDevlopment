import PrimaryButton from './PrimaryButton';
import { FiUsers } from 'react-icons/fi';

const StudentNetworkLanding = () => {
  return (
    <div className="h-[85vh] bg-background flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Animated Icon */}
        <div className="flex justify-center">
          <FiUsers
            className="text-6xl text-blue-600"
            style={{ animation: 'bounce 1s ease-in-out 1' }}
          />
        </div>
        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
          Connect. Learn. Thrive.
        </h1>
        
        {/* Subheading */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Join the ultimate student network platform for academic growth, career
          exploration, and peer-to-peer engagement. Build your future with fellow
          students worldwide.
        </p>
        
        {/* CTA Button */}
        <div className="pt-4">
          <PrimaryButton className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out px-8 py-4 text-lg rounded-lg">
            Join Your Student Network
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default StudentNetworkLanding;
