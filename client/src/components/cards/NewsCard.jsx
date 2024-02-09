export default function NewsCard({article}) {
    return (
        <div className='bg-white shadow-md hover:shadow-lg 
        transition-shadow overflow-hidden rounded-lg w-full sm:w-[300px]'>
            <img 
                className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
                src={article.urlToImage} 
                alt="Cover Image" 
            />
            <div className="py-4 px-4 flex flex-col gap-1">
                <p className="text-sm font-semibold line-clamp-1">
                    author: {article.author}
                </p>
                <p className='text-2xl font-bold line-clamp-2'>
                    {article.title}
                </p>
                <p className="text-sm text-gray-600 line-clamp-2">
                    {article.description}
                </p>
            </div>
        </div>
    )
  }
  