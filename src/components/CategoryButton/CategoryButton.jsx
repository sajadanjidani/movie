import { useCategorySlider } from "../../context/CategorySliderContext";

export default function CategoryButton({ title, value }) {
  const { categories, toggleCategory } = useCategorySlider();

  const isSelected = categories.includes(value);

  return (
    <label className="group inline-block my-2 cursor-pointer text-nowrap">
      <input
        type="checkbox"
        value={value}
        checked={isSelected}
        onChange={() => toggleCategory(value)}
        className="sr-only"
      />

      <span
        className={`
          mt-3 inline-block rounded-4xl border border-[#EC5BAA] px-7 py-2
          ${isSelected ? "bg-[#EC5BAA]" : ""}
        `}
      >
        {title}
      </span>
    </label>
  );
}