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
      <div className="flex flex-col" id={id}>
        <label htmlFor={id}>{label} :</label>
        <input
          className="border border-white"
          name={id}
          type={type}
          placeholder={placeholder}
          onChange={(e) => handleChange(e)}
        />
      </div>
    </>
  );
};
