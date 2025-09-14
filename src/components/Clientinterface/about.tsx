import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';
const About: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12" style={{ paddingTop: '85px' }}>
        {/* Hero Section */}
        <section className="bg-white rounded-xl overflow-hidden shadow-sm mb-10">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                About EcoWaste Management
              </h1>
              <p className="text-gray-600 mb-6">
                We are committed to creating a sustainable future through responsible e-waste management.
                Our mission is to reduce electronic waste and promote recycling through innovative solutions.
              </p>
              <div className="flex gap-3">
                <button style={{cursor: 'pointer'}} className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
                  Our Services
                </button>
                <button onClick={() => navigate("/contact")} style={{cursor: 'pointer'}} className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                  Contact Us
                </button>
              </div>
            </div>
            <div className="md:w-1/2 bg-green-600">
              <img 
                src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                alt="E-waste recycling" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              At EcoWaste Management, we're dedicated to addressing the growing challenge of electronic waste 
              through sustainable collection, processing, and recycling practices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Efficient Collection</h3>
              <p className="text-gray-600">
                We make it easy for individuals and businesses to responsibly dispose of electronic waste through 
                our convenient pickup services and drop-off locations.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Responsible Recycling</h3>
              <p className="text-gray-600">
                We ensure that all collected e-waste is processed according to the highest environmental standards, 
                recovering valuable materials and minimizing landfill waste.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Environmental Impact</h3>
              <p className="text-gray-600">
                By diverting e-waste from landfills, we reduce toxic pollution and conserve natural resources 
                through the recovery and reuse of valuable materials.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="bg-white rounded-xl p-8 mb-16 shadow-sm">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <p className="text-gray-600 mb-4">
                EcoWaste Management was founded in 2015 with a simple but powerful vision: to transform the way 
                electronic waste is handled in our communities. What began as a small collection service has 
                grown into a comprehensive e-waste management solution.
              </p>
              <p className="text-gray-600 mb-4">
                Our team of environmental specialists, technology experts, and logistics professionals work 
                together to provide efficient and environmentally responsible e-waste disposal services. 
                We've processed over 10,000 tons of electronic waste since our inception, recovering valuable 
                materials and ensuring hazardous components are properly handled.
              </p>
              <p className="text-gray-600">
                Today, we're proud to serve both residential and commercial clients, offering customized 
                solutions that meet the unique needs of each customer while contributing to a more 
                sustainable future.
              </p>
            </div>
            
            <div className="md:w-1/3">
              <img 
                src="https://images.unsplash.com/photo-1605600659953-4e6b9e0d4af5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80" 
                alt="Team working on e-waste recycling" 
                className="w-full h-full object-cover rounded-lg shadow-md"
              />
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Leadership Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Samantha Singh",
                position: "Chief Executive Officer",
                bio: "With over 15 years of experience in sustainable waste management, Samantha leads our company's strategic vision.",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80"
              },
              {
                name: "David Kumar",
                position: "Operations Director",
                bio: "David oversees our collection and processing operations, ensuring efficient and environmentally sound practices.",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80"
              },
              {
                name: "Priya Patel",
                position: "Technology Officer",
                bio: "Priya leads our technology initiatives, developing innovative solutions for tracking and processing e-waste.",
                image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80"
              }
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="h-64">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-green-600 font-medium text-sm mb-3">{member.position}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Environmental Impact */}
        <section className="bg-green-50 rounded-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Environmental Impact</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">10K+</div>
              <p className="text-gray-700">Tons of e-waste processed</p>
            </div>
            
            <div className="p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">85%</div>
              <p className="text-gray-700">Materials recovered and recycled</p>
            </div>
            
            <div className="p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
              <p className="text-gray-700">Collection points nationwide</p>
            </div>
            
            <div className="p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">15K</div>
              <p className="text-gray-700">Trees saved through recycling</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-green-600 rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Mission</h2>
          <p className="text-green-100 max-w-2xl mx-auto mb-8">
            Whether you're an individual looking to dispose of old electronics or a business seeking a reliable 
            e-waste management partner, we're here to help. Together, we can make a positive impact on our environment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-white text-green-600 font-medium rounded-lg hover:bg-gray-100 transition-colors">
              Schedule a Pickup
            </button>
            <button className="px-6 py-3 border border-white text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
              Learn About Our Services
            </button>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">EcoWaste Management</h3>
              <p className="text-gray-400">
                Leading the way in sustainable e-waste recycling and management solutions.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Services</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Services</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Residential Pickup</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Business Solutions</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">E-Waste Recycling</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Data Destruction</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-gray-400">
                <li>123 Green Street</li>
                <li>Colombo, Sri Lanka</li>
                <li>Phone: (123) 456-7890</li>
                <li>Email: info@ecowaste.com</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2023 EcoWaste Management. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default About;
