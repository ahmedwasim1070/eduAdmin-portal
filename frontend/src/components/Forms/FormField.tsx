// Type for TextFormField
type TextFormFieldProps = {
  label: string;
  id: string;
  type: string;
  placeholder: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const TextFormField = ({
  label,
  id,
  type,
  placeholder,
  handleChange,
}: TextFormFieldProps) => {
  return (
    <>
      <div className="flex flex-col py-1" id={id}>
        <label className="pb-2 text-textColor" htmlFor={id}>{label}</label>
        <input
          className="border border-primaryColor rounded-lg text-textColor p-2 outline-none"
          name={id}
          type={type}
          placeholder={placeholder}
          onChange={(e) => handleChange(e)}
        />
      </div>
    </>
  );
};
