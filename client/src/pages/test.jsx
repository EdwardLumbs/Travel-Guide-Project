return (
    <div className='p-9 flex justify-center'>
        <div className=''>
            {/* ... existing code ... */}

            {loading ? (
                <p className='text-3xl font-semibold'>Loading...</p>
            ) : error ? (
                <p className='text-3xl font-semibold'>{error}</p>
            ) : (
                <div className='flex flex-wrap gap-4'>
                    {destinations.length > 0 &&
                        destinations.map((destination) => (
                            <Link
                                to={
                                    destination.country
                                        ? `${destination.continent_name}/${destination.country}`
                                        : `${destination.continent_name}`
                                }
                            >
                                <DestinationCard
                                    key={destination.country}
                                    destination={destination}
                                />
                            </Link>
                        ))}
                </div>
            )}

            {/* Pagination Controls */}
            <div className='flex justify-center my-4'>
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className='px-4 py-2 mr-2 bg-blue-500 text-white'
                >
                    Previous Page
                </button>
                <span className='text-lg font-semibold'>{page}</span>
                <button
                    onClick={() => handlePageChange(page + 1)}
                    className='px-4 py-2 ml-2 bg-blue-500 text-white'
                >
                    Next Page
                </button>
            </div>
        </div>
    </div>
);
}