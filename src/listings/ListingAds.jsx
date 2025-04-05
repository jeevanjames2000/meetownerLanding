const ListingAds = () => {
  return (
    <>
      <div className="hidden lg:block md:block w-[22%] h-full bg-white relative p-3 rounded-xl shadow-lg overflow-hidden">
        <div className="relative rounded-lg">
          <img
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&h=400"
            alt="Featured Property"
            className="w-full h-64 object-cover rounded-md"
          />
          <div className="absolute bottom-2 right-2 flex gap-2">
            <p className="bg-inherit text-[#fff] font-normal hover:bg-white cursor-pointer hover:text-black px-2 rounded-lg border-1 border-[#ffffff] transition">
              View Details
            </p>
            <p className="bg-inherit text-[#fff] font-normal px-2 hover:bg-white hover:text-black cursor-pointer rounded-lg border-1 border-[#ffffff] transition">
              Contact
            </p>
          </div>
        </div>

        <div className="py-3">
          <div className="grid grid-cols-2 gap-4 mb-8">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="relative rounded-xl shadow-lg overflow-hidden"
              >
                <div className="bg-[#1D3A76] text-white text-sm font-medium py-2 px-4 text-center">
                  Latest Property
                </div>
                <div className="bg-gray-50 rounded-b-lg overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&h=200&q=${i}`}
                    alt={`Property ${i}`}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4 text-left">
                    <p className="font-bold text-gray-900">₹1.5 Cr</p>
                    <h4 className="font-semibold">Lake View Apartment</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      Modern 3BHK apartment with premium amenities and lake
                      view.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-6 text-left">
            <h3 className="text-lg font-semibold mb-4">
              More Properties By Meet Owner
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex gap-2 border-1 border-gray-400 rounded-lg"
                >
                  <img
                    src={`https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=100&h=100&q=${
                      i + 2
                    }`}
                    alt={`Property ${i}`}
                    className="w-14 h-14 rounded object-cover"
                  />
                  <div className="flex flex-col items-center justify-center">
                    <p className="font-bold text-sm text-gray-900">₹1.8 Cr</p>
                    <p className="text-sm text-gray-600">3 BHK</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full bg-gray-100 text-blue-600 py-2 rounded-lg hover:bg-gray-200 transition">
              View All Properties
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListingAds;
