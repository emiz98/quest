import { TrashIcon } from "@heroicons/react/24/solid";
const FlashCard = ({ title, img, index }) => {
  return (
    <div
      className="flex items-center justify-between 
    bg-gray-100 rounded-lg p-2 border-2 border-red-200"
    >
      <div className="flex items-center gap-x-5">
        <div
          className="border-2 border-red-200 p-6 rounded-lg
        text-xl font-medium text-gray-600"
        >
          #{index}
        </div>
        <img src={img} alt={title} className="h-20 w-20 rounded-lg" />
        <h2 className="text-lg font-medium">{title}</h2>
      </div>
      <div className="flex items-center gap-x-2">
        <button className="btn p-3">
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default FlashCard;
