const TagButton = ({ href = "#0", text }: { href?: string; text: string }) => {
  return (
    <a
      href={href}
      className="mb-3 mr-3 inline-flex items-center justify-center border border-[#E3E8EF] px-4 py-2 text-sm text-[#333333] duration-300 hover:border-[#d16013] hover:text-[#d16013]"
    >
      {text}
    </a>
  );
};

export default TagButton;
