
export default function StudiosItem({alt , srcImage}) {
  return (
    <div className="flex justify-center items-center bg-[#030A1B] dark:bg-[#EBFAFF] w-40 h-40 rounded-4xl">
      <img alt={alt} src={srcImage} />
    </div>
  )
}
