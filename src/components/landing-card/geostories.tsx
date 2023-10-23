import { FC } from 'react';

import Link from 'next/link';

import { AnimatePresence, motion } from 'framer-motion';
import { HiOutlineArrowTopRightOnSquare, HiArrowRight } from 'react-icons/hi2';

import cn from '@/lib/classnames';

import { Geostory } from '@/types/geostories';

const Card: FC<Partial<Geostory> & { color?: string; headColor?: string }> = ({
  title,
  id,
  layers,
  color,
  headColor,
}) => (
  <AnimatePresence>
    <motion.div
      className="min-h-[388px] w-[384px]"
      style={{ backgroundColor: color }}
      data-testid={`card-${id}`}
      whileHover={{
        translateY: '-10px',
      }}
      transition={{ duration: 0.1 }}
    >
      <div className="space-y-6 p-6 text-secondary-500" style={{ backgroundColor: headColor }}>
        <div>
          <span data-testid={`card-type-${id}`} className="text-xs uppercase">
            geostory
          </span>
          <h2 data-testid={`card-title-${id}`} className="font-satoshi text-2xl font-bold">
            {title}
          </h2>
        </div>
        <Link
          href={`/map/geostories/${id}`}
          data-testid={`card-link-${id}`}
          className={cn(
            'flex items-center space-x-4 py-2 text-xs font-bold text-secondary-500 transition-colors hover:underline'
          )}
        >
          <HiOutlineArrowTopRightOnSquare className="h-5 w-5" />
          <span className="hover:underline ">Go to geostory</span>
        </Link>
      </div>
      <div className="p-6">
        <span className="text-xs font-medium uppercase">monitor</span>
        {/* TO DO - change it for monitor when the API is ready */}
        <motion.div className="flex items-center" initial="initial" whileHover="hover">
          <Link
            href={`/map/${layers[0].layer_id}/datasets`}
            className="relative w-full items-center font-bold underline"
          >
            <motion.span
              className="absolute left-0 top-2 inline-flex h-full w-full hover:opacity-100"
              variants={{
                hover: { opacity: 1 },
              }}
              transition={{ duration: 0.15 }}
            >
              <HiArrowRight className="inline-block h-5 w-5" />
              <motion.span
                className="inline-flex whitespace-normal pb-11"
                variants={{
                  initial: {
                    x: 0,
                    position: 'absolute',
                    left: 0,
                    width: '100%',
                    backgroundColor: color,
                  },
                  hover: { x: 20, position: 'relative' },
                }}
                transition={{ duration: 0.15 }}
              >
                {layers[0].title}
              </motion.span>
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  </AnimatePresence>
);

export default Card;
