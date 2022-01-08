/** @jsxRuntime classic */
/** @jsx jsx */
import { useState } from 'react'
import { css, jsx, keyframes } from '@emotion/react'
import { Movie } from '@lib/types'
import { Link } from 'react-location'
import { useFloating, shift } from '@floating-ui/react-dom'

const Card: React.FC<{ movie: Movie }> = ({ movie }) => {
   const [loaded, setLoaded] = useState<boolean>(false)
   const [error, setError] = useState<boolean>(false)
   const { x, y, reference, floating, strategy } = useFloating({
      placement: 'top-start',
      middleware: [shift()]
   })

   const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      e.currentTarget.src = movie.poster.fallback
      setError(true)
   }

   const slide = keyframes`
      from {
         transform: translateX(-100%);
      }
      to {
         transform: translateX(50%)
      }
   `

   const loader = css`
      --bg: hsl(var(--navy-200));
      --fg: hsl(var(--blue-100) / 0.1);

      background: var(--bg);
      &::before {
         content: '';
         display: block;
         height: 100%;
         width: 200%;
         transform: translateX(0);
         background: linear-gradient(
            90deg,
            var(--bg) 0%,
            var(--fg) 40%,
            var(--fg) 65%,
            var(--bg) 100%
         );
         animation: ${slide} 2s linear infinite;
      }
   `

   return (
      <Link
         to={`movie/${movie._id}`}
         className='grid grid-rows-[min-content_auto] relative w-full'
         preload={5000}
      >
         <div
            className={`transition-all rounded-md inline-block relative w-full z-10 overflow-hidden aspect-[10/16]`}
         >
            <img
               src={movie.poster.url}
               alt={movie.title}
               loading='lazy'
               className='shadow-center h-full object-cover absolute top-0 left-0 w-full z-0'
               onLoad={() => setLoaded(true)}
               onError={e => handleError(e)}
               css={css`
                  opacity: ${!loaded && 0};
               `}
            />
            {!loaded && (
               <div className='h-full object-cover absolute top-0 left-0 w-full z-0' css={loader} />
            )}
         </div>
         <div
            className={`text-left text-[0.8rem] lg:text-xl mt-2 relative ${
               loaded ? 'w-fit h-fit' : 'h-4 md:h-6 w-[80%] overflow-hidden rounded-md'
            }`}
            css={!loaded && loader}
         >
            {movie.title}
         </div>
      </Link>
   )
}

export default Card
