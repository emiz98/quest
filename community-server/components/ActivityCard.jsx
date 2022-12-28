import { EyeIcon } from "@heroicons/react/24/outline";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";

const ActivityCard = ({ title, img }) => {
  const router = useRouter();
  const slug = "test";

  return (
    <div className="group cursor-pointer">
      <div className="rounded-xl h-60 object-cover w-full relative overflow-hidden">
        <EyeIcon
          onClick={() => router.push({ pathname: `/activity/${slug}` })}
          className="absolute left-0 right-0 z-20 h-12 w-12 top-0 bottom-0 p-2 hover:bg-red-600
         text-white hidden group-hover:inline-block m-auto bg-red-500 rounded-full"
        />
        <div
          className="hidden group-hover:inline-block absolute
         z-10 h-full w-full bg-black opacity-20"
        />
        <img
          className="rounded-xl h-full object-cover w-full duration-300
        group-hover:scale-105 transition-all ease-in-out absolute"
          src={img}
          alt="cover_image"
        />
        <div className="absolute top-0 p-2 w-full flex items-center justify-between z-30">
          <button className="btn px-3">
            <TrashIcon className="h-4 w-4" />
          </button>
          <span className="text-white bg-black p-2 rounded-lg font-medium text-sm">
            x5 Cards
          </span>
        </div>
      </div>

      <div className="mt-5">
        <h3
          onClick={() => router.push({ pathname: `/activity/${slug}` })}
          className="text-lg font-medium hover:underline"
        >
          {title}
        </h3>
        <p className="text-sm text-gray-600 mb-5">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officia
          officiis autem fugit
        </p>
      </div>
    </div>
  );
};

export default ActivityCard;
