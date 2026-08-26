export default function CategoryButton({title , value}) {
  return (
    <label className="group inline-block hover:cursor-pointer my-2 text-nowrap">
      <input
        type="checkbox"
        value={value}
        className="sr-only"
      />

      <span className="px-7 py-2 border border-[#EC5BAA] rounded-4xl mt-3 inline-block group-has-checked:bg-[#EC5BAA]">
        {title}
      </span>
    </label>
  );
}