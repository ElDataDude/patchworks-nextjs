const TagButton = ({ text }: { href?: string; text: string }) => {
  return (
    <span className="mb-3 mr-3 inline-flex items-center justify-center border border-[#E3E8EF] px-4 py-2 text-sm text-[#626875]">
      {text}
    </span>
  );
};

export default TagButton;
