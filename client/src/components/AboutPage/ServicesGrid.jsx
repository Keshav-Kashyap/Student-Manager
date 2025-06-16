import React from 'react';

const ServicesGrid = () => {
  const services = [
    {
      title: "Wedding Cards",
      description: "Beautiful wedding invitation cards with traditional and modern designs",
      color: "from-pink-400 to-rose-500"
    },
    {
      title: "Business Cards", 
      description: "Professional business cards for your brand identity",
      color: "from-blue-400 to-indigo-500"
    },
    {
      title: "ID Cards",
      description: "Official ID cards for institutions and organizations",
      color: "from-green-400 to-teal-500"
    },
    {
      title: "Visiting Cards",
      description: "Elegant visiting cards for personal and professional use",
      color: "from-purple-400 to-violet-500"
    },
    {
      title: "Pamphlets/Leaflets",
      description: "Eye-catching promotional materials for your business",
      color: "from-orange-400 to-red-500"
    },
    {
      title: "Digital Printing",
      description: "High-quality digital printing for all your needs",
      color: "from-cyan-400 to-blue-500"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Complete printing solutions for all your personal and business needs
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="group">
              <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
                <div className={`h-2 bg-gradient-to-r ${service.color}`}></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;