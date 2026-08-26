export default function CategoryButton() {
  return (
    <label className="group inline-block hover:cursor-pointer my-2">
      <input
        type="checkbox"
        className="sr-only"
      />

      <span className="px-7 py-2 border border-[#EC5BAA] rounded-4xl mt-3 inline-block group-has-checked:bg-[#EC5BAA]">
        Drama
      </span>
    </label>
  );
}